/**
 * @file debug server
 * @author X-Jray(z.xuanjian@gmail.com)
 */

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const apim = require('apim-tools');
const opn = require('opn');
const chalk = require('chalk');
const util = require('./util');
const path = require('path');

const webpackDevConf = require('./webpack.dev.conf');

const app = express();

let lastChunks = [];

const compiler = webpack(webpackDevConf);
compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {

        let isModuleChanged = false;
        compilation.chunks.forEach((item, index) => {
            if (lastChunks[index] && (lastChunks[index] !== item.hash)) {
                isModuleChanged = true;
            }
            lastChunks[index] = item.hash;
        });

        if (!isModuleChanged) {
            hotMiddleware.publish({
                action: 'reload'
            });
        }

        cb();
    });
});

const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackDevConf.output.publicPath,
    logTime: true,
    stats: {
        colors: true,
        entrypoints: true,
        maxModules: 30
    },
    watchOptions: {
        aggregateTimeout: 50
    }
});

const hotMiddleware = webpackHotMiddleware(compiler);

const mockSrv = apim.express({
    // 设置存储的 mock 相关数据存储的根目录
    root: __dirname + '/mock',
    // 项目 schema token 具体到 apim 平台查看(apim.baidu.com)
/* TO BE REPLACED */
    schemaToken: '6463587ed20aea7746fba3a354bf128b',
    port: 9090,
/* TO BE REPLACED */
    // 是否启动时候立刻自动同步
    startAutoSync: true
});

app.use(devMiddleware);
app.use(hotMiddleware);
app.use(mockSrv);
app.use(express.static(path.resolve(__dirname, '../preview'), {
    maxAge: 3600000,
    etag: true
}));

const port = process.env.PORT || 8002;

app.listen(port, err => {
    if (err) {
        console.log(chalk.red(err));
        return;
    }
    let url = 'http://' + util.getIP() +':' + port + '/#/';
    console.log(chalk.green('Listening at http://127.0.0.1:' + port + ' or http://' + util.getIP() + ':' + port + '\n'));
    opn(url);
});
