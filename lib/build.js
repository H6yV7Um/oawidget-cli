/**
 * @file build, build the src files to dist by webpack
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const chalk = require('chalk');
const spawn = require('child_process').spawn;
const lib = require('./utils/lib');

function main(cmptName) {

    const npmCommand = lib.getNpmCommand();
    let output = spawn(npmCommand, ['run', 'build']);

    console.log(chalk.white(`
组件全速构建中...`));

    output.stdout.on('data', data => {
        console.log(data.toString());
    });

    output.stderr.on('data', data => {
        console.log(data.toString());
    });
}

module.exports = main;
