/**
 * @file 配置类
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const fs = require('fs');
const path = require('path');
const lib = require('./lib');

class Config {
    constructor(userName='', token='', uploadUrl='http://eop.baidu.com/upload/widget') {
        this.userName = userName;
        this.token = token;
        this.uploadUrl = uploadUrl;
    }

    get props() {
        return {
            userName: this.userName || '',
            token: this.token || '',
            uploadUrl: this.uploadUrl || 'http://eop.baidu.com/upload/widget'
        };
    }

    set props(info) {
        let {userName, token, uploadUrl} = info;
        userName && (this.userName = userName);
        token && (this.token = token);
        uploadUrl && (this.uploadUrl = uploadUrl);
    }

    static getConfigPath() {
        const HOMEPATH = lib.getHome();
        return path.join(HOMEPATH, '.oawidget.json');
    }

    static getConfig() {
        const configPath = Config.getConfigPath();
        delete require.cache[require.resolve(configPath)];
        const content = fs.readFileSync(
            configPath,
            {
                encoding: 'utf8'
            }
        );
        let info = {};
        try {
            if (content) {
                info = JSON.parse(content);
            };
        }
        catch (ex) {
        }
        return info;
    }

    toString() {
        return `
你的当前配置如下:
    userName: ${this.userName}
    token: ${this.token}
    uploadUrl: ${this.uploadUrl}
        `;
    }

    save() {
        const info = this.props;
        fs.writeFileSync(
            Config.getConfigPath(),
            JSON.stringify(info, null, '\t')
        );
    }
}

module.exports = Config;
