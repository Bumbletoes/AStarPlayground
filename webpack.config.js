var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var ExtractPlugin = require('extract-text-webpack-plugin');
var production = process.env.NODE_ENV === 'production';

var plugins = [
    new ExtractPlugin('main.css'), // <=== where should content be piped
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js',
        children: true,
        minChunks: 2,
    }),
];

if (production) {
    plugins = plugins.concat([
        // Cleanup the dist/ folder before
        // compiling our final assets
        new CleanPlugin('dist'),

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
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
    debug: !production,
    // Enable sourcemaps for debugging webpack's output.
    devtool: production ? false : 'source-map',
    entry: './src/',
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'dist/',
    },
    devServer: {
        hot: true,
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    plugins: plugins,
    module: {
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { 
                test: /\.js$/, loader: 'source-map-loader' 
            },
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
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { 
                test: /\.tsx?$/, 
                loader: "awesome-typescript-loader" 
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
        ]
    },
};
