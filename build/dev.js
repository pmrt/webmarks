const path = require('path');
const rootPath = path.join(__dirname, '../');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const name = 'webmarks';

module.exports = {
    context: path.join(rootPath, '/test'),
    entry: {
        [name]: path.join(rootPath, `/src/${name}.js`),
        // main.js simulates a developer configuring webmarks.js
        "main": path.join(rootPath, '/test/static/main.js'),
    },
    devtool: 'eval',
    output: {
        filename: '[name].js',
        path: path.join(rootPath, '/test/dist'),
    },
    mode: 'development',
    devServer: {
        host: '127.0.0.1',
        contentBase: path.join(rootPath, '/test/static'),
        watchContentBase: true,
        compress: true,
        port: 8001,
        https: false,
        open: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: false
                    }
                }
            },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./static/index.html",
            filename: "index.html"
        }),
        new CopyWebpackPlugin([
            { from: '../src/themes/*.css', to: '.', flatten: true },
            { from: './static/*.css', to: '.', flatten: true },
        ]),
    ],
}