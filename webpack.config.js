const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  entry: {
    // eslint-disable-next-line no-undef
    bundle: __dirname + '/src/main.js'
  },
  output: {
    // eslint-disable-next-line no-undef
    path: __dirname + '/dist/',
    filename: 'boudle-[hash:8].js'
  },
  devServer: {
    // eslint-disable-next-line no-undef
    contentBase: __dirname + '/dist',
    host: '0.0.0.0'
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
      },
      {
        test: /\.scss$/,
        loader: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|jpeg|bmp|gif)$/,
        loader: 'url-loader?limit=51200'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // eslint-disable-next-line no-undef
      template: __dirname + '/src/index.html'
    })
  ]
}
