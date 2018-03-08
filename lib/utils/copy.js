/**
 * @file copy boilerplate
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const lib = require('./lib');

const SRCPATH = path.join(__dirname, '..', 'srcTpl');
const TPLPATH = path.join(__dirname, '..', 'template');
const PREVIEWPATH = path.join(__dirname, '..', 'previewTpl');

function pipeFiles(srcPath, tarPath, data, cmptName) {
    let files = fs.readdirSync(srcPath);
    let oriTarDirPath = '';
    files.forEach(item => {
        let templatePath = path.join(srcPath, item);
        let fileContent = lib.compile(templatePath, data);
        if (cmptName) {
            shell.mkdir('-p', path.join('src', cmptName));
            oriTarDirPath = tarPath;
            tarPath = path.join(tarPath, cmptName);
            item = item.replace('demo', cmptName);
        }
        let targetPath = path.join(tarPath, item);
        fs.writeFileSync(targetPath, fileContent);
        cmptName && (tarPath = oriTarDirPath);
    });
}

function run(cmptName) {
    shell.mkdir('-p', cmptName);

    // cp通用脚手架文件
    shell.cd(cmptName);
    shell.cp('-r', path.join(TPLPATH, '*'), '.');
    shell.cp('-r', path.join(TPLPATH, '.babelrc'), '.');
    shell.cp('-r', path.join(TPLPATH, '.ignore'), '.');
    shell.mv('.ignore', '.gitignore');
    shell.mkdir('-p', 'preview');

    // 写入与`cmptName`关联的需替换的模板文件
    let data = {
        cmptName: cmptName,
        cmptTagName: lib.camel2kebab(cmptName),
        yourName: lib.getUserName()
    };

    pipeFiles(SRCPATH, 'src', data, cmptName);
    pipeFiles(PREVIEWPATH, 'preview', data);

    // 组件名写入配置文件
    let packageContent = lib.compile('package.json', {
        cmptName: cmptName
    });

    fs.writeFileSync('package.json', packageContent);
    shell.cd('..');

    process.send({
        progress: 1
    });
}

function main() {
    process.on('message', function (data) {
        run(data.cmptName);
    });
}

module.exports = main();
