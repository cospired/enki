import './translations.scss';

import React from 'react';
import b3m from 'b3m';
// Components

function Translations() {

  const cn = b3m( Translations.displayName );

  return (
    <div className={ cn() } >
      Translations
    </div>
  );
}

Translations.displayName = 'Translations';

export default Translations;
