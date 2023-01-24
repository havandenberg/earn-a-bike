import _ from 'lodash';
import moment from 'moment';

export function getHoursDifference(startTime, endTime) {
  return moment
    .duration(endTime.diff(startTime))
    .asHours()
    .toFixed(1);
}

export function getTotalHours(visits) {
  return _.reduce(
    visits,
    (totalHours, visit) => {
      return totalHours + visit.hours;
    },
    0,
  ).toFixed(1);
}


export function isUnderEighteen(user) {
  return moment().diff(moment(`${user.dobYear}${user.dobMonth}${user.dobDay}`, 'YYYYMMDD'), 'years') < 18;
}

export function getMaxHours(user) {
  return isUnderEighteen(user) ? 4 : 10;
}

export function isUsernameUnique(users, username) {
  return !_.some(users, (user) => user.username === username);
}

export function filterVisitsByHourType(visits, hourType) {
  return (visits || []).filter((visit) => _.isEmpty(hourType) || _.isEqual(visit.type, hourType));
}
