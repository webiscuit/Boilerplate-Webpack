import webpack from 'webpack';
import postcssPresetEnv from 'postcss-preset-env';
import path from 'path';

const env = process.env.NODE_ENV;
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const srcpath = './src/';
const csspath = '../css/style.css';

module.exports = env => {
  const outputpath = (env && env.production) ? './build/' : './dist/';
  const mode = (env && env.production) ? 'production' : 'development';

  return {
    mode: mode,
    devtool: (env && env.production) ? false : 'source-map',
    entry:  path.resolve(__dirname, srcpath + 'index.js'),
    output: {
      path: path.resolve(__dirname, outputpath + 'js/'),
      filename: 'app.js'
    },
    devServer: {
      clientLogLevel  : 'none',
    },
    stats: {
      children: false,
      hash: false,
      warnings: false,
      performance: false,
      modules: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query:{
            presets: ['@babel/preset-env']
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
            { loader: 'css-loader', options: {
              importLoaders: 1,
              url: false,
              sourceMap: (env && env.production) ? false : true,
            } },
            { loader: 'postcss-loader', options: {
              ident: 'postcss',
              sourceMap:  (env && env.production) ? false : true,
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
              ]
            } },
            { loader: 'sass-loader', options: {
              sourceMap:  (env && env.production) ? false : true,
            } }
          ]
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({ extractComments: false }),
        new OptimizeCssAssetsPlugin({
          cssProcessor: require('cssnano'),
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          }
        }),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: csspath
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
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
        pngquant: { quality: '80' },
        plugins: [
          imageminMozjpeg( {quality: '80'} )
        ]
      })
    ],
    performance: { hints: false }
  }
};
