const path = require('path');
require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const buildDir = path.resolve('./public');
const testAppDir = path.resolve('testApp/');
const srcDir = path.resolve('src/');

const extractTextPlugin = new ExtractTextPlugin('public/style.css', {
    allChunks: true,
});

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: `${testAppDir}/index.html`,
    filename: 'index.html',
    inject: 'body',
});

const config = {
    entry: `${testAppDir}/index.jsx`,
    output: {
        path: buildDir,
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.jsx?/,
            include: [srcDir, testAppDir],
            loader: 'babel-loader',
        },
        {
            test: /\.js?/,
            include: [srcDir, testAppDir],
            loader: 'babel-loader',
            query: {
                plugins: ['transform-runtime', 'transform-class-properties'],
                presets: ['es2017', 'react'],
            },
        },
        {
            test: /\.scss$/,
            include: [srcDir, testAppDir],
            loader: ExtractTextPlugin.extract('css-loader!sass-loader'),
        }],
    },
    plugins: [HtmlWebpackPluginConfig, extractTextPlugin],
};

module.exports = config;
