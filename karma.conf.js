module.exports = function(config) {
    config.set({
        basePath: '',
        browsers: ['Chrome'],
        frameworks: ['mocha', 'chai-sinon'],
        files: [
            'tests/**/*.js',
            'tests/fixtures/*.html' // will be processed with html2js
        ],
        preprocessors: {
            'tests/*.js': ['webpack'],
            'tests/fixtures/*.html': ['html2js']
        },
        webpack: {
            devtool: 'inline-source-map',
            loaders: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            }]
        },
        exclude: [],
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: false // true for CI / false for run in browser
    });
};
