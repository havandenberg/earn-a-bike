import React from 'react';
import {render} from 'react-dom';
import App from 'components/App.jsx';
import {backup} from 'utils/backup';
import {updateData} from 'utils/updateData';
import 'styles/main.styl';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

updateData();
backup();

render(<App />, document.getElementById('root'));
