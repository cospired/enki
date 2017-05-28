import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';

if (module.hot) {
  module.hot.accept();
}

const mountNode = document.getElementById('Enki');

if (typeof window !== 'undefined' && mountNode) {
  ReactDOM.render(<App />, mountNode);
}
