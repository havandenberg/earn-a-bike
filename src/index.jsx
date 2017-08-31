import React from 'react';
import {render} from 'react-dom';
import {ipcRenderer} from 'electron';
import {store} from 'utils/store';
import App from 'components/App.jsx';
import {signoutAllUsers} from 'actions/app';
import 'styles/main.styl';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ipcRenderer.on('signout-all-users', () => {
  store.dispatch(signoutAllUsers());
});

render(<App />, document.getElementById('root'));
