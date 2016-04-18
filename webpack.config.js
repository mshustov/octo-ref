var path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        background: './src/background.js',
        contentscript: './src/contentscript.js',
        popup: './src/popup.js'
    },
    output: {
        path: path.join(__dirname, 'dist/js/'),
        filename: '[name].js'
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel'
        }]
    },
    stats: {
        colors: true,
        timings: true,
        chunks: false,
        modules: false
    }
};
