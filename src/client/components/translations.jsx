import './translations.scss';

import React from 'react';
import PropTypes from 'prop-types';
import b3m from 'b3m';

import { messageShape } from '../shapes';
// Components

function Translations({
  messages,
  selectedMessage
}) {

  const cn = b3m( Translations.displayName );

  return (
    <div className={ cn() } >
      {''}
    </div>
  );
}

Translations.propTypes = {
  messages: PropTypes.arrayOf(messageShape).isRequired,
  selectedMessage: messageShape
};

Translations.defaultProps = {
  selectedMessage: null
};

Translations.displayName = 'Translations';

export default Translations;
