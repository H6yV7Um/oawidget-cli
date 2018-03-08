/**
 * @file check, check the component's validity
 * @author X-Jray(z.xuanjian@gmail.com)
*/

require('babel-register');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const lib = require('./utils/lib');

function main(cmptName) {
    let cmptName = lib.getCmptName();
    let pathName = path.join(process.cwd(), 'src', cmptName, cmptName + '.editor');

    delete require.cache[require.resolve(pathName)];
    let content = require(pathName).default;

    if (!content.name || !content.displayName || !content.imgViewSrc) {
        console.log(chalk.red(`
请完善你的组件配置文件!`));
        process.exit(1);
    }

    if (Object.prototype.toString.call(content.propertiesGroup) !== '[object Array]') {
        console.log(chalk.red(`
${cmptName} 组件配置文件Type Error, propertiesGroup should be an array！`));
        process.exit(1);
    }
    content.propertiesGroup.forEach(group => {
        if (Object.prototype.toString.call(group.properties) !== '[object Array]') {
            console.log(chalk.red(`
${cmptName} 组件配置文件Type Error, properties should be an array`));
            process.exit(1);
        }

        let re4Type = /\s*number|text|color|image|action|select|textarea|array\s*/;

        group.properties.forEach(item => {
            if (!re4Type.test(item.type)) {
                console.log(chalk.red(
`${cmptName} 组件配置文件Type Error, config type number|text|color|image|action|select|textarea|array`));
                process.exit(1);
            }
        });
    });
    console.log(chalk.green(cmptName + ' 组件配置文件检查通过！'));
}

module.exports = main;
