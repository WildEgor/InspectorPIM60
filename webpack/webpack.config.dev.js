const Path = require('path');
const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  output: {
    chunkFilename: '[name].chunk.js',
  },
  devServer: {
    contentBase: Path.resolve(__dirname, '../src'),
    watchContentBase: true,
    historyApiFallback: true,
    hot: true,
    host: 'localhost',
    port: 3000
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new ReactRefreshWebpackPlugin(),
    new ESLintPlugin({
      emitWarning: false,
      emitError: false
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: Path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['react-refresh/babel'],
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});
