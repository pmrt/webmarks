const path = require('path');
const rootPath = path.join(__dirname, '../');
const distPath = path.join(rootPath, '/dist');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const name = 'webtabs';

module.exports = {
    context: path.join(rootPath, '/test'),
    entry: path.join(rootPath, `/src/${name}.js`),
    devtool: 'eval',
    output: {
        filename: `${name}.js`,
        path: distPath,
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
        })
    ],
}