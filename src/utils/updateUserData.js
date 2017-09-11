import _ from 'lodash';
// import {updateUsers} from 'actions/app';
import {config} from 'reducers/app';
// import {store} from 'utils/store';

// Change to true if updating data
const shouldUpdateUserData = false;

export const updateUserData = () => {
  if (shouldUpdateUserData) {
    const users = config.get('users');

    // update user data block
    _.each(users, (user) => {
      user.addressLine1 = user.address.streetLine1;
      user.addressLine2 = user.address.streetLine2;
      user.addressCity = user.address.city;
      user.addressState = user.address.state;
      user.addressZip = user.address.zip;
      user.bikesEarned = [];
      user.dobMonth = user.dateOfBirth.month;
      user.dobDay = user.dateOfBirth.day;
      user.dobYear = user.dateOfBirth.year;
      user.username = user.email;
      user.countryOfOrigin = 'Country of Origin';
      delete user.address;
      delete user.dateOfBirth;
    });

    // store.dispatch(updateUsers(users));
    // config.set('users', users);
  }
};
