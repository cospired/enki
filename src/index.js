const program = require('commander');
const { mainStory } = require('storyboard');
require('storyboard-preset-console');

const pkg = require('../package.json');

const { simpleReportPrinter } = require('./server/printers');
const { createLanguageFile } = require('./server/output/react-intl');

const { getConfig } = require('./server/config');
const db = require('./server/db');

process.on('SIGINT', () => {

  mainStory.debug('startup', 'CTRL-C received');
  process.exit(0);
});

program
  .version(pkg.version)
  .option('-r, --report', 'run report and exit')
  .option('-g, --generate', 'generate language files')
  .option('-c, --config [file]', 'specify Enki config file [.enkirc.json]', '.enkirc.json')
  .parse(process.argv);

mainStory.debug('startup', 'bootstrapping Enki...');

let Config;

getConfig(program.config)
.then( (config) => {

  Config = config;

  return db.init(Config);
})
.then( () => {

  db.createReport(simpleReportPrinter);

  if ( program.report) {
    mainStory.info('exit', 'Reporting mode, exiting now...');
    process.exit(0);
  }
})
.then( () => {

  // we are generating the files once on startup and then with every change.
  const messages = db.getMessageStore();

  return Promise.all(Config.languages.map(
    language => createLanguageFile(

      messages,
      language,
      (language === Config.defaultLanguage),
      Config.localesDir
    )
  ));

})
.then( () => {

  if ( program.generate) {
    mainStory.info('exit', 'Generation mode, exiting now...');
    process.exit(0);
  }
})
.then( () => {

  // fire up the server!
})
.catch( (err) => {

  mainStory.error('startup', 'something went wrong', { attach: err });
});
