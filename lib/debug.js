/**
 * @file preview, preview the componets by webpack
 * @author X-Jray(z.xuanjian@gmail.com)
*/

require('babel-register');

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const lib = require('./utils/lib');

// editor config parser, only get name-value key then return
function getProps(pathName, cmptName) {
    pathName = pathName.slice(0, -3);
    delete require.cache[require.resolve(pathName)];
    let content = require(pathName).default;
    if (Object.prototype.toString.call(content.propertiesGroup) !== '[object Array]') {
        console.log(chalk.red(`
${cmptName}组件 Type Error, propertiesGroup should be an array`));
        process.exit(1);
    }
    let props = {};
    content.propertiesGroup.forEach(group => {
        if (!Array.isArray(group.properties)) {
            console.log(chalk.red(`
${cmptName}组件 Type Error, properties should be an array`));
            process.exit(1);
        }
        group.properties.forEach(item => {
            props[item.name] = item.value;
        });
    });
    return props;
}

function replaceContent(pathName, props) {
    /* TO BE REPLACED */
        // xxx
    /* TO BE REPLACED */
    let regExp = /\/\*\s*TO\s*BE\s*REPLACED\s*\*\/[\n\r\s\t\v.]*((?:.|\n|\r\n|\r)*\})(?=[\n\r\s\t\v.]*\/\*\s*TO\s*BE\s*REPLACED\s*\*\/[\n\r\s\t\v.]*)/g;
    let exampleContent = fs.readFileSync(pathName, {
        encoding: 'utf8'
    });
    let replaceContent = exampleContent.replace(regExp, (m, p1) => {
        if (m) {
            return `/* TO BE REPLACED */
            props: ${props}`;
        }
    });

    fs.writeFileSync(pathName, replaceContent, {
        encoding: 'utf8'
    });
}

function injectCode(replacePathName, pathName, cmptName) {
    let props = JSON.stringify(getProps(pathName, cmptName));
    replaceContent(replacePathName, props);
}

function main() {
    let cmptName = lib.getCmptName();
    let pathName = path.join(process.cwd(), 'src', cmptName, cmptName + '.editor.js');
    let replacePathName = path.join(process.cwd(), 'preview', 'App.js');

    // inject editor config
    injectCode(replacePathName, pathName, cmptName);

    fs.watch(pathName, function (eventType, fileName) {
        console.log(chalk.white(
`${fileName} changed: ${eventType}`));
        injectCode(replacePathName, pathName, cmptName);
    });

    let npmCommand = lib.getNpmCommand();

    let output = spawn(npmCommand, ['run', 'preview']);

    output.stdout.on('data', data => {
        console.log(data.toString());
    });

    output.stderr.on('data', data => {
        console.log(data.toString());
    });
}

module.exports = main;
