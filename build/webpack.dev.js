const path = require("path");
const {merge} = require('webpack-merge');
const base = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname, '../');

module.exports = merge(base, {
    mode: 'development',

    entry: path.resolve(rootDir, 'example/main.ts'),

    devtool: 'inline-source-map',

    devServer: {
        hot: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'public/index.html')
        }),
    ]
})