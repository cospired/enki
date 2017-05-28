const path = require('path');
const glob = require('glob');

const { mainStory, chalk } = require('storyboard');

const { readJSON } = require('../../common/json');

function loadMessageJson(messageFile, story) {

  story.debug('load', `loading ${chalk.cyan.bold(messageFile)}`);

  return readJSON(messageFile).then( json =>

    json.map( message => ({ ...message, messageFile }))
  );
}

function checkDuplicates(messages, story) {

  const dups = {};
  const ids = messages.reduce( (memo, msg) => {

    if (memo.indexOf(msg.id) === -1) {
      return [...memo, msg.id];
    }
    dups[msg.id] = dups[msg.id] + 1 || 2;

    return memo;
  }, []);

  story.info('check', `Found ${chalk.blue(ids.length)} unique messages`);
  story.info('check', `within ${chalk.blue(messages.length)} total messages`);

  const dupCount = Object.keys(dups).length;
  if (dupCount > 0) {

    story.error('check', chalk.red.bold(`${dupCount} duplicate keys detected`));
    Object.keys(dups).forEach( dup => story.error('duplicates', `${dup}: ${dups[dup]} occurences`));
    story.error('check', chalk.red.bold('please check your data source'));
    throw new Error('duplicate keys detected.');
  }

  return messages;
}

function loadMessages(messageDir) {

  const story = mainStory.child({
    src: 'icu',
    title: 'load messages'
  });

  if (
    !messageDir ||
    typeof messageDir !== 'string' ||
    messageDir.length === 0
  ) {
    throw new Error('messageDir is required');
  }
  const messageFiles = path.join(messageDir, '**/*.json');

  return new Promise( (resolve, reject) => {

    glob(messageFiles, (err, files) => {

      if (err) {
        return reject(err);
      }
      story.debug('icu', 'message files', { attach: files });

      return Promise.all(files.map( file => loadMessageJson(file, story)))
      .then( messages => messages.reduce( (memo, msgs) => [...memo, ...msgs], []) )
      .then( messages => checkDuplicates(messages, story))
      .then( (messages) => {

        resolve( messages );
      })
      .catch(errPromise => reject(errPromise))
      .then(() => story.close());
    });

  });
}

function createStoreEntryFromICU(message, _story) {

  const { id, defaultMessage, description, file, start, end } = message;
  const entry = {
    id,
    defaultMessage,
    description,
    meta: {
      file,
      start,
      end,
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    translations: {}
  };

  return entry;
}

function updateStoreEntryFromICU(message, origEntry, _story) {

  const { id, defaultMessage, description, file, start, end } = message;
  // TODO: do we want to mark fuzzy when description changed as well?
  const fuzzy = origEntry.defaultMessage !== defaultMessage; // something changed

  const entry = {
    id,
    defaultMessage,
    description,
    meta: {
      ...origEntry.meta,
      file,
      start,
      end,
      updatedAt: fuzzy ? Date.now() : origEntry.meta.updatedAt,
      deletedAt: null
    },
    translations: { ...origEntry.translations }
  };
  if (fuzzy) {
    entry.translations = entry.translations.map( t => ({ ...t, meta: { ...t.meta, fuzzy } }) );
  }

  return entry;
}

module.exports = {
  loadMessages,
  createStoreEntryFromICU,
  updateStoreEntryFromICU
};
