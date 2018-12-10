import webpack from 'webpack';
import postcssPresetEnv from 'postcss-preset-env';
import path from 'path';

const env = process.env.NODE_ENV;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const extractCSS = new ExtractTextPlugin('../css/style.css');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const srcpath = './src/';

module.exports = env => {
  const outputpath = (env && env.production) ? './build/' : './dist/';
  const mode = (env && env.production) ? 'production' : 'development';

  return {
    mode: mode,
    devtool: (env && env.production) ? false : 'inline-source-map',
    entry:  path.resolve(__dirname, srcpath + 'index.js'),
    output: {
      path: path.resolve(__dirname, outputpath + 'js/'),
      filename: 'app.js'
    },
    devServer: {
      clientLogLevel  : 'none',
    },
    stats: { children: false },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query:{
            presets: ['babel-preset-env']
          }
        },
        {
          test: /\.s?css$/,
          use: extractCSS.extract([
            { loader: 'css-loader', options: {
              importLoaders: 1,
              url: false,
              sourceMap: true
            } },
            { loader: 'postcss-loader', options: {
              ident: 'postcss',
              plugins: () => [
                require("postcss-discard-duplicates"),
                require("postcss-import")({ root: srcpath + "css/" }),
                require("postcss-discard-comments")({ removeAllButFirst: false }),
                require('postcss-custom-media'),
                postcssPresetEnv({
                  stage: 0,
                  browsers: "last 3 versions, ie >= 10",
                  features: {
                    'nesting-rules': false
                  }
                }),
                require("postcss-short"),
                require("postcss-calc"),
                require("postcss-nested"),
                // require("cssnano")
              ]
            } },
            { loader: 'sass-loader', options: {
              sourceMap: true
            } }
          ])
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
      extractCSS,
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        }
      }),
      new CopyWebpackPlugin([{
        from: srcpath + 'img',
        to: '../img'
      }]),
      new CopyWebpackPlugin([{
        from: srcpath + 'fonts',
        to: '../fonts'
      }]),
      new ImageminPlugin({
        disable: !env.production,
        test: /\.(jpe?g|png|gif|svg)$/i,
        pngquant: { quality: '95-100' }
      })
    ],
    performance: { hints: false }
  }
};
