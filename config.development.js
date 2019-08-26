/**
 * Development build tasks
 *
 */
//Set some global vars and import plugins.
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// Webpack plugins
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// config files
const common = require('./config.common.js');
const settings = require('../../webpack.settings.js');

/**
 * Configure the Webpack Dev server with settings from webpack.settings.js
 *  - Loads Express server
 *  - Serve assets from RAM instead of HD
 *  - Hot module replacement + live reloading
 *
 * @param buildType
 * @returns {{disableHostCheck: boolean, headers: {"Access-Control-Allow-Origin": string}, public: *, overlay: boolean, port: *, host: *, https: boolean, hot: boolean, watchOptions: {ignored: RegExp, poll: boolean}, watchContentBase: boolean, contentBase: *}}
 */
const configureDevServer = (buildType) => {
    return {
        public: settings.devServerConfig.public(),
        contentBase: path.resolve(__dirname, settings.paths.templates),
        host: settings.devServerConfig.host(),
        port: settings.devServerConfig.port(),
        https: !!parseInt(settings.devServerConfig.https()),
        disableHostCheck: true,
        hot: true,
        overlay: true,
        watchContentBase: true,
        watchOptions: {
            poll: !!parseInt(settings.devServerConfig.poll()),
            ignored: /node_modules/,
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
    };
};

/**
 * Font loader: listen to font extensions
 *
 * @returns {{test: RegExp, use: {loader: string, options: {name: string}}[]}}
 */
const configureFontLoader = () => {
    return {
        test: /\.(ttf|eot|woff2?)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    };
};

/**
 * Image loader: Listen to common image extensions.
 *
 * @returns {{test: RegExp, use: {loader: string, options: {options: {name: string}}}[]}}
 */
const configureImagesLoader = () => {
    return {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
            {
                loader: 'file-loader',
                options: {
                    options: {
                        name: 'images/[name].[hash].[ext]'
                    }
                }
            }
        ]
    }
};

const configureHtmlWebpackPlugin = () => {
    let configuration = {
        title: settings.name,
        inject: false,
        template: settings.paths.src.templates + settings.paths.src.entryFile
    };

    return configuration;
};

/**
 * Process CSS:
 * don't extract it into seperate files, just inline is ok.
 *
 * @param buildType
 * @returns {{test: RegExp, use: *[]}|{test: RegExp, loader: string}}
 */
const configureStyles = (buildType) => {
    // Don't generate CSS for the legacy config in development
    if (buildType === LEGACY_CONFIG) {
        return {
            test: /\.scss$/,
            loader: 'ignore-loader'
        };
    }
    if (buildType === MODERN_CONFIG) {
        return {
            test: /\.scss$/,
            sideEffects: true,
            use: [
                {
                    loader: 'style-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'vue-style-loader'
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
                },
                {
                    loader: 'resolve-url-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        config: {
                            path: './node_modules/superbrave-build-script/'
                        }
                    }
                },
                {
                    loader: 'sass-loader'
                }
            ]
        };
    }
};

/**
 * Set the Vue loader
 *
 * @returns {{test: RegExp, use: *[]}|{test: RegExp, loader: string}}
 */
const configureVue = () => {
    return {
        test: /\.vue$/,
        use: [
            {
                loader: 'vue-loader'
            }
        ]
    }
}

module.exports = [
    merge(
        common.legacyConfig,
        {
            output: {
                filename: path.join('./js', '[name]-legacy.js'),
                publicPath: settings.devServerConfig.public() + '/',
            },
            mode: 'development',
            devtool: 'inline-source-map',
            devServer: configureDevServer(LEGACY_CONFIG),
            module: {
                rules: [
                    configureVue(),
                    configureStyles(LEGACY_CONFIG),
                    configureImagesLoader(),
                    configureFontLoader(),
                ],
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new VueLoaderPlugin(),
                new HtmlWebpackPlugin(
                    configureHtmlWebpackPlugin()
                )
            ],
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.esm.js'
                }
            },
        }
    ),
    merge(
        common.modernConfig,
        {
            output: {
                filename: path.join('./js', '[name].js'),
                publicPath: settings.devServerConfig.public() + '/',
            },
            mode: 'development',
            devtool: 'inline-source-map',
            devServer: configureDevServer(MODERN_CONFIG),
            module: {
                rules: [
                    configureVue(),
                    configureStyles(MODERN_CONFIG),
                    configureImagesLoader(),
                    configureFontLoader(),
                ],
            },
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new VueLoaderPlugin(),
                new HtmlWebpackPlugin(
                    configureHtmlWebpackPlugin()
                )
            ],
            resolve: {
                alias: {
                    'vue$': 'vue/dist/vue.esm.js'
                }
            },
        }
    ),
];