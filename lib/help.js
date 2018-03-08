/**
 * @file echo help info
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const chalk = require('chalk');

const HELP_INFO = `
Usage: oawidget <command> [options]

运营活动平台化-组件开发CLI工具

Commands:

    init <cmptName>     scaffold with specifed template, named as <cmptName>
    debug               launch a server for debugging
    publish             inspect xx.editor.js file, build source code then deploy component to \`OAP SERVER\`

Options:

    -h, --help                  output usage infomation
    -v, --version               output the version number
    -c, --config list           output config list
    -c, --config [key=value]    enable configure userName/token/uploadUrl
`;

function main() {
    console.log(
        chalk.whiteBright(HELP_INFO)
    );
    process.exit(0);
}

module.exports = main;
