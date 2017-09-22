import _ from 'lodash';
import {updateUsers} from 'actions/app';
import {config} from 'reducers/app';
import {store} from 'utils/store';

// Change to true if updating data
const shouldUpdateUserData = false;

export const updateUserData = () => {
  if (shouldUpdateUserData) {
    const users = config.get('users');

    // update user data block
    _.each(users, (user) => {
      if (user.isManager) {
        user.visits = [];
      }
    });

    store.dispatch(updateUsers(users));
    // config.set('users', users);
  }
};
