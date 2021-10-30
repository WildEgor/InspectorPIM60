import Path from 'path';
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import { merge } from 'webpack-merge';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import common from './webpack.common';

const config: webpack.Configuration = merge(common, {
  mode: "development",
  output: {
    chunkFilename: '[name].chunk.js',
  },
  // entry,
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".scss"],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
  devtool: "inline-source-map",
  devServer: {
    contentBase: Path.join(__dirname, "../build"),
    historyApiFallback: true,
    port: 5000,
    open: true,
    hot: true,
  },
});

export default config;