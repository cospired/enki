const { mainStory, chalk } = require('storyboard');

function simpleReportPrinter(stats) {

  const story = mainStory.child({
    src: 'report',
    title: 'full Translation Report'
  });

  story.info(`internationalized messages: ${stats.keys}`);
  story.info(`-- unused messages:         ${stats.unused}`);
  Object.keys(stats.languages).forEach( (lang) => {

    const { message, fuzzy, whitelist, uptodate } = stats.languages[lang];
    const missing = stats.keys - message - whitelist;
    story.info(chalk.blue(`Report for ${lang}:`));
    story.info(` translated messages:       ${message}`);
    story.info(` -- thereof fuzzy:          ${fuzzy}`);
    story.info(` whitelisted messages:      ${whitelist}`);
    story.info(` missing messages:          ${missing}`);
    if (uptodate) {
      story.info(chalk.green(`==> ${lang} is uptodate`));
    } else {
      story.info(chalk.red(`==> ${lang} needs attention`));
    }
    story.info('-------------------------');

  });
  story.close();
}

module.exports = {
  simpleReportPrinter
};
