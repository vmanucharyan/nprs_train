/* eslint-disable no-console */

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/App';
import Trace from './components/Trace';

window.React = React;

render(
  (<Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/trace" component={Trace} />
    </Route>
  </Router>), document.getElementById('content')
);
