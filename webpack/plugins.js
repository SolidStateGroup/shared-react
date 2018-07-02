const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = [

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),

    // Fixes warning in moment-with-locales.min.js
    // Module not found: Error: Can't resolve './locale' in ...
    new webpack.IgnorePlugin(/\.\/locale$/),
    //Copy static content
    new CopyWebpackPlugin([
        {from: path.join(__dirname, '../web/images'), to: path.join(__dirname, '../build/images')},
        {from: path.join(__dirname, '../web/fonts'), to: path.join(__dirname, '../build/fonts')},
        {from: path.join(__dirname, '../web/model'), to: path.join(__dirname, '../build/model')},
        {from: path.join(__dirname, '../web/face-min.js'), to: path.join(__dirname, '../build')},
        {from: path.join(__dirname, '../web/tracking-min.js'), to: path.join(__dirname, '../build')}
    ])
];
