var webpack = require('webpack');
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
    plugins: [
        new webpack.ProvidePlugin({
            acorn: 'acorn'
        })
        //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        //new webpack.DefinePlugin({
        //    REGISTATOR_NAME: JSON.stringify(config.registratorName)
        //})
        //new webpack.SourceMapDevToolPlugin({
        //    exclude: 'browser-source-register'
        //})

    ],
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
