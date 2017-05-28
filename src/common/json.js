const stableStringify = require('json-stable-stringify');
const fs = require('fs-extra');

function writeJSON(
  filename,
  json,
  {
    replacer = null,
    space = 2,
    sortKeys = true,
    trailingNewline = true
  } = {}
) {

  const jsonString = (sortKeys
    ? stableStringify(json, { replacer, space })
    : JSON.stringify(json, replacer, space)) + (trailingNewline ? '\n' : '');

  return fs.outputFile(filename, jsonString);
}

function readJSON(filename) {

  return fs.readJson(filename);
}

module.exports = {
  writeJSON,
  readJSON
};
