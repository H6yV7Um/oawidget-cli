/**
 * @file create a Scaffold
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const chalk = require('chalk');
const Config = require('./utils/Config');
const lib = require('./utils/lib');

let conf;
function getConfigInstance() {
    if (!conf) {
        let {userName, token, uploadUrl} = Config.getConfig();
        conf = new Config(
            userName,
            token,
            uploadUrl
        );
    }
    return conf;
}

function updateConfig(key, value) {
    let conf = getConfigInstance();
    if (key === 'userName' || key === 'username') {
        conf.props = {
            userName: value
        };
    }
    else if (key === 'token') {
        conf.props = {
            token: value
        };
    }
    else if (key === 'uploadUrl' || key === 'uploadHost') {
        conf.props = {
            uploadUrl: value
        };
    }
    conf.save();
    console.log(chalk.green(`
更新成功！`));
    outputInfo();
}

function outputInfo() {
    let conf = getConfigInstance();
    console.log(chalk.whiteBright(
        conf.toString()
    ));
    process.exit(0);
}

function main(input) {
    if (!input || (input === 'list')) {
        outputInfo();
    }

    let [key, val] = input.split('=');
    if ((!key || !val)) {
            console.log(chalk.red(`
更新失败！`));
        console.log(chalk.white(
            `
配置信息非法, 可配置项 userName, token, uploadUrl, 格式e.g. userName=zhangxuanjian
            `
        ));
        process.exit(-1);
    }

    const valReg = /['"]?([-\w_\\:\?]+)['"]?/g;
    key = key.trim();
    val = val.trim()
        .replace(valReg, (p, m1) => {
            return m1;
        });

    const supportKeyName = [
        'username',
        'userName',
        'token',
        'uploadHost',
        'uploadUrl'
    ];

    if (!supportKeyName.includes(key)) {
        console.log(chalk.red(
            `
配置信息非法, 可配置项 userName, token, uploadUrl
            `
        ));
        process.exit(-1);
    }

    updateConfig(key, val);
}

module.exports = main;
