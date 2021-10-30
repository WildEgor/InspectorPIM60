import Path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import getFilesFromDir from "../../config/files";
import webpack from "webpack";

const PAGE_DIR = Path.join("src", "pages", Path.sep);

const htmlPlugins = getFilesFromDir(PAGE_DIR, [".html"]).map( filePath => {
  const fileName = filePath.replace(PAGE_DIR, "");
  return new HtmlWebpackPlugin({
    inject: true,
    chunks:[fileName.replace(Path.extname(fileName), ""), "vendor"],
    template: filePath,
    filename: fileName
  });
});

const entry = getFilesFromDir(PAGE_DIR, ['.ts', '.tsx', '.js']).reduce( (obj, filePath) => {
  const entryChunkName = filePath.replace(Path.extname(filePath), "").replace(PAGE_DIR, "");
  obj[entryChunkName] = `./${filePath}`;
  return obj;
}, {});

const config: webpack.Configuration = {
  entry: entry,
  output: {
    path: Path.join(__dirname, '../build'),
    filename: '[name].[hash:4].js',
  },
  optimization: {
     splitChunks: {
      chunks: 'all',
      name: false,
      minSize: 120000,
      minChunks: 1,
      maxInitialRequests: Infinity,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module){
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return packageName;
          },
          //chunks: "all",
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          //chunks: "all",
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
     },
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlPlugins,
  ],
  resolve: {
    roots: [Path.resolve('../../src')],
    extensions: [".tsx", ".ts", ".js"],
    modules: [Path.resolve(__dirname, '../../src'), Path.resolve(__dirname, '../../node_modules')],
    alias: {
      Src: Path.resolve(__dirname, '../../src'),
      Style: Path.resolve(__dirname, '../src/style'),
      Store: Path.resolve(__dirname, '../src/store'),
      Pages: Path.resolve(__dirname, '../src/pages'),
      Hooks: Path.resolve(__dirname, '../src/hooks'),
      Components: Path.resolve(__dirname, '../../src/components'),
      Utils: Path.resolve(__dirname, '../src/utils'),
      Services: Path.resolve(__dirname, '../src/services'),
    },
  },
  module: {
    rules: [
        {
            test: /\.(ts|js)x?$/i,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                plugins: ["@babel/plugin-proposal-class-properties"],
                presets: [
                  "@babel/preset-env",
                  "@babel/preset-react",
                  "@babel/preset-typescript",
                ],
              },
            },
        },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
    ],
  },
};

export default config;