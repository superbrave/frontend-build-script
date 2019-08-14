/**
 * Add PostCSS plugins that wil be used from webpack
 * You can find the full list of plugins here:
 * https://github.com/postcss/postcss/blob/master/docs/plugins.md
 *
 * @type {Object}
 */
module.exports = {
  plugins: [
    require("autoprefixer")({
      grid: "autoplace"
    }),
    require("cssnano")({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    })
  ]
};
