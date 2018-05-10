/**
 * @file create a Scaffold
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const chalkAnimation = require('chalk-animation');
const childProcess = require('child_process');
const Config = require('./utils/Config');
const util = require('./utils/lib');
const spawn = require('child_process').spawn;
const http = require('http');
const request = require('request');

const nodeModulePackageUrl = `//http://eopa.bdstatic.com/node_module_cache/fe/node_modules.tar.gz`;

function getPackages(cmptName) {
    return new Promise((resolve, reject) => {
        shell.cd(cmptName);
        let writeStream = request(nodeModulePackageUrl).pipe(fs.createWriteStream('node_modules.tar'));
        writeStream.on('close', () => {
            shell.exec('tar -zxvf node_modules.tar');
            shell.rm('node_modules.tar');
            resolve(true);
        });
        writeStream.on('error', () => {
            resolve(false);
        });
    })
}

function installTask() {
    return new Promise((resolve, reject) => {
        let npmCommand = util.getNpmCommand();

        let runBuild = spawn(npmCommand, ['i', '--registry=http://registry.npm.baidu.com']);

        runBuild.stdout.on('data', data => {
            console.log(chalk.green(data.toString()));
        });

        runBuild.stderr.on('data', data => {
            console.log(chalk.red(data.toString()));
            reject(data);
        });

        runBuild.stdout.on('close', () => {
            resolve(true);
        });
    });
}

function main(cmptName) {
    let confPath = Config.getConfigPath();
    if (!fs.existsSync(confPath)) {
        const CONFIGTPL = '{"userName": "${userName}","token": "${token}","uploadUrl":"http://eop.baidu.com/upload/widget"}';
        fs.writeFileSync(confPath, CONFIGTPL, {
            encoding: 'utf8'
        });
    }

    let re = /\/|\-|\_/g;
    if (re.test(cmptName)) {
        console.log(chalk.red(`
创建失败！`));
        console.log(chalk.white(
            `
组件名以驼峰形式命名,不得包含'/', '-'. '_'字符
            `
        ));
        process.exit(1);
    }

    let isExist = fs.existsSync(cmptName);
    if (isExist) {
        console.log(chalk.red(`
创建失败！`));
        console.log(chalk.white(
            `
${cmptName} 组件目录已存在!
            `
        ));
        process.exit(1);
    }

    let cp = childProcess.fork(
        path.join(__dirname, 'utils', 'copy')
    );

    console.log(chalk.white(`
${cmptName}组件 全速创建中...`));

    cp.on('message', data => {
        if (data.progress === 1) {
            // TODO: download node_modules;
            console.log(`
开始全力加载node_modules...`);
            try {
                getPackages(cmptName).then(() => {
                    console.log(chalk.green(`
创建完成！`));
                    process.exit(0);
                })
                .catch(err => {
                    installTask().then(() => {
                        console.log(chalk.green(`
创建完成！`));
                        process.exit(0);
                    })
                });
            }
            catch (ex) {
                console.log(chalk.red(ex));
            }
        }
    });

    cp.send({
        cmptName: cmptName
    });
}

module.exports = main;
