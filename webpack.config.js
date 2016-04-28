var path = require('path');

module.exports = {
    target: 'node',
    context: __dirname,
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
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [{
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(tsx?|js)$/,
            exclude: /(node_modules)/,
            loader: 'ts-loader'
        }],
        noParse: [/typescript/]
    },
    stats: {
        colors: true,
        timings: true,
        chunks: false,
        modules: false
    }
};
