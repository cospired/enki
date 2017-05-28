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

import config from '../../../example/enkirc.json';
import messages from '../../../example/enkidb/enkidb.json';

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
      messages,
      selectedMessage: null
    };
    this.displayName = 'EnkiApp';
  }

  render() {

    const cn = b3m(this.displayName);

    const { appTitle } = this.state.config;

    const intlProps = {
      locale: navigator ? navigator.languages[0] : 'en'
    };

    return (
      <IntlProvider { ...intlProps }>
        <div className={ cn() } >
          <Header appTitle={ appTitle } />
          <Translations />
          <Details />
        </div>
      </IntlProvider>
    );
  }
}


export default EnkiApp;
