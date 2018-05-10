/**
 * @file preview, preview the componets by webpack
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const spawn = require('child_process').spawn;
const lib = require('./utils/lib');

let lastApimToken;
let lastApimPort;
// editor config parser, only get name-value key then return
function getProps(content, cmptName) {
    if (Object.prototype.toString.call(content.propertiesGroup) !== '[object Array]') {
        console.log(chalk.red(`
${cmptName}组件 Type Error, propertiesGroup should be an array`));
        process.exit(1);
    }
    let props = {
        widgetStatus: {
            w1: true
        },
        widgetLogs: {
            w1: {}
        },
        widgetEvents: {
            w1: {}
        },
        widgetDatas: {
            w1: {}
        },
        widgetProps: {
            w1: {}
        }
    };
    content.propertiesGroup.forEach(group => {
        if (!Array.isArray(group.properties)) {
            console.log(chalk.red(`
${cmptName}组件 Type Error, properties should be an array`));
            process.exit(1);
        }
        group.properties.forEach(item => {
            props.widgetProps.w1[item.name] = item.value;
        });
    });
    content.widgetLogs.forEach(group => {
        content.widgetLogs.forEach(item => {
            props.widgetLogs.w1[item.name] = item.value;
        });
    });
    content.widgetEvents.forEach(group => {
        content.widgetEvents.forEach(item => {
            props.widgetEvents.w1[item.name] = item.value;
        });
    });
    content.widgetDatas.forEach(group => {
        content.widgetDatas.forEach(item => {
            props.widgetDatas.w1[item.name] = item.value;
        });
    });
    return props;
}

function replaceContentFn(replacePathName, serverPathName, content, props) {
    /* TO BE REPLACED */
        // xxx
    /* TO BE REPLACED */
    let regExp = /\/\*\s*TO\s*BE\s*REPLACED\s*\*\/([\s\S]*)(?=[\n\r\s\t\v.]*\/\*\s*TO\s*BE\s*REPLACED\s*\*)/g;
    let exampleContent = fs.readFileSync(replacePathName, {
        encoding: 'utf8'
    });
    let replaceContent = exampleContent.replace(regExp, (m, p1) => {
        if (m) {
            return `/* TO BE REPLACED */
        return ${props};\n`;
        }
    });

    fs.writeFileSync(replacePathName, replaceContent, {
        encoding: 'utf8'
    });

    let serverContent = fs.readFileSync(serverPathName, {
        encoding: 'utf8'
    });
    let serverReplaceContent = serverContent.replace(regExp, (m, p1) => {
        if (m) {
            return `/* TO BE REPLACED */
    schemaToken: '${content.apimToken}',
    port: ${content.apimPort},
`;
        }
    });

    fs.writeFileSync(serverPathName, serverReplaceContent, {
        encoding: 'utf8'
    });

}

function bootstrap() {
    let npmCommand = lib.getNpmCommand();

    let debuggerInfo = spawn(npmCommand, ['run', 'debug']);

    debuggerInfo.stdout.on('data', data => {
        console.log(chalk.green(data.toString()));
    });

    debuggerInfo.stderr.on('data', data => {
        console.log(chalk.red(data.toString()));
    });
}

function injectCode(pathName, replacePathName, serverPathName, cmptName, content) {
    let props = JSON.stringify(getProps(content, cmptName));
    replaceContentFn(replacePathName, serverPathName, content, props);
}

function injectData(pathName, replacePathName, cmptName, content) {
    delete require.cache[require.resolve(pathName)];
    content = content ? content : babel.transformFileSync(pathName, {
        presets: [['@babel/preset-env', {
            modules: 'commonjs'
        }]]
    }).code;
    content = eval(content);

    lastApimToken = content.apimToken;
    lastApimPort = content.apimPort;
    let serverPathName = path.join(process.cwd(), 'build', 'server.js');
    // inject editor config
    injectCode(pathName, replacePathName, serverPathName, cmptName, content);
}

function main() {
    let cmptName = lib.getCmptName();
    let pathName = path.join(process.cwd(), 'src', cmptName, cmptName + '.editor.js');
    let replacePathName = path.join(process.cwd(), 'preview', 'App.js');

    injectData(pathName, replacePathName, cmptName);

    fs.watch(pathName, function (eventType, fileName) {
        console.log(chalk.white(
`${fileName} changed: ${eventType}`));
        try {
            delete require.cache[require.resolve(pathName)];
            let editorConf = babel.transformFileSync(pathName, {
                presets: [['@babel/preset-env', {
                    modules: 'commonjs'
                }]]
            }).code;
            editorConf = eval(editorConf);

            if (editorConf.apimToken === lastApimToken && editorConf.apimPort === lastApimPort) {
                // apim配置没改变
                injectData(pathName, replacePathName, cmptName, editorConf);
            }
            else {
                // apim配置改变
                let serverPathName = path.join(process.cwd(), 'build', 'server.js');
                injectCode(pathName, replacePathName, serverPathName, cmptName, editorConf);
                // injectData(pathName, replacePathName, cmptName, editorConf);
            }
        }
        catch (ex) {
            console.log(chalk.red(ex.message));
        }
    });

    bootstrap();
}

module.exports = main;
