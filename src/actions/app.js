import _ from 'lodash';
import moment from 'moment';
import {getHoursDifference} from 'utils/helpers';

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND';
export const INVALID_PIN = 'INVALID_PIN';
export const UPDATE_USERS = 'UPDATE_USERS';

const updateUsers = (users) => {
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
      user.visits.unshift({
        timeIn: moment().unix(),
        timeOut: '',
        hours: 0,
        notes: ''
      });
      dispatch(updateUsers(users));
      return user;
    }

    dispatch({type: INVALID_PIN});
    return false;
  };
}

export function handleSignOut(email) {
  return (dispatch, getState) => {
    const users = getState().app.get('users').toJS();

    const user = _.find(users, (u) => {
      return u.email === email;
    });
    user.isActive = false;

    const currentVisit = user.visits[0];
    currentVisit.timeOut = moment().add(90, 'minutes').unix();

    const startTime = moment.unix(currentVisit.timeIn);
    const endTime = moment.unix(currentVisit.timeOut);
    currentVisit.hours = getHoursDifference(startTime, endTime);

    dispatch(updateUsers(users));
    return true;
  };
}
