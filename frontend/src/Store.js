import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import teacherApp from './Reducers';

export default function configureStore() {
  return createStore(teacherApp, applyMiddleware(thunk));
}
