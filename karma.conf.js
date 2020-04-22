module.exports = function (config) {
  config.set({
    frameworks: ['karma-typescript', 'tap'],
    files: ['src/**/*.ts', 'test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    plugins: ['karma-typescript', 'karma-tap', 'karma-chrome-launcher', 'karma-firefox-launcher'],
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
      },
      tsconfig: "./tsconfig.test.json"
    },
    colors: true,
    browsers: ['FirefoxHeadless', 'ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity,
    // Fail after timeout
    browserDisconnectTimeout: 100000,
    browserNoActivityTimeout: 100000,
  })
}
