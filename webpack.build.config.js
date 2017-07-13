const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [SRC_DIR];

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    path: OUTPUT_DIR,
    publicPath: './',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.css$/, use: [
        {loader: 'style-loader'},
        {loader: 'css-loader'}
      ], include: defaultInclude},
      {test: /\.styl$/, use: [
        'style-loader',
        'css-loader',
        'stylus-loader'
      ], include: defaultInclude},
      {test: /\.js|jsx?$/, use: [
        {loader: 'babel-loader', options: {forceEnv: 'production'}}
      ], include: defaultInclude},
      {test: /\.(jpe?g|png|gif|svg)$/, use: [
        {loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]'}
      ], include: defaultInclude},
      {test: /\.(eot|ttf|woff|woff2)$/, use: [
        {loader: 'file-loader?name=fonts/[name]__[hash:base64:5].[ext]'}
      ], include: defaultInclude}
    ]
  },
  target: 'electron-renderer',
  resolve: {
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      images: path.resolve(__dirname, 'src/assets/images'),
      actions: path.resolve(__dirname, 'src/actions'),
      proptypes: path.resolve(__dirname, 'src/proptypes'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      styles: path.resolve(__dirname, 'src/styles'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({title: 'Earn-A-Bike Volunteer Hour Tracker'}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BabiliPlugin()
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  }
};
