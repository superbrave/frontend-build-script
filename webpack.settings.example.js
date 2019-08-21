/**
 * This is the settings file.
 * Normally, this is the only file that should be edited for a new project (together with postcss.config.js)
 * Contains all parameters for webpack config. *
 */
require('dotenv').config();

// disable linting on next line
// noinspection WebpackConfigHighlighting
module.exports = {
    name: "DefaultProject", //Name can be anything, doesn't really matter.
    copyright: "SuperBrave", //That's us!
    paths: { //Configuration of the base paths of the config.
        src: {
            base: "./src/",
            css: "./src/scss/",
            js: "./src/js/",
            img: "./src/images",
            fonts: "./src/fonts",
            templates: "./src/templates",
            entryFile: "/index.html"
        },
        dist: {
            base: "./dist/",
            clean: [
                '**/*',
            ]
        },
        templates: "./dist/templates" //For dev server
    },
    urls: { //Set urls for the project.
        live: "https://example.com/",
        local: "http://localhost:8080",
        critical: "http://localhost:8080",
        publicPath: () => process.env.PUBLIC_PATH || "",
    },
    vars: {
        cssName: "style"
    },
    //Object with all entry files for webpack (if you need multiple)
    entries: {
        "app": "index.js"
    },
    babelLoaderConfig: {
        exclude: [
            /(node_modules)/  //ignore everything in node_modules.
        ],
    },
    criticalCssConfig: { //ToDo: Critical CSS configuration.
        base: "./dist/",
        suffix: "-critical.html",
        criticalHeight: 1200,
        criticalWidth: 1200,
        //Create array with all pages that need their own critical css
        pages: [
            {
                url: "/",
                template: "index",
                filename: "templates/index"
            }
        ]
    },
    devServerConfig: { //Configuration for the webpack dev server. Can be set in the .ENV file (not in repo) or the default.
        public: () => process.env.DEVSERVER_PUBLIC || "http://localhost:8080",
        host: () => process.env.DEVSERVER_HOST || "localhost",
        poll: () => process.env.DEVSERVER_POLL || false,
        port: () => process.env.DEVSERVER_PORT || 8080,
        https: () => process.env.DEVSERVER_HTTPS || false,
    },
    manifestConfig: {
        basePath: ""
    },
    copyWebpackConfig: [
        {
            from: "./src/templates/",
            to: "./templates/"
        }
    ],
    //Configure PurgeCSS:
    purgeCssConfig: {
        // Paths: look in templates folder if working with html files, and in the src folder for js/vue
        paths: [
            "./src/**/*.{js,vue,twig,html}"
        ],
        // Whitelist all css components we write ourselves by default.
        // Could be set broader if necessary
        whitelist: [
            "./src/scss/components/**/*.{scss}"
        ],
        whitelistPatterns: [],
        extensions: [
            "html",
            "js",
            "twig",
            "vue"
        ]
    }
};
