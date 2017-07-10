import Immutable from 'immutable';
import {messages} from 'utils/messages';
import {
  CLEAR_MESSAGES,
  EMAIL_NOT_FOUND,
  UPDATE_NEXT_ID,
  INVALID_PIN,
  UPDATE_USERS
} from 'actions/app';

export const config = require('electron-json-config');

const initialState = Immutable.fromJS({
  nextId: config.get('nextId'),
  messages: [],
  users: config.get('users')
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case UPDATE_USERS:
    config.set('users', action.users);
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
  case UPDATE_NEXT_ID:
    config.set('nextId', action.nextId);
    return state.merge({
      nextId: action.nextId
    });
  default:
    return state;
  }
}
