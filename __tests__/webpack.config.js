var path = require('path');

module.exports = {
    target: 'web',
    context: __dirname,
    mode: 'development',
    entry: {
        adapter: '../src/adapter/github.ts'
        // adapter: path.join(__dirname, 'wrapper.js'),
    },
    output: {
        path: path.join(__dirname, 'dist/js/'),
        filename: 'adapter.js',
        library: 'adapter',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.(tsx?|js)$/,
            exclude: /(node_modules)/,
            use: 'ts-loader'
        }]
    },
    stats: {
        colors: true,
        timings: true,
        chunks: false,
        modules: false
    }
};
