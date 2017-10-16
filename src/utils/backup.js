/* eslint-disable no-console */
import fs from 'fs';
const {remote} = require('electron');
import moment from 'moment';
import {config} from 'reducers/app';

export function backup() {
  const lastBackup = config.get('lastBackup') ? moment(config.get('lastBackup')) : null;
  const today = moment();
  const backupFolder = `${remote.app.getPath('userData')}/backups`;

  if (!lastBackup || today.diff(lastBackup, 'days') > 6) {
    try {
      fs.statSync(backupFolder);
    } catch (e) {
      fs.mkdirSync(backupFolder);
    }
    const fileName = `${backupFolder}/eab-backup-${today.format('MM-DD-YYYY')}.json`;

    config.set('lastBackup', today.format('MM-DD-YYYY'));

    fs.writeFile(fileName, JSON.stringify(
      {
        lastBackup: config.get('lastBackup'),
        nextId: config.get('nextId'),
        users: config.get('users')
      }
    ), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Data successfully backed up to ${fileName}`);
      }
    });
  }
}
