const program = require('commander');
const { mainStory } = require('storyboard');
require('storyboard-preset-console');

const pkg = require('../package.json');

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

  return db.init(Config, program.report);
})
.catch( (err) => {

  mainStory.error('startup', 'something went wrong', { attach: err });
});
