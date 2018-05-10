/**
 * @file webpack preview conf(build as one bundle)
 * @author X-Jray(z.xuanjian@gmail.com)
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const ROOT_CONTEXT = path.resolve(__dirname, '../');
const ROOT_SRC = path.resolve(__dirname, '../src');
const SRC_ITEMS = fs.readdirSync(ROOT_SRC);

module.exports = {

    context: ROOT_CONTEXT,

    entry: () => {
        const widgetEntry = {};
        SRC_ITEMS.forEach(item => {
            if (item === '.DS_Store') {
                return;
            }
            if (!path.extname(item)) {
                widgetEntry[item] = './src/' + item;
            }
        });
        return widgetEntry;
    },

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]/[name]-all.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, '../src')
                ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                include: [
                    path.resolve(__dirname, '../src')
                ]
            },
            {
                test: /\.(webp|png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'bosupload-loader',
                        options: {
                            accountConfig: {
                                credentials: {
                                    ak: '81353446077f40ac8919ae08341a77e5',
                                    sk: '3071a8a6eca04a4a96a340b870ed359b'
                                },
                                endpoint: 'http://bj.bcebos.com',
                                urlPrefix: '//eopa.bdstatic.com/',
                                bucket: 'jadyoap'
                            }
                        }
                    },
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 20,
                            name: '[name].[hash:7].[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 70
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-80',
                                speed: 3
                            },
                            gifsicle: {
                                interlaced: true,
                                optimizationLevel: 2
                            },
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(html|tpl)(\?.*)?$/,
                loader: 'html-loader',
                include: [
                    path.resolve(__dirname, '../src')
                ]
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('postcss-cssnext')()
                            ]
                        }
                    },
                    'stylus-loader'
                ]
            }
        ],
        noParse: [
            /san/,
            /swiper/
        ]
    },

    resolve: {
        alias: {
            'SRC': ROOT_SRC
        },
        mainFields: [
            'jsnext:main',
            'browser',
            'main'
        ],
        modules: [
            path.resolve(__dirname, '../node_modules')
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                collapse_vars: true,
                reduce_vars: true
            },
            output: {
                beautify: false,
                comments: false
            }
        })
    ],

    externals: {
        san: 'san',
        $: '$'
    }
};
