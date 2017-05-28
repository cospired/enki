import './header.scss';

import React from 'react';
import PropTypes from 'prop-types';
import b3m from 'b3m';

// Components

function Header({
  appTitle
}) {

  const cn = b3m( Header.displayName );

  return (
    <div className={ cn() } >
      <div className={ cn('Logo') }>
        Enki
      </div>
      <div className={ cn('AppTitle') }>
        { appTitle }
      </div>
      <div className={ cn('Menu') } />
    </div>
  );
}

Header.propTypes = {
  appTitle: PropTypes.string.isRequired
};

Header.displayName = 'Header';

export default Header;
