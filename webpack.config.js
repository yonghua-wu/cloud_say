const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    // eslint-disable-next-line no-undef
    bundle: __dirname + '/src/main.js'
  },
  output: {
    // eslint-disable-next-line no-undef
    path: __dirname + '/dist/',
    filename: 'index.js'
  },
  devServer: {
    // eslint-disable-next-line no-undef
    contentBase: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
