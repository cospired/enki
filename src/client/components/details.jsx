import './details.scss';

import React from 'react';
import b3m from 'b3m';
import {
  FormattedMessage,
  FormattedRelative,
  defineMessages
} from 'react-intl';

import { messageShape } from '../shapes';

// Components

const messages = defineMessages({
  title: {
    id: 'enki.details.title',
    description: 'Title of the details area',
    defaultMessage: 'Details'
  },
  noMessage: {
    id: 'enki.details.noMessage',
    description: 'Hint showing in the details area when no message is selected',
    defaultMessage: 'No message selected'
  },
  description: {
    id: 'enki.details.description',
    description: 'title for the description/context of the message',
    defaultMessage: 'Description'
  },
  usage: {
    id: 'enki.details.usage',
    description: 'title for the usage of the message (timestamps for create, update, delete)',
    defaultMessage: 'Usage'
  },
  since: {
    id: 'enki.details.since',
    description: 'when the message was created',
    defaultMessage: 'first used { date }'
  },
  until: {
    id: 'enki.details.until',
    description: 'when the message was deleted',
    defaultMessage: 'until { date }'
  },
  update: {
    id: 'enki.details.update',
    description: 'when the message was last updated/changed',
    defaultMessage: '(last updated { date })'
  },
  source: {
    id: 'enki.details.source',
    description: 'source of the message in the code',
    defaultMessage: 'Source'
  }
});

function renderHint(cn) {

  return (
    <div className={ cn('Hint') }>
      <FormattedMessage { ...messages.noMessage } />
    </div>
  );
}

function renderDetails(message, cn) {

  const { description, meta } = message;

  return (
    <div className={ cn('Details') }>
      <div className={ cn('Row') }>
        <div className={ cn('HeaderCell') }>
          <FormattedMessage { ...messages.description } />
        </div>
        <div className={ cn('Cell') }>
          { description }
        </div>
      </div>
      <div className={ cn('Row') }>
        <div className={ cn('HeaderCell') }>
          <FormattedMessage { ...messages.usage } />
        </div>
        <div className={ cn('Cell') }>
          <FormattedMessage
            { ...messages.since }
            values={ {
              date: <FormattedRelative value={ new Date(meta.createdAt) } />
            } }
          />
          { meta.deletedAt &&
            <FormattedMessage
              { ...messages.until }
              values={ {
                date: <FormattedRelative value={ new Date(meta.deletedAt) } />
              } }
            />
          }
          { ' ' }
          <FormattedMessage
            { ...messages.update }
            values={ {
              date: <FormattedRelative value={ new Date(meta.updatedAt) } />
            } }
          />
        </div>
      </div>
      <div className={ cn('Row') }>
        <div className={ cn('HeaderCell') }>
          <FormattedMessage { ...messages.source } />
        </div>
        <div className={ cn('Cell') }>
          { meta.file }
          {
            meta.start &&
            <span className={ cn('Lines') }>
              {' '}
              ({meta.start.line}:{meta.start.column}
              {
                meta.end &&
                <span>-{meta.end.line}:{meta.end.column}</span>
              }
              )
            </span>
          }

        </div>
      </div>
    </div>
  );
}

function Details({
  message
}) {

  const cn = b3m( Details.displayName );

  return (
    <div className={ cn() } >
      <h1 className={ cn('Title') }>
        <FormattedMessage { ...messages.title } />
      </h1>
      { message
        ? renderDetails(message, cn)
        : renderHint(cn)
      }
    </div>
  );
}

Details.propTypes = {
  message: messageShape
};

Details.defaultProps = {
  message: null
};

Details.displayName = 'Details';

export default Details;
