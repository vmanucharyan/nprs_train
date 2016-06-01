import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../Store';
import App from './App';

import { fetchImage, fetchTrace } from '../Actions';

const store = configureStore();

store.subscribe(() => {
  console.log('state changed');
  console.log(store.getState());
});

store.dispatch(fetchImage('1'));
store.dispatch(fetchTrace(53));

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
