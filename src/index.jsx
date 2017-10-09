import React from 'react';
import {render} from 'react-dom';
import App from 'components/App.jsx';
import {updateUserData} from 'utils/updateUserData';
import 'styles/main.styl';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

updateUserData();

render(<App />, document.getElementById('root'));
