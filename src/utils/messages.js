import _ from 'lodash';

export function hasError(errors, fields) {
  return _.some(fields, (field) => {
    return _.indexOf(errors, field) !== -1;
  });
}

export const messages = {
  enterEmail: {
    text: 'Enter email',
    type: 'error'
  },
  enterPin: {
    text: 'Enter PIN',
    type: 'error'
  },
  emailNotFound: {
    text: 'Email not found.',
    type: 'error'
  },
  invalidPin: {
    text: 'Invalid PIN.',
    type: 'error'
  }
};
