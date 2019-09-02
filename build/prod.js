const path = require('path');
const rootPath = path.join(__dirname, '../');

const name = 'webmarks';

const entryPath = path.join(rootPath, `/src/${name}.js`);
const distPath = path.join(rootPath, '/dist');

module.exports = {
    watch: true,
    entry: entryPath,
    output: {
        filename: `${name}.min.js`,
        path: distPath
    },
    mode: 'production',
}