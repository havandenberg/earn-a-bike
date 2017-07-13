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
  nextId: config.get('nextId') || 1,
  messages: [],
  users: config.get('users') || [
    {
      lastName: '1',
      isManager: true,
      phone: '111-222-3333',
      isActive: true,
      address: {
        streetLine1: '4 King St',
        streetLine2: '',
        city: 'Worcester',
        state: 'MA',
        zip: '01609'
      },
      pin: '1234',
      dateOfBirth: {
        month: '1',
        day: '1',
        year: '1999'
      },
      id: 0,
      firstName: 'Manager',
      email: 'manager'
    }
  ]
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
