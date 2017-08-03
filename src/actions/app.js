import _ from 'lodash';
import moment from 'moment';
import {getHoursDifference} from 'utils/helpers';

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const USERNAME_NOT_FOUND = 'USERNAME_NOT_FOUND';
export const UPDATE_NEXT_ID = 'UPDATE_NEXT_ID';
export const INVALID_PIN = 'INVALID_PIN';
export const UPDATE_USERS = 'UPDATE_USERS';

export const updateUsers = (users) => {
  return {
    type: UPDATE_USERS,
    users
  };
};

export const updateNextId = (nextId) => {
  return {
    type: UPDATE_NEXT_ID,
    nextId
  };
};

export const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES
  };
};

export function handleSignIn(username, pin) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();

    const user = _.find(users, (u) => {
      return u.username === username;
    });

    if (!user) {
      dispatch({type: USERNAME_NOT_FOUND});
      return false;
    }

    if (!user.isActive && user.pin === pin) {
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

    if (!user.isActive) {dispatch({type: INVALID_PIN});}
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

export function updateUser(updatedUser) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();

    const user = _.find(users, (u) => {
      return u.id === updatedUser.id;
    });

    _.each(Object.keys(user), (key) => {
      user[key] = updatedUser[key];
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
    dispatch(updateNextId(nextId + 1));
    return true;
  };
}

export function deleteUsers(idsToDelete) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();

    _.each(idsToDelete, (id) => {
      _.remove(users, (user) => (id !== 0 && user.id === id));
    });

    dispatch(updateUsers(users));
    return true;
  };
}
