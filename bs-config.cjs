/*
 | Browser-sync config file
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 | */
module.exports = {
  ui: false,
  files: ['public/**/*'],
  watchEvents: [
    'change',
  ],
  watchOptions: {
    ignoreInitial: true,
  },
  server: {
    baseDir: 'public',
  },
  port: 3000,
  notify: false,
  plugins: ['browser-sync-console'],
};
