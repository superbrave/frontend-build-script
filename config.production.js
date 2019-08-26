/**
 * Production build tasks
 *
 */
//Set some global vars and import plugins.
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const merge = require('webpack-merge');
const path = require('path');
const glob = require('glob-all');

//webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const PurgecssWhitelisterPlugin = require('purgecss-whitelister');
const CriticalCssPlugin = require('critical-css-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// config files
const common = require('./config.common.js');
const settings = require('../../webpack.settings.js');

/**
 * Clean webpack: remove dist files before new build.
 *
 * @returns {{cleanOnceBeforeBuildPatterns: *, dry: boolean, verbose: boolean}}
 */
const configureCleanWebpack = () => {
    return {
        cleanOnceBeforeBuildPatterns: settings.paths.dist.clean,
        verbose: true,
        dry: false
    };
};

/**
 * Configuration to build CSS files:
 * Extract css from js, generate source maps, run postcss.
 *
 * @param buildType
 * @returns {{test: RegExp, loader: string}|{test: RegExp, use: *[]}}
 */
const configureStyles = (buildType) => {
    if (buildType === MODERN_CONFIG) {
        return {
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2,
                        sourceMap: true
                    }
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
    // No need to build 2 sets of css (they are the same), so ignore this for the modern config.
    if (buildType === LEGACY_CONFIG) {
        return {
            test: /\.scss$/,
            loader: 'ignore-loader'
        };
    }
};

/**
 * Configure Purgecss
 *
 * @returns {{extractors: {extensions: *, extractor: *}[], paths: *, whitelist: *, whitelistPatterns: *}}
 */
const configurePurgeCss = () => {
    let paths = [];
    for (const [key, value] of Object.entries(settings.purgeCssConfig.paths)) {
        paths.push(path.join(value));
    }
    return {
        paths: glob.sync(paths),
        whitelist: PurgecssWhitelisterPlugin(settings.purgeCssConfig.whitelist),
        whitelistPatterns: settings.purgeCssConfig.whitelistPatterns,
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/@]+/g) || [],
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

const configureCriticalCss = () => {
    return (settings.criticalCssConfig.pages.map((row) => {
        const criticalSrc = settings.urls.critical + row.url;
        const criticalDest = settings.criticalCssConfig.base + row.template + settings.criticalCssConfig.suffix;
        let criticalWidth = settings.criticalCssConfig.criticalWidth;
        let criticalHeight = settings.criticalCssConfig.criticalHeight;
        console.log("source: " + criticalSrc + " dest: " + criticalDest);
        return new CriticalCssPlugin({
            base: './',
            src: criticalSrc,
            dest: criticalDest,
            extract: false,
            inline: true,
            minify: true,
            width: criticalWidth,
            height: criticalHeight,
        })
    })
    );
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

/**
 * Run the export for production.
 *
 * @type {*[]}
 */
module.exports = [
    merge(
        common.legacyConfig,
        {
            output: {
                filename: path.join('./js', '[name].[chunkhash].js'),
            },
            mode: 'production',
            module: {
                rules: [
                    configureVue(),
                    configureFontLoader(),
                    configureImagesLoader(),
                    configureStyles(LEGACY_CONFIG),
                ],
            },
            plugins: [
                new CleanWebpackPlugin(
                    configureCleanWebpack()
                ),
                new VueLoaderPlugin(),
                new HtmlWebpackPlugin(
                    configureHtmlWebpackPlugin()
                )
            ]
        }
    ),
    merge(
        common.modernConfig,
        {
            output: {
                filename: path.join('./js', '[name].[chunkhash].js'),
            },
            mode: 'production',
            module: {
                rules: [
                    configureVue(),
                    configureFontLoader(),
                    configureImagesLoader(),
                    configureStyles(MODERN_CONFIG),
                ],
            },
            plugins: [
                new MiniCssExtractPlugin({
                    path: path.resolve(__dirname, settings.paths.dist.base),
                    filename: path.join('./css', '[name].[chunkhash].css'),
                }),
                new PurgecssPlugin(
                    configurePurgeCss()
                ),
                new VueLoaderPlugin(),
                new HtmlWebpackPlugin(
                    configureHtmlWebpackPlugin()
                )
            ]
        }
    ),
];
