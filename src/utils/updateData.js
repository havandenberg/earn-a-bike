import _ from 'lodash';
import {updateUsers} from 'actions/app';
import {config} from 'reducers/app';
import {store} from 'utils/store';

// Change to true if updating data
const shouldUpdateData = false;

export const updateData = () => {
  if (shouldUpdateData) {
    const users = config.get('users');

    // update data block
    _.each(users, () => {
    });

    store.dispatch(updateUsers(users));
    // config.set('users', users);
  }
};
