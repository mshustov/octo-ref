var webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        basePath: '',
        browsers: ['Chrome'],
        frameworks: ['mocha', 'chai-sinon'],
        files: [
            'tests/specs/**/*.ts',
            'tests/fixtures/*.html'
        ],
        preprocessors: {
            'tests/specs/**/*.ts': ['webpack'],
            'tests/fixtures/*.html': ['html2js']
        },
        webpack: {
            devtool: 'inline-source-map',
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        exclude: [],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: true // true for CI / false for run in browser
    });
};
