const path = require('path');
const fs = require('fs-extra');

const { mainStory, chalk } = require('storyboard');

const { simpleReportPrinter } = require('../printers');

const {
  loadMessages,
  createStoreEntryFromICU,
  updateStoreEntryFromICU
} = require('./icu');

function loadMessageStore(dbDir, story) {

  const filename = path.resolve(dbDir, './enkidb.json');

  story.info('db', `Reading file ${chalk.cyan.bold(filename)}...`);

  return fs.readJson(filename)
  .catch( (_err) => {

    story.warn('db', 'couldnt load message store, starting from scratch');

    return {};
  });
}

function writeMessageStore(store, dbDir, story) {

  const filename = path.resolve(dbDir, './enkidb.json');

  story.info('db', `saving file ${chalk.cyan.bold(filename)}...`);
  const options = {
    spaces: 2
  };

  return fs.outputJson(filename, store, options);
}
function updateStoreFromMessages(storeIn, messages, story) {

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

function createReport(store, languages, reportPrinter) {

  const keys = Object.keys(store);
  const stats = keys.reduce( (memo, key) => {

    languages.forEach( (lang) => {

      if (key[lang]) {
        ['message', 'fuzzy', 'whitelist'].forEach( (s) => {

          if (key[lang][s]) {
            stats[lang][s] += 1;
          }
        });
      }
    });

    return memo;
  }, {
    keys: keys.length,
    languages: languages.reduce( (memo, l) =>

      ({
        ...memo,
        [l]: {
          fuzzy: 0,
          whitelist: 0,
          message: 0
        } })
      , {})
  });

  reportPrinter(stats);
}

let Store;

function init(config, report) {

  const story = mainStory.child({
    src: 'db',
    title: 'initializing database'
  });

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
    story.debug('db', 'store', { attach: Store });
    createReport(Store, config.languages, simpleReportPrinter);
    story.close();

    return writeMessageStore(Store, config.dbDir, story);
  })
  .catch( (err) => {

    if (report) {
      // print report on current store before exiting
      createReport(Store, config.languages, simpleReportPrinter);
    }
    story.close();
    throw err;
  });
}

module.exports = {
  init
};
