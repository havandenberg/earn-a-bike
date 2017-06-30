import Immutable from 'immutable';
import {messages} from 'utils/messages';
import {
  CLEAR_MESSAGES,
  EMAIL_NOT_FOUND,
  INCREMENT_NEXT_ID,
  INVALID_PIN,
  UPDATE_USERS
} from 'actions/app';
import {testStore} from 'utils/testData';

const config = require('electron-json-config');

config.set('users', testStore.users);
config.set('nextId', testStore.nextId);

const initialState = Immutable.fromJS({
  nextId: config.get('nextId'),
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
  case INCREMENT_NEXT_ID:
    return state.merge({
      nextId: state.get('nextId') + 1
    });
  default:
    return state;
  }
}
