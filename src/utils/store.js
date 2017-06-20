import thunk from 'redux-thunk';
import {createHashHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {createStore, applyMiddleware} from 'redux';
import reducers from 'reducers/reducer';

export const history = createHashHistory();
const middleware = [
  thunk,
  routerMiddleware(history)
];

// Development adds logging, must be last
if (process.env.NODE_ENV !== 'production') {
  middleware.push(require('redux-logger')({
    // Change this configuration to your liking
    duration: true, collapsed: true
  }));
}

export const store = createStore(
  connectRouter(history)(reducers),
  applyMiddleware(...middleware)
);
