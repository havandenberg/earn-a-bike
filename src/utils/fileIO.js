/* eslint-disable no-console */
import fs from 'fs';
const {remote} = require('electron');
import {config} from 'reducers/app';
import {updateNextId, updateUsers} from 'actions/app';
import {store} from 'utils/store';

export const importData = () => {
  remote.dialog.showOpenDialog({
    buttonLabel: 'Import',
    filters: [
      {extensions: ['json']}
    ]
  }, (fileNames) => {
    if (fileNames === undefined) {return;}
    const fileName = fileNames[0];

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Data successfully imported from ${fileName}`);
        const dataObj = JSON.parse(data);
        config.set('users', dataObj.users);
        config.set('nextId', dataObj.nextId);
        store.dispatch(updateUsers(dataObj.users));
        store.dispatch(updateNextId(dataObj.nextId));
        return dataObj;
      }
    });
  });
};

export const exportData = () => {
  remote.dialog.showSaveDialog({
    buttonLabel: 'Export',
    defaultPath: `${remote.app.getPath('desktop')}/data.json`,
    filters: [
      {extensions: ['json']}
    ],
    title: 'Export Earn-A-Bike Data'
  }, (fileName) => {
    if (fileName === undefined) {return;}

    fs.writeFile(`${fileName}`, JSON.stringify(
      {
        nextId: config.get('nextId'),
        users: config.get('users')
      }
    ), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Data successfully saved to ${fileName}`);
      }
    });
  });
};
