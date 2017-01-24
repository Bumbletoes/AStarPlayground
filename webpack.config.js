'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const production = process.env.NODE_ENV === 'production';

let plugins = [
  new ExtractPlugin('main.css'), // <=== where should content be piped
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js',
    children: true,
    minChunks: 2,
  }),
  new webpack.HotModuleReplacementPlugin()
];

if (production) {
  plugins = plugins.concat([
    // Cleanup the builds/ folder before
    // compiling our final assets
    new CleanPlugin('builds'),

    // This plugin looks for similar chunks and files
    // and merges them for better caching by the user
    new webpack.optimize.DedupePlugin(),

    // This plugins optimizes chunks and modules by
    // how much they are used in your app
    new webpack.optimize.OccurenceOrderPlugin(),

    // This plugin prevents Webpack from creating chunks
    // that would be too small to be worth loading separatelyf
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200, // ~50kb
    }),

    // This plugin minifies all the Javascript code of the final bundle
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
      },
    }),

    // This plugins defines various variables that we can set to false
    // in production to avoid code related to them from being compiled
    // in our final bundle
    new webpack.DefinePlugin({
      __SERVER__: !production,
      __DEVELOPMENT__: !production,
      __DEVTOOLS__: !production,
      'process.env': {
        BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]);
}

module.exports = {
  context: path.resolve(__dirname, './src'),
  debug: !production,
  devtool: production ? false : 'eval',
  entry: {
    main: './main.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'dist/',
    vendor: ['']
  },
  devServer: {
    contentBase: './',
    hot: true,
    inline: true,
    open:true
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    preLoaders: [
      {
        test: /\.js/,
        loader: 'eslint',
      },
      {
        test: /\.js/,
        loader: 'baggage?[file].html=template&[file].scss',
      }
    ],
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { 
        test: /\.tsx?$/, loader: 'ts-loader' 
      },
      {
        test: /\.scss/,
        loader: ExtractPlugin.extract('style', 'css!sass'),
      },
      {
        test: /\.html/,
        loader: 'html',
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        loader: 'url',
        query: {
          limit: 10000,
        }
      },
      { 
      test: /worker\.js$/,
      loader: 'worker'
  }
    ]
  },
};
