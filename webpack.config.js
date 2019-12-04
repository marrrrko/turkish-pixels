const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: "development",
    entry: './client-src/turkish-pixels.js',
    output: {
        filename: 'turkish-pixels.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "client-src/index.html"
        }),
        new CopyWebpackPlugin([
            {from:'client-src/assets',to:'assets'} 
        ]),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    }
}