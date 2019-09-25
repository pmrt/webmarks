const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootPath = path.join(__dirname, '../');
const entryPath = path.join(rootPath, `/src`);

module.exports = {
    context: rootPath,
    entry: {
        bundle: [
            path.join(entryPath, '/lib/main.js'),
            path.join(entryPath, '/static/css/webmark.css'),
            path.join(entryPath, '/static/css/content.css'),
            path.join(entryPath, '/static/css/styles.css'),
        ]
    },
    devtool: 'eval',
    output: {
        filename: `[name].min.js`,
        path: rootPath,
    },
    mode: 'development',
    devServer: {
        host: '127.0.0.1',
        contentBase: rootPath,
        watchContentBase: true,
        compress: true,
        port: 8004,
        https: false,
        open: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                  loader: MiniCssExtractPlugin.loader,
                }, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: false,
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/static/index.html",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // all options are optional
          filename: 'bundle.css',
          ignoreOrder: false,
        }),
    ]
}