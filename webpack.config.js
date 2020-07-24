const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');

// const webpack = require('webpack');
//   new webpack.ProvidePlugin({
//     "window.L": "leaflet"
//   }),

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  mode,
  output: {
    path: path.join(__dirname, 'app'),
    publicPath: '/app',
    filename: 'qwtree.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg|gif|jpg)$/, use: 'file-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      filename: './qwtree.html',
      template: "./index.html"
    }), // output file relative to output.path
    new WebpackCdnPlugin({
      modules: [

      ],
      publicPath: '/node_modules', // override when prod is false
    }),
  ],
  devtool: 'source-map'
};