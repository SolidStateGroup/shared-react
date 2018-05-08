//Uses webpack dev + hot middleware
var config = require('../../webpack/webpack.config.dev');

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const compiler = webpack(config);


module.exports = function (app) {
    const middleware = webpackDevMiddleware(compiler, {
        logLevel: 'warn',
        publicPath: config.output.publicPath

    });
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
    }));

    return middleware;
};
