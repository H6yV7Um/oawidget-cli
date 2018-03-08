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

function main(cmptName) {
    let confPath = Config.getConfigPath();
    if (!fs.existsSync(confPath)) {
        const CONFIGTPL = '{"username": "${username}","token": "${token}","uploadUrl":"http://eop.baidu.com/upload/widget"}';
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
组件名不得包含'/', '-'. '_'字符
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
            console.log(chalk.green(`
创建完成！`));
            process.exit(0);
        }
    });

    cp.send({
        cmptName: cmptName
    });
}

module.exports = main;
