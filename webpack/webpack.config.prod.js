// webpack.config.prod.js
// Watches + deploys files minified + cachebusted

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    devtool: 'source-map',

    entry: {
        main: './web/main.js'
    },
    optimization: { //chunk bundle into Libraries, App JS and dumb components
        minimizer: [
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set to true if you want JS source maps
                extractComments:true,
                uglifyOptions: {
                    compress: {
                        drop_console: true,
                    }
                }
            })
        ],
    },
    output: {
        path: path.join(__dirname, '../build'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },

    plugins: require('./plugins')
        .concat([
                //Clear out build folder
                new CleanWebpackPlugin(['build'], {root: path.join(__dirname, '../')}),

                //reduce filesize
                new webpack.optimize.OccurrenceOrderPlugin(),

                //pull inline styles into cachebusted file
                new ExtractTextPlugin({filename: "style.[hash].css", allChunks: true}),

            ]
        )
        .concat(require('./pages').map(function (page) {
            console.log(page);
            return new HtmlWebpackPlugin({
                    filename: page + '.handlebars', //output
                    template: './web/' + page + '.handlebars', //template to use
                    "assets": { //add these script/link tags
                        "client": "/[hash].js",
                        "style": "style.[hash].css"
                    }
                }
            )
        })),

    module: {
        rules: require('./loaders').concat([
            {
                use: 'babel-loader',
                test: /\.js?/,
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader!sass-loader"})
            }
        ])
    }
}
;
