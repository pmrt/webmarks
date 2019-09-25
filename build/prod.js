const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rootPath = path.join(__dirname, '../');
const entryPath = path.join(rootPath, `/src`);
const distPath = path.join(rootPath, '/public');

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
    output: {
        filename: `[name].min.js`,
        path: distPath,
        publicPath: distPath,
    },
    mode: 'production',
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

    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/static/index.html",
            filename: "../index.html"
        }),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // all options are optional
          filename: 'css/bundle.css',
          ignoreOrder: false,
        }),
    ]
}