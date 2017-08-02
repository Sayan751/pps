// Karma configuration
// Generated on Mon Jul 17 2017 09:49:56 GMT+0200 (W. Europe Daylight Time)

module.exports = function(config) {
    config.set({
        basePath: '', // base path that will be used to resolve all patterns (eg. files, exclude)
        frameworks: ['jasmine', "karma-typescript"], // frameworks to use. available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        files: ['src/**/*.ts', 'test/**/*.spec.ts'], // list of files / patterns to load in the browser
        exclude: ['dist/**/*'], // list of files to exclude
        preprocessors: { "**/*.ts": ["karma-typescript"] }, // preprocess matching files before serving them to the browser.  available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        reporters: ["mocha", "karma-typescript"], // test results reporter to use. available reporters: https://npmjs.org/browse/keyword/karma-reporter
        port: 9876, // web server port
        colors: true, // enable / disable colors in the output (reporters and logs)
        logLevel: config.LOG_INFO, // level of logging. possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        autoWatch: true, // enable / disable watching file and executing tests whenever any file changes
        browsers: ['PhantomJS', 'Chrome', 'Firefox', 'IE'], // start these browsers. available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        singleRun: false, // Continuous Integration mode: if true, Karma captures browsers, runs the tests and exits
        concurrency: Infinity, // Concurrency level: how many browser should be started simultaneous
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.json",
            include: ["./src/**/*", "./test/**/*.spec.ts"],
            reports: {
                "lcovonly": {
                    "directory": "coverage", // optional, defaults to 'coverage' 
                    "subdirectory": "lcov", // optional, defaults to the name of the browser running the tests 
                    "filename": "lcov.info" // optional, defaults to the report name 
                },
                "html": "coverage"
            }
        }
    })
}