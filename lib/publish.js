/**
 * @file publish, publish the dist to server
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const prompt = require('prompt');
const request = require('superagent');
const Config = require('./utils/Config');
const lib = require('./utils/lib');
const help = require('./help');

function sendPost(metaPostData) {
    request
        .post(metaPostData.uploadUrl)
        .type('form')
        .field('token', metaPostData.token)
        .field('username', metaPostData.userName)
        .field('name', metaPostData.cmptName)
        .field('displayName', metaPostData.displayName)
        .field('previewImg', metaPostData.previewImg)
        .field('type', metaPostData.type)
        .attach('file', metaPostData.file)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                console.log(chalk.red(`
发布失败！`));
                console.log(chalk.white(
                    `
${err.message}
                    `)
                );
                process.exit(1);
            }
            if (res.ok) {
                let resData = JSON.parse(res.text);
                if (+resData.status === 0) {
                    console.log(chalk.red(`
发布成功！`));
                    console.log(chalk.white(
                        `
组件地址: ${resData.data.url}
                        `)
                    );
                    fs.unlinkSync(metaPostData.filePath);
                    process.exit(0);
                }
                console.log(chalk.red(`
发布失败！`));
                console.log(chalk.white(
                    `
${resData.statusInfo}
                    `)
                );
                process.exit(1);
            }
            else {
                console.log(chalk.red(`
发布失败！`));
                console.log(chalk.white(
                    `
网络错误
                    `)
                );
            }
        });
}

function main() {
    let cmptName = lib.getCmptName();
    let metaPostData = {
        cmptName
    };
    let pathName = path.join(process.cwd(), 'src', cmptName, cmptName + '.editor');
    let content = require(pathName).default;
    if (!content.name || !content.displayName || !content.imgViewSrc) {
        console.log(chalk.red(`
请完善你的组件配置文件!`));
        process.exit(1);
    }
    else {
        metaPostData.name = content.name;
        metaPostData.displayName = content.displayName;
        metaPostData.type = content.type;
        metaPostData.previewImg = content.imgViewSrc;
    }

    let conf = Config.getConfig();
    let distPath = path.join(process.cwd(), 'dist', cmptName, cmptName + '.js');
    let file = fs.readFileSync(distPath);
    metaPostData.filePath = distPath;
    metaPostData.file = file;

    if (!conf.userName || !conf.token || !conf.uploadUrl) {
        console.log(chalk.red(`
请完善你的\`oawidget --config\`配置!`));
        help();
        process.exit(1);
    }
    Object.assign(metaPostData, conf);

    console.log(chalk.white(`
Hi, ${conf.userName}~
正在全力发布组件到 ${conf.uploadUrl}`));
    sendPost(metaPostData);
}

module.exports = main;
