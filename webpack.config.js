var path = require('path');
var webpack = require('webpack');

module.exports = {
    target: 'node', // 'web'
    context: __dirname,
    mode: 'development', // TODO add prod build + uglify
    entry: {
        background: './src/background.ts',
        contentscript: './src/contentscript.ts',
        popup: './src/popup.tsx'
    },
    output: {
        path: path.join(__dirname, 'dist/js/'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.(tsx?|js)$/,
            exclude: /(node_modules)/,
            use: 'ts-loader'
        }]
    },
     plugins: [
        // new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    stats: {
        colors: true,
        timings: true,
        chunks: false,
        modules: false
    }
};
