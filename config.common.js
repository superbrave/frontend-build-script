/**
 * Common configuration for the webpack build script:
 * Tasks that need to be run for both dev and prod.
 *
 */
//Set some global vars and import plugins.
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

//node modules
const path = require('path');
const merge = require('webpack-merge');

//webpack plugins
const WebpackNotifierPlugin = require('webpack-notifier');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

// config files
const pkgSettings = require('../../package.json');
const settings = require('../../webpack.settings');

/** Configure Babel loader
 *  Use preset-env; corejs3 and add polyfills on the fly.
 *  parameter browserlists contains the list of browsers (modern / legacy) to target.
 *
 * @param browserList
 * @returns {{test: RegExp, use: {loader: string, options: {presets: *[][], plugins: [string, string], cacheDirectory: boolean}}, exclude: *}}
 */
const configureBabelLoader = (browserList) => {
    return {
        test: /\.js$/,
        exclude: settings.babelLoaderConfig.exclude, //Ignore node_modules
        use: [
            {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        [
                            '@babel/preset-env', {
                                modules: false,
                                corejs: {
                                    version: 3,
                                    proposals: true
                                },
                                useBuiltIns: 'usage',
                                targets: {
                                    browsers: browserList,
                                },
                            }
                        ],
                    ],
                    plugins: [
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-transform-runtime',
                    ],
                },
            },
            {
                loader: 'eslint-loader'
            }
        ],
    };
};

/** Configure manifest.json settings
 *  Create two manifest files for legacy and modern.
 *
 * @param fileName
 * @returns {{fileName: *, basePath: string, map: (function(*): *)}}
 */
const configureAssetsManifest = (filename, isLegacy = false) => {
    return {
        output: filename,
        merge: true
    };
};

/**
 * Load all entry files from settings file.
 */
const configureEntries = (buildType) => {
    let entries = {};
    for (const [key, value] of Object.entries(settings.entries)) {
        entries[buildType] = path.resolve(settings.paths.src.js + value);
    }

    return entries;
};

/**
 * Configure Prettier
 */
const configurePrettier = () => {
    return {
        singleQuote: true
    }
};

/** The base webpack config
 *  Name, entry file and output paths (from config)
 *
 * @type {{output: {path: *, publicPath: *}, entry: object, plugins: [*], name: *}}
 */
const baseConfig = {
    name: pkgSettings.name,
    output: {
        path: path.resolve(settings.paths.dist.base),
        publicPath: settings.urls.publicPath()
    },
    plugins: [
        //Provides notifications:
        //Only notify when an error occurs and the successful build after the error has been corrected
        new WebpackNotifierPlugin({
            title: 'Webpack',
            excludeWarnings: false,
        })
    ]
};

/**
 * Configure what should happen for the legacy config.
 *
 * @type {{plugins: [*, *], module: {rules: [*]}}}
 */
const legacyConfig = {
    entry: configureEntries(LEGACY_CONFIG),
    module: {
        rules: [
            configureBabelLoader(Object.values(pkgSettings.browserslist.legacyBrowsers)),
        ],
    },
    plugins: [
        new copyWebpackPlugin(
            settings.copyWebpackConfig
        ),
        new WebpackAssetsManifest(
            configureAssetsManifest('manifest.json', true)
        )
    ]
};

/**
 * Configure what should happen for the modern config.
 *
 * @type {{plugins: [*], module: {rules: [*]}}}
 */
const modernConfig = {
    entry: configureEntries(MODERN_CONFIG),
    module: {
        rules: [
            configureBabelLoader(Object.values(pkgSettings.browserslist.modernBrowsers)),
        ],
    },
    plugins: [
        new WebpackAssetsManifest(
            configureAssetsManifest('manifest.json')
        ),
        new PrettierPlugin(
            configurePrettier()
        ),
        new StyleLintPlugin()
    ]
};

/**
 * Export base setup with Merge.
 * @type {{modernConfig: *, legacyConfig: *}}
 */
// noinspection WebpackConfigHighlighting
module.exports = {
    'legacyConfig': merge.strategy({
        module: 'prepend',
        plugins: 'prepend',
    })(
        baseConfig,
        legacyConfig,
    ),
    'modernConfig': merge.strategy({
        module: 'prepend',
        plugins: 'prepend',
    })(
        baseConfig,
        modernConfig,
    ),
};
