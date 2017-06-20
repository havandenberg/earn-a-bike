import _ from 'lodash';
export const ADD_ACTIVE_USER = 'ADD_ACTIVE_USER';
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export const EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND';
export const INVALID_PIN = 'INVALID_PIN';

const addActiveUser = (user) => {
  return {
    type: ADD_ACTIVE_USER,
    user
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

    const activeUser = _.find(users, (user) => {
      return user.email === email;
    });

    if (!activeUser) {
      dispatch({type: EMAIL_NOT_FOUND});
      return false;
    }

    if (activeUser.pin === pin) {
      dispatch(addActiveUser(activeUser));
      return activeUser;
    }

    dispatch({type: INVALID_PIN});
  };
}
