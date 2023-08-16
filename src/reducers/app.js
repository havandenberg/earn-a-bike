import Immutable from 'immutable';
import {messages} from 'utils/messages';
import {
  CLEAR_MESSAGES,
  USERNAME_NOT_FOUND,
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
        month: '01',
        day: '01',
        year: '1999'
      },
      id: 0,
      firstName: 'Manager',
      email: 'manager',
      username: 'manager',
      raceEthnicity: []
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
  case USERNAME_NOT_FOUND:
    return state.merge({
      messages: [messages.usernameNotFound]
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
