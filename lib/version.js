/**
 * @file echo version info
 * @author X-Jray(z.xuanjian@gmail.com)
*/

const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const version = require('../package.json').version;

const VERSION_INFO = `
 v${version}
`;

const SLOGEN_INFO = `
╔═╗╔═╗╔═╗
║╣ ║ ║╠═╝
╚═╝╚═╝╩   wants to help you.
`;

function main() {
    const rainbow = chalkAnimation.rainbow(SLOGEN_INFO).stop();
    console.log(
        chalk.whiteBright(VERSION_INFO)
    );
    rainbow.render();
    process.exit(0);
}

module.exports = main;
