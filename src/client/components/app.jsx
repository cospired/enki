import './app.scss';

import React from 'react';
import b3m from 'b3m';
import { IntlProvider, addLocaleData } from 'react-intl';

import de from 'react-intl/locale-data/de';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import ru from 'react-intl/locale-data/ru';
// for dev

import config from '../../../enkirc.json';
import Messages from '../../../l10n-messages/enkidb/enkidb.json';

// Components

import Header from './header';
import Translations from './translations';
import Details from './details';

addLocaleData([...en, ...fr, ...es, ...de, ...ru]); // TODO: should happen dynamically

class EnkiApp extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      config,
      messages: Messages,
      selectedMessage: Messages['enki.details.title']
    };
    this.displayName = 'EnkiApp';
  }

  render() {

    const cn = b3m(this.displayName);

    const { appTitle } = this.state.config;

    const { messages, selectedMessage } = this.state;

    const intlProps = {
      locale: navigator ? navigator.languages[0] : 'en'
    };

    return (
      <IntlProvider { ...intlProps }>
        <div className={ cn() } >
          <Header appTitle={ appTitle } />
          <Translations messages={ messages } />
          <Details message={ selectedMessage } />
        </div>
      </IntlProvider>
    );
  }
}

export default EnkiApp;
