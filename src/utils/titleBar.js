import {remote} from 'electron';
import {signoutAllUsers} from 'actions/app';
import {store} from 'utils/store';

export const minimize = () => {
  remote.getCurrentWindow().minimize();
};

export const maximize = () => {
  remote.getCurrentWindow().maximize();
};

export const close = () => {
  const choice = remote.dialog.showMessageBox({
    type: 'question',
    buttons: ['Yes', 'No'],
    title: 'Confirm',
    message: 'Are you sure you want to quit? This will sign out all active users.'
  });
  if (choice === 1) {
    return;
  }
  store.dispatch(signoutAllUsers());
  remote.getCurrentWindow().close();
};
