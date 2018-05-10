/**
 * @file publish, publish the dist to server
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const request = require('superagent');
const Config = require('./utils/Config');
const lib = require('./utils/lib');
const help = require('./help');
const spawn = require('child_process').spawn;

let content;

function checkTask(cmptName) {
    return new Promise((resolve, reject) => {
        let pathName = path.join(process.cwd(), 'src', cmptName, cmptName + '.editor');
        content = require(pathName).default;
        let errMsg;
        if (!content.name) {
            errMsg = `请填写组件配置文件 ${cmptName}.editor.js 组件名(name)字段!`;
            reject(errMsg);
        }
        if (!content.displayName) {
            errMsg = `请填写组件配置文件 ${cmptName}.editor.js 组件中文名(displayName)字段!`;
            reject(errMsg);
        }
        if (!content.imgViewSrc) {
            errMsg = `请填写组件配置文件 ${cmptName}.editor.js 组件预览图(imgViewSrc)地址!`;
            reject(errMsg);
        }
        if (!content.type) {
            errMsg = `请填写组件配置文件 ${cmptName}.editor.js 组件(type)类型!`;
            reject(errMsg);
        }
        resolve(true);
    });
}

function buildTask(command) {
    return new Promise((resolve, reject) => {
        let npmCommand = lib.getNpmCommand();

        let runBuild = spawn(npmCommand, ['run', command]);

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

function uploadPrepareTask(cmptName, content) {

    return new Promise((resolve, reject) => {
        let metaPostData = {
            cmptName,
            name: content.name,
            displayName: content.displayName,
            type: content.type,
            imgViewSrc: content.imgViewSrc
        };

        let conf = Config.getConfig();
        let distAllPath = path.join(process.cwd(), 'dist', cmptName, cmptName + '-all.js');
        let distJsPath = path.join(process.cwd(), 'dist', cmptName, cmptName + '-compile.js');
        let distCssPath = path.join(process.cwd(), 'dist', cmptName, cmptName + '-compile.css');
        let distAll = fs.readFileSync(distAllPath);
        let distJs = fs.readFileSync(distJsPath);
        let distCss = fs.readFileSync(distCssPath);

        metaPostData.distAllPath = distAllPath;
        metaPostData.distJsPath = distJsPath;
        metaPostData.distCssPath = distCssPath;

        metaPostData.all = distAll;
        metaPostData.compileJs = distJs;
        metaPostData.compileCss = distCss;

        if (!conf.userName || !conf.token || !conf.uploadUrl) {
            help();
            reject(`请完善你的\`oawidget --config\`配置!`);
        }
        Object.assign(metaPostData, conf);
        resolve(metaPostData);
    });
}

function uploadTask(postData) {
    return new Promise((resolve, reject) => {
        request
            .post(postData.uploadUrl)
            .type('form')
            .field('token', postData.token)
            .field('username', postData.userName)
            .field('name', postData.cmptName)
            .field('displayName', postData.displayName)
            .field('previewImg', postData.imgViewSrc)
            .field('type', postData.type)
            .attach('all', postData.distAll)
            .attach('compileJs', postData.distJs)
            .attach('compileCss', postData.distCss)
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err) {
                    reject(`发布失败: ${err.message}`);
                }
                if (res.ok) {
                    let resData = JSON.parse(res.text);
                    if (+resData.status === 0) {
                        fs.unlinkSync(postData.distAllPath);
                        fs.unlinkSync(postData.distJsPath);
                        fs.unlinkSync(postData.distCssPath);
                        console.log(chalk.green(`发布成功! 
组件地址: ${resData.data.url}`))
                        resolve(true);
                    }
                    reject(`发布失败: ${resData.statusInfo}`);
                }
                reject(`发布失败: 网络错误`);
            });
    });
}

function main() {
    let cmptName = lib.getCmptName();

    console.log(chalk.white(`
组件配置检查中...`));  
    checkTask(cmptName).then(() => {
        console.log(chalk.white(`
组件配置检查通过！`)); 
        console.log(chalk.white(`
组件全速构建中...`));
        return buildTask('build');
    }).then(() => {
        return buildTask('build-preview');
    }).then(() => {
        console.log(chalk.white(`
组件构建完成！`)); 
        return uploadPrepareTask(cmptName, content);
    }).then((data) => {
        console.log(chalk.white(`
组件发布中...`)); 
        return uploadTask(data);
    }).then(() => {
        process.exit(0);
    }).catch((errMsg) => {
        console.log(chalk.red(`
${errMsg}`));
        process.exit(1);
    });
}

module.exports = main;
