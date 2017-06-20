import Immutable from 'immutable';
import {messages} from 'utils/messages';
import {
  ADD_ACTIVE_USER,
  EMAIL_NOT_FOUND,
  INVALID_PIN
} from 'actions/app';

const config = require('electron-json-config');

config.set('users', [
  {
    address: {
      city: 'Worcester',
      state: 'NY',
      streetLine1: '19 Lancaster St',
      streetLine2: 'Apt 3',
      zip: '01609'
    },
    dateOfBirth: {
      day: '',
      month: '',
      year: ''
    },
    email: 'halseyvandenberg@gmail.com',
    firstName: 'Halsey',
    isActive: false,
    isManager: true,
    lastName: 'Vandenberg',
    parentName: '',
    parentPhone: '',
    pin: '1234',
    phone: '9147032060',
    visits: [
      {
        date: '10/17/2016',
        timeIn: '01:36',
        timeOut: '03:36',
        hours: 2,
        notes: 'Today I wrenched super hard on some rad bikes, made a bunch of friends, and helped some people out!'
      }
    ]
  }
]);
console.log(config.get('users')); // eslint-disable-line no-console

const initialState = Immutable.fromJS({
  activeUsers: [],
  info: config.get('info'),
  messages: [],
  users: config.get('users')
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case ADD_ACTIVE_USER:
    return state.merge({
      activeUsers: state.get('activeUsers').push(action.user)
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
