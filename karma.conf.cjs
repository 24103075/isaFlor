// karma.conf.cjs
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/test/setupTests.js', watched: false },
      { pattern: 'src/test/**/*.spec.jsx', watched: false }
    ],
    preprocessors: {
      'src/test/setupTests.js': ['webpack'],
      'src/test/**/*.spec.jsx': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx'],
      },
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true,
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter')
    ]
  });
};  