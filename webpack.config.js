const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const exec = require('child_process').exec;


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
        {
            apply: (compiler) => {
              compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                exec('node node_modules/blue-tape/bin/blue-tape.js ./client-src/test/**/*.js', (err, stdout, stderr) => {
                  if (stdout) process.stdout.write(stdout);
                  if (stderr) process.stderr.write(stderr);
                });
              });
            }
          }
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