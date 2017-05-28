const path = require('path');

const { mainStory, chalk } = require('storyboard');

const { readJSON, writeJSON } = require('../common/json');

const {
  loadMessages,
  createStoreEntryFromICU,
  updateStoreEntryFromICU
} = require('./input/icu');

let Store;
let Config;

function loadMessageStore(dbDir, story) {

  const filename = path.resolve(dbDir, './enkidb.json');

  story.info('db', `Reading file ${chalk.cyan.bold(filename)}...`);

  return readJSON(filename)
  .catch( (_err) => {

    story.warn('db', 'couldnt load message store, starting from scratch');

    return {};
  });
}

function writeMessageStore(store, dbDir, story) {

  const filename = path.resolve(dbDir, './enkidb.json');

  story.info('db', `saving file ${chalk.cyan.bold(filename)}...`);

  return writeJSON(filename, store);
}

function updateStoreFromMessages(storeIn, messages, _story) {

  const store = { ...storeIn };
  const newStore = {};

  messages.forEach( (message) => {

    if (!store[message.id]) {
      newStore[message.id] = createStoreEntryFromICU(message);

      return;
    }

    newStore[message.id] = updateStoreEntryFromICU(message, store[message.id]);
    delete store[message.id];
  });

  Object.keys(store).forEach( (key) => {

    const message = store[key];
    newStore[message.id] = {
      ...message,
      meta: {
        ...message.meta,
        deletedAt: Date.now()
      }
    };
  });

  return newStore;
}

function updateMessageTranslation(id, language, translation, story) {

  if (!Store[id]) {
    throw new Error('non-existent message id');
  }
  if (Config.languages.indexOf(language) === -1) {
    throw new Error('unknown language');
  }
  const oldTranslation = Store[id].translations[language] || {};

  Store[id].translations[language] = { ...oldTranslation, translation };

  return writeMessageStore(Store, Config.dbDir, story);
}

function getMessageStore() {

  return Store;
}

function createReport(reportPrinter) {

  const store = Store;
  const languages = Config.languages;
  const keys = Object.keys(store);
  const stats = keys.reduce( (memoIn, key) => {

    const memo = { ...memoIn };
    const message = store[key];
    if (message.meta.deletedAt) {
      memo.unused += 1;

      return memo; // we are not checking translations for unused messages
    }

    memo.keys += 1;
    languages.forEach( (lang) => {

      const translation = message.translations[lang];

      if (translation) {
        ['message', 'fuzzy', 'whitelist'].forEach( (s) => {

          if (translation[s]) {
            memo.languages[lang][s] += 1;
          }
        });

        // TODO: this needs more sophisticated rules with translation inheritance
        if (translation.fuzzy || (!translation.message && !translation.whitelist) ) {
          memo.languages[lang].uptodate = false;
        }
      } else {
        memo.languages[lang].uptodate = false;
      }
    });

    return memo;
  }, {
    keys: 0,
    unused: 0,
    uptodate: true,
    languages: languages.reduce( (memo, l) =>

      ({
        ...memo,
        [l]: {
          fuzzy: 0,
          whitelist: 0,
          message: 0,
          uptodate: true
        } })
      , {})
  });

  reportPrinter(stats);
}

function init(config) {

  const story = mainStory.child({
    src: 'db',
    title: 'initializing database'
  });

  Config = config;

  return loadMessageStore(config.dbDir, story)
  .then( (messageStore) => {

    Store = messageStore;

    return loadMessages(config.messageDir);
  })
  .then( (messages) => {

    story.debug('db', 'compare messages with db');

    return updateStoreFromMessages(Store, messages, story);
  })
  .then( (messageStore) => {

    Store = messageStore;
    story.close();

    return writeMessageStore(Store, config.dbDir, story);
  });
}

module.exports = {
  init,
  getMessageStore,
  updateMessageTranslation,
  createReport
};
