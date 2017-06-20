const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = [SRC_DIR];

module.exports = {
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    `${SRC_DIR}/index.jsx` // main entry point for app
  ],
  output: {
    path: OUTPUT_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {test: /\.jsx?$/,
        loader: 'eslint-loader',
        include: defaultInclude,
        enforce: 'pre',
        options: {
          fix: true
        }
      },
      {test: /\.styl$/, // both .js and .jsx
        loader: 'stylint-loader',
        include: defaultInclude,
        enforce: 'pre',
        options: {
          fix: true
        }
      },
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
        {loader: 'babel-loader', options: {forceEnv: 'development'}}
      ], include: defaultInclude},
      {test: /\.(jpe?g|png|gif)$/, use: [
        {loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]'}
      ], include: defaultInclude},
      {test: /\.(eot|svg|ttf|woff|woff2)$/, use: [
        {loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]'}
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
      reducers: path.resolve(__dirname, 'src/reducers'),
      styles: path.resolve(__dirname, 'src/styles'),
      utils: path.resolve(__dirname, 'src/utils')
    }
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.NamedModulesPlugin()
  ],
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: OUTPUT_DIR,
    stats: {
      colors: true,
      chunks: false,
      children: false
    }
  }
};
