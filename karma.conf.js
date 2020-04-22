module.exports = function(config) {
  const testRunner = process.env.TEST_ENV

  switch (testRunner) {
    case 'tape':
      config.set(tapeConfig)
      break
    case 'mocha':
      config.set(mochaConfig)
      break
  }
}

const commonConfig = {
  frameworks: ['karma-typescript'],
  files: ['src/**/*.ts', 'test/**/*.ts'],
  preprocessors: {
    '**/*.ts': ['karma-typescript'],
  },
  plugins: ['karma-typescript', 'karma-chrome-launcher', 'karma-firefox-launcher'],
  karmaTypescriptConfig: {
    tsconfig: './tsconfig.test.json',
  },
  colors: true,
  browsers: ['FirefoxHeadless', 'ChromeHeadless'],
  singleRun: true,
  concurrency: Infinity,
  // Fail after timeout
  browserDisconnectTimeout: 100000,
  browserNoActivityTimeout: 100000,
}


const tapeConfig = {
  ...commonConfig,
  frameworks: [...commonConfig.frameworks, 'tap'],
  plugins: [...commonConfig.plugins, 'karma-tap'],
  karmaTypescriptConfig: {
    ...commonConfig.karmaTypescriptConfig,
    bundlerOptions: {
      entrypoints: /\.spec\.ts$/,
    },
  },
}

const mochaConfig = {
  ...commonConfig,
  frameworks: [...commonConfig.frameworks, 'mocha'],
  plugins: [...commonConfig.plugins, 'karma-mocha'],
  karmaTypescriptConfig: {
    ...commonConfig.karmaTypescriptConfig,
    bundlerOptions: {
      entrypoints: /\.test\.ts$/,
    },
  },
}
