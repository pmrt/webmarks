const path = require('path');
const rootPath = path.join(__dirname, '../');

const name = 'webtabs';

const entryPath = path.join(rootPath, `/src/${name}.js`);
const distPath = path.join(rootPath, '/dist');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    watch: true,
    entry: entryPath,
    output: {
        filename: `${name}.min.js`,
        path: distPath
    },
    mode: 'production',
    plugins: [
        new FileManagerPlugin({
            onEnd: {
                copy: [
                    { source: path.join(distPath, 'webtabs.min.js'), destination: path.join(rootPath, '/test/webtabs.js') }
                ]
            }
        })
    ],
}