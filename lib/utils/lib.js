/**
 * @file lib
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const fs = require('fs');
const os = require('os');
const etpl = require('etpl');
const path = require('path');

const tplEngine = new etpl.Engine({
    variableOpen: '${',
    variableClose: '}',
    encoding: 'UTF-8'
});

module.exports = {
    camel2kebab: cmptName => {
        let tagName = cmptName.trim().replace(/([A-Z])/g, function (match, p1) {
            if (match) {
                return '-' + p1.toLowerCase();
            }
        });
        return 'san' + tagName;
    },

    getHome: () => {
        const ROOTNAME = os.platform() === 'win32'
                            ? 'APPDATA'
                            : 'HOME';
        return process.env[ROOTNAME];
    },

    getUserName: () => {
        return os.platform() === 'win32'
            ? process.env.USERNAME
            : process.env.USER;
    },

    compile: (templatePath, data) => {
        let content = fs.readFileSync(templatePath, {
            encoding: 'utf8'
        });
        let render = tplEngine.compile(content);
        return render(data);
    },

    getNpmCommand: () => {
        return os.platform() === 'win32' 
            ? 'npm.cmd'
            : 'npm';
    },

    getCmptName: () => {
        let cmptName;
        let packageFilePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packageFilePath)) {
            let content = fs.readFileSync(packageFilePath, {
                encoding: 'utf8'
            });
            try {
                content = JSON.parse(content);
                cmptName = content.config.cmptName;
            }
            catch (ex) {
            }
        }
        if (!cmptName) {
            console.log(chalk.red(`
组件名读取失败!`));
        console.log(chalk.white(`
请在package.json文件config字段补充cmptName信息!`));
        process.exit(1);
        }
        return cmptName;
    }
};
