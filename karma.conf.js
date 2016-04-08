module.exports = function(config) {
    config.set({
        basePath: '',
        browsers: ['Chrome'],
        frameworks: ['mocha', 'chai-sinon'],
        files: [
            'tests/specs/**/*.js',
            'tests/fixtures/*.html'
        ],
        preprocessors: {
            'tests/specs/**/*.js': ['webpack'],
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
        singleRun: true // true for CI / false for run in browser
    });
};
