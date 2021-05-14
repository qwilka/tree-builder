const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');


const mode = process.env.NODE_ENV || 'development';
console.log(`webpack.config.js mode=${mode}`);

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  mode,
  output: {
    path: path.resolve(__dirname, './vntree'),
    publicPath: '/vntree',
    filename: 'build.js'
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
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html'
    }), // output file relative to output.path
    new WebpackCdnPlugin({
      modules: [

      ],
      publicPath: '/node_modules', // override when prod is false
    }),
  ],
  devtool: 'source-map'
};