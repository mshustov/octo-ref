var webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        basePath: '',
        browsers:   process.env.TRAVIS ? ['Chrome_travis_ci'] : ['Chrome'],
        frameworks: ['mocha'],
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
            resolve: webpackConfig.resolve,
            stats: webpackConfig.stats
        },
        exclude: [],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: true, // true for CI / false for run in browser

        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        // https://github.com/webpack/karma-webpack/issues/188
        mime: {
            'text/x-typescript': ['ts','tsx']
        }
    });
};
