const path = require("path");
const {merge} = require('webpack-merge');
const base = require('./webpack.base');

const rootDir = path.resolve(__dirname, '../');

module.exports = merge(base, {
    mode: 'production',

    entry: {
        index: path.resolve(rootDir, 'src/index.ts'),
    },

    externals: ['vue', 'vue-property-decorator', 'vue-class-component'],
})