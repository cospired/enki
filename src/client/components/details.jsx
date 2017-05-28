import './details.scss';

import React from 'react';
import b3m from 'b3m';
import { FormattedMessage, defineMessages } from 'react-intl';

// Components

const messages = defineMessages({
  title: {
    id: 'enki.details.title',
    description: 'Title of the details area',
    defaultMessage: 'Details'
  }
});

function Details() {

  const cn = b3m( Details.displayName );

  return (
    <div className={ cn() } >
      <h1 className={ cn('Title') }>
        <FormattedMessage { ...messages.title } />
      </h1>
    </div>
  );
}

Details.displayName = 'Details';

export default Details;
