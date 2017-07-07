import _ from 'lodash';
import moment from 'moment';
import {config} from 'reducers/app';
import {getHoursDifference} from 'utils/helpers';

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND';
export const INCREMENT_NEXT_ID = 'INCREMENT_NEXT_ID';
export const INVALID_PIN = 'INVALID_PIN';
export const UPDATE_USERS = 'UPDATE_USERS';

const updateUsers = (users) => {
  config.set('users', users);
  return {
    type: UPDATE_USERS,
    users
  };
};

export const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES
  };
};

export function handleSignIn(email, pin) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();

    const user = _.find(users, (u) => {
      return u.email === email;
    });

    if (!user) {
      dispatch({type: EMAIL_NOT_FOUND});
      return false;
    }

    if (user.pin === pin) {
      user.isActive = true;
      if (!user.isManager) {
        user.visits.unshift({
          timeIn: moment().unix(),
          timeOut: 0,
          hours: 0,
          notes: ''
        });
      }
      dispatch(updateUsers(users));
      return user;
    }

    dispatch({type: INVALID_PIN});
    return false;
  };
}

export function handleSignOut(id) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();

    const user = _.find(users, (u) => {
      return u.id === id;
    });
    user.isActive = false;

    if (!user.isManager) {
      const currentVisit = user.visits[0];
      currentVisit.timeOut = moment().unix();

      const startTime = moment.unix(currentVisit.timeIn);
      const endTime = moment.unix(currentVisit.timeOut);
      currentVisit.hours = parseFloat(getHoursDifference(startTime, endTime));
    }

    dispatch(updateUsers(users));
    return true;
  };
}

export function updateUser(newUser) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();

    const user = _.find(users, (u) => {
      return u.id === newUser.id;
    });

    _.each(Object.keys(user), (key) => {
      user[key] = newUser[key];
    });

    dispatch(updateUsers(users));
    return true;
  };
}

export function registerUser(newUser) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();
    const nextId = getState().app.get('nextId');

    const user = newUser;
    newUser.id = nextId;
    users.push(user);

    dispatch(updateUsers(users));
    config.set('nextId', nextId);
    dispatch({type: INCREMENT_NEXT_ID});
    return true;
  };
}
