/* eslint-disable no-console */
const {remote} = require('electron');
import fs from 'fs';
import _ from 'lodash';
import moment from 'moment';
import {config} from 'reducers/app';
import {updateNextId, updateUsers} from 'actions/app';
import {store} from 'utils/store';
import {filterVisitsByHourType, getTotalHours} from 'utils/helpers';

const userFieldsWithCommas = ['firstName', 'lastName', 'dobMonth', 'dobDay', 'dobYear', 'username', 'email', 'phone', 'raceEthnicity', 'addressLine1', 'addressCity', 'addressState', 'addressZip', 'questionOne', 'schoolName']; // eslint-disable-line max-len

export const importData = () => {
  remote.dialog.showOpenDialog(
    {
      buttonLabel: 'Import',
      filters: [{extensions: ['json']}]
    },
    (fileNames) => {
      if (fileNames === undefined) {
        return;
      }
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
    },
  );
};

export const exportJSON = (selectedUserIds) => {
  remote.dialog.showSaveDialog(
    {
      buttonLabel: 'Export',
      defaultPath: `${remote.app.getPath('desktop')}/EAB-data-${moment().format('MM-DD-YYYY')}.json`,
      filters: [{extensions: ['json']}],
      title: 'Export Earn-A-Bike Data as JSON'
    },
    (fileName) => {
      if (fileName === undefined) {
        return;
      }

      fs.writeFile(
        `${fileName}`,
        JSON.stringify({
          nextId: config.get('nextId'),
          users: _.filter(config.get('users'), (user) => (_.isEmpty(selectedUserIds) || _.includes(selectedUserIds, user.id)))
        }),
        (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`JSON data successfully saved to ${fileName}`);
          }
        },
      );
    },
  );
};

export const exportCSV = (selectedUserIds, includeVisits) => {
  remote.dialog.showSaveDialog(
    {
      buttonLabel: 'Export',
      defaultPath: `${remote.app.getPath('desktop')}/EAB-data-${moment().format('MM-DD-YYYY')}.csv`,
      filters: [{extensions: ['csv']}],
      title: 'Export Earn-A-Bike Data as CSV'
    },
    (fileName) => {
      if (fileName === undefined) {
        return;
      }

      let data = 'ID,First Name,Last Name,Date Of Birth,Username,Email,Phone,Race/Ethnicity,Address Line 1,City,State,Zip Code,Total Open Shop Hours,Total Volunteer Hours,Total Hours,Date Joined,Bikes Earned,How did you find out about Earn-A-Bike?,Email List,Interested In Manager,Student,School Name\n'; // eslint-disable-line max-len

      _.each(config.get('users'), (user) => {
        if (_.isEmpty(selectedUserIds) || _.includes(selectedUserIds, user.id)) {
          let userString = '';
          const totalOpenShopHours = getTotalHours(filterVisitsByHourType(user.visits, 'open shop'));
          const totalVolunteerHours = getTotalHours(filterVisitsByHourType(user.visits, 'volunteer'));
          const totalHours = getTotalHours(user.visits);

          _.each(Object.keys(user), (key) => {
            if (_.includes(userFieldsWithCommas, key)) {
              user[key] = `${user[key]}`.replace(/,/g, '');
            }
          });

          userString += `${user.id + 1},${user.firstName},${user.lastName},${user.dobMonth}/${user.dobDay}/${user.dobYear},${user.username},${user.email},${user.phone},${user.raceEthnicity || ''},${user.addressLine1},${user.addressCity},${user.addressState},${user.addressZip},${totalOpenShopHours},${totalVolunteerHours},${totalHours},${user.dateJoined || ''},`; // eslint-disable-line max-len

          if (!user.isManager) {
            let bikesString = '';

            _.each(user.bikesEarned, (bike) => {
              bikesString += `${bike.description.replace(/,/g, '')}; `;
            });

            userString += `${bikesString},${user.questionOne},${user.emailList ? 'Yes' : 'No'},${user.isInterestedManager ? 'Yes' : 'No'},${user.isStudent ? 'Yes' : 'No'},${user.schoolName ? user.schoolName : '-'},`; // eslint-disable-line max-len
          }

          userString = userString.replace(/\n/g, '');
          data += `${userString}\n`;

          if (includeVisits) {
            _.each(user.visits, (visit, idx) => {
              const visitString = `,,${idx === 0 ? 'Visits:,' : ','}${
                moment.unix(visit.timeIn).format('MM-DD-YYYY')
              },${
                moment.unix(visit.timeIn).format('hh:mm a')
              },${
                moment.unix(visit.timeOut).format('hh:mm a')
              },${visit.hours},${visit.type ? visit.type : '-'},${visit.notes}`;
              data += `${visitString}\n`;
            });
          }
        }
      });

      fs.writeFile(`${fileName}`, data, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`CSV data successfully saved to ${fileName}`);
        }
      });
    },
  );
};
