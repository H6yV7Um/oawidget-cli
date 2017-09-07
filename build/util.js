/**
 * @file utils
 * @author X-Jray(z.xuanjian@gmail.com)
 */

const path = require('path');
const config = require('./config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function assetsPath(p) {
    const assetsSubDirectory = process.env.NODE_ENV === 'prod'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory;
    return path.posix.join(assetsSubDirectory, p);
}

function cssLoaders(options = {}) {
    const generateLoaders = loaders => {
        const sourceLoader = loaders.map(loader => {
            let extraParamChar;
            if (/\?/.test(loader)) {
                loader = loader.replace(/\?/, '-loader?');
                extraParamChar = '&';
            }
            else {
                loader = loader + '-loader';
                extraParamChar = '?';
            }
            return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '');
        }).join('!');

        return options.extract
            ? ExtractTextPlugin.extract('style-loader', sourceLoader)
            : ['style-loader', sourceLoader].join('!');
    };
    return {
        css: generateLoaders(['css']),
        less: generateLoaders(['css', 'less']),
        sass: generateLoaders(['css', 'sass?indentedSyntax']),
        scss: generateLoaders(['css', 'sass']),
        stylus: generateLoaders([
            'css',
            'stylus?resolve url&include css&paths=node_modules'
        ]),
        styl: generateLoaders([
            'css',
            'stylus?resolve url&include css&paths=node_modules'
        ])
    };
}

function styleLoaders(options) {
    const output = [];
    const loaders = cssLoaders(options);
    for (const extension in loaders) {
        if (loaders.hasOwnProperty(extension)) {
            const loader = loaders[extension];
            output.push({
                test: new RegExp('\\.' + extension + '$'),
                loader: loader
            });
        }
    }
    return output;
}

function getIP() {
    const ifaces = require('os').networkInterfaces();
    const defultAddress = '127.0.0.1';
    let ip = defultAddress;

    for (const dev in ifaces) {
        if (ifaces.hasOwnProperty(dev)) {
            /* jshint loopfunc: true */
            ifaces[dev].forEach(details => {
                if (ip === defultAddress && details.family === 'IPv4') {
                    ip = details.address;
                }
            });
        }
    }
    return ip;
}

module.exports = {
    assetsPath,
    cssLoaders,
    styleLoaders,
    getIP
};
