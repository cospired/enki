const fs = require('fs-extra');
const merge = require('lodash.merge');
const { mainStory, chalk } = require('storyboard');

const defaultConfig = {
  messageDir: 'messages',
  dbDir: 'enkidb',
  localesDir: 'build/locales',
  output: {
    format: ['react-intl'],
    sortKeys: true,
    jsonOptions: { space: 2, trailingNewline: true }
  },
  defaultLanguage: 'en',
  languages: ['en', 'de']
};

function loadConfigFile(story, configfile) {

  let filename = configfile;
  if (!filename) {
    filename = './.enkirc.json';
  }
  story.info('load', `using ${chalk.cyan.bold(filename)}`);

  return fs.readJson(filename);

}

function saveConfig(_config, _filename) {

  // todo
  // only write the fields that defer from default or are already in the config
}

function getConfig(filename ) {

  const story = mainStory.child({
    src: 'config',
    title: 'loading config'
  });

  return loadConfigFile(story, filename)
  .then( (json) => {

    const config = merge({}, defaultConfig, json);
    story.info('merge', 'config:', { attach: config });

    return config;
  })
  .catch( (_err) => {

    story.warn('merge', 'no config found, using default config');

    return defaultConfig;
  })
  .then((config) => {

    story.close();

    return config;
  });
}

module.exports = {
  getConfig,
  saveConfig
};
