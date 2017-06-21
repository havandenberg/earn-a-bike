import Immutable from 'immutable';
import {messages} from 'utils/messages';
import {
  CLEAR_MESSAGES,
  EMAIL_NOT_FOUND,
  INVALID_PIN,
  UPDATE_USERS
} from 'actions/app';
import {testStore} from 'utils/testData';

const config = require('electron-json-config');

config.set('users', testStore.users);
config.set('info', testStore.info);

const initialState = Immutable.fromJS({
  info: config.get('info'),
  messages: [],
  users: config.get('users')
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case UPDATE_USERS:
    return state.merge({
      users: action.users
    });
  case CLEAR_MESSAGES:
    return state.merge({
      messages: []
    });
  case EMAIL_NOT_FOUND:
    return state.merge({
      messages: [messages.emailNotFound]
    });
  case INVALID_PIN:
    return state.merge({
      messages: [messages.invalidPin]
    });
  default:
    return state;
  }
}
