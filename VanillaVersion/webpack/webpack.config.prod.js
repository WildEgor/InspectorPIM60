const Webpack = require('webpack');
const Path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const postcssPresetEnv = require('postcss-preset-env');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new MiniCssExtractPlugin({ 
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: 
    [
      new TerserPlugin(
    {
      terserOptions: {
        format: {
          comments: false,
        },
        compress: {
          drop_console: true,
        },
      },
      parallel: true,
      extractComments: false,
    }
    ),
    // new UglifyJsPlugin(
    //   {
    //     compress: {
    //       warnings: false,
    //       drop_console: true,
    //       drop_debugger: true
    //     },
    //     comments: false
    //   }
    // ),
  ],
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          "sass-loader",
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     sourceMap: true,
          //     postcssOptions: {
          //       plugins: [postcssPresetEnv],
          //     },
          //   },
          // },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        include: [
          Path.resolve(__dirname, '../src'),
          /**
           * add ES6 modules that should be transpiled here. For example:
           * Path.resolve(__dirname, '../node_modules/query-string'),
           */
        ],
        loader: 'babel-loader',
      },
    ],
  },
});