import {Iterable} from 'immutable';
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

if (process.env.NODE_ENV !== 'production') {
  middleware.push(require('redux-logger')({
    collapsed: true,
    duration: true,
    stateTransformer: (state) => {
      const newState = {};
      for (const i of Object.keys(state)) {
        if (Iterable.isIterable(state[i])) {
          newState[i] = state[i].toJS();
        } else {
          newState[i] = state[i];
        }
      }
      return newState;
    }
  }));
}

export const store = createStore(
  connectRouter(history)(reducers),
  applyMiddleware(...middleware)
);
