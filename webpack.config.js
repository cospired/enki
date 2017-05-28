const path = require('path');

const webpack = require('webpack'); // to access built-in plugins

const CleanPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ReactIntlPlugin = require('@chriskjaer/react-intl-webpack-plugin');

const AutoPrefixer = require('autoprefixer');

const isProduction = process.env.NODE_ENV === 'production';
const nodeEnv = isProduction ? 'production' : 'development';

const webpackConfig = {
  context: __dirname,
  entry: {
    enki: ['./src/client/index.jsx']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'assets/js/[name].[chunkhash].js',
    chunkFilename: 'assets/js/[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: true
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['es2015', { modules: false }],
              'react'
            ],
            env: {
              development: {
                presets: ['react-hmre']
              }
            },
            metadataSubscribers: [ReactIntlPlugin.metadataContextFunctionName],
            plugins: [
              'transform-object-rest-spread',
              'object-values-to-object-keys',
              'react-hot-loader/babel',
              ['react-intl', {
                messagesDir: './l10n-messages/',
                enforceDescriptions: true,
                extractSourceLocation: true
              }]
            ]
          }
        }
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  AutoPrefixer
                ],
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.(png|gif|jpe?g)$/i,
        loader: 'url-loader',
        query: {
          limit: 8192
        }
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          mimetype: 'application/font-woff',
          name: 'assets/fonts/[name].[ext]'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          mimetype: 'application/octet-stream',
          name: 'assets/fonts/[name].[ext]'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        query: {
          name: 'assets/fonts/[name].[ext]'
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          mimetype: 'application/svg+xml',
          name: 'assets/fonts/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(
      {
        filename: 'assets/css/[name].[contenthash].css',
        disable: !isProduction, // true for dev
        allChunks: true
      }
    ),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
      minify: {
        collapseWhitespace: isProduction,
        removeComments: isProduction
      }
    }),
    new ReactIntlPlugin({
      path: './public/assets/locales',
      filename: 'en.json',
      prettyPrint: !isProduction,
      collapseWhitespace: true
    }),
    new webpack.DefinePlugin({
      __APIBASE__: '"http://localhost:3000/"',
      __SERVER__: !isProduction,
      __DEVELOPMENT__: !isProduction,
      __DEVTOOLS__: !isProduction,
      'process.env': {
        BABEL_ENV: JSON.stringify(nodeEnv),
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: isProduction,
      debug: !isProduction
    }),
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
      fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    })
  ]
};

/* Development specific configs */
if (!isProduction) {

  console.log('DEVELOPMENT MODE');

  webpackConfig.devServer = {
    host: '0.0.0.0',
    port: 9000,
    compress: false,
    contentBase: path.join(__dirname, 'public'),
    inline: true,
    hot: true,
    historyApiFallback: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: true,
      modules: true,
      publicPath: false,
      timings: true,
      version: true,
      warnings: true,
      colors: {
        green: '\u001b[32m'
      }
    }
  };

  webpackConfig.entry.debug = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:9000',
    'webpack/hot/only-dev-server'
  ];

  webpackConfig.output.filename = '[name].js';

  webpackConfig.devtool = 'inline-source-map';

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]);
}

/* Production specific configs */
if (isProduction) {

  console.log('BUILDING PRODUCTION');

  webpackConfig.plugins = webpackConfig.plugins.concat([

    // Cleanup the builds/ folder before
    // compiling our final assets
    new CleanPlugin('build'),

    new CompressionPlugin({
      asset: '[path].zopfli[query]',
      algorithm: 'zopfli',
      test: /\.js$|\.html$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),

    // This plugin minifies all the Javascript code of the final bundle
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        collapse_vars: true,
        comparisons: true,
        conditionals: true,
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        screw_ie8: true,
        sequences: true,
        unused: true,
        warnings: false // Suppress uglification warnings
      }
    }),

    new ManifestPlugin({
      fileName: 'build-manifest.json'
    }),

    new CopyWebpackPlugin(
      [
        { from: { glob: '**/*', dot: true }, context: 'public' }
      ],
      {
        ignore: ['index.html']
      }
    )
  ]);
}

module.exports = webpackConfig;
