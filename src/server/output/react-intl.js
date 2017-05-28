const path = require('path');
const { writeJSON } = require('../../common/json');

function findTranslation(language, msg, isDefault) {

  if (isDefault) {
    return msg.defaultMessage;
  }
  // match (de-DE)
  if (msg.translations[language] && msg.translations[language].message) {
    return msg.translations[language].message;
  }
  // use message inheritFrom strategy
  // or configured language strategy
  // or language strategy
  // or default strategy:
  // else look in parent (de)

  // else in siblings (de-AT, de-CH)

  // else in children (de-DE-BY)

  // do not set default message as fallback, react-intl is taking care of that!
  return undefined;
}

function createLanguageFile(store, language, isDefault, outputDir) {

  const filename = path.resolve(outputDir, `${language}.json`);
  const messages = Object.values(store);

  const translations = messages.reduce( (memo, msg) => ({

    ...memo,
    [msg.id]: findTranslation(language, msg, isDefault)
  }), {});

  return writeJSON(filename, translations);
}

module.exports = {
  createLanguageFile
};
