import _ from 'lodash';
import moment from 'moment';
import {questionOneOptions, raceEthnicityOptions} from 'utils/constants';

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

export function getRaceEthnicityOtherValue(raceEthnicity = []) {
  const value = raceEthnicity.find(((val) => !raceEthnicityOptions.filter((opt) => opt !== 'Other').includes(val)));
  return value === undefined ? undefined : value;
}

export function getRaceEthnicityIsChecked(raceEthnicity = [], value) {
  const option = value === 'Other' ? getRaceEthnicityOtherValue(raceEthnicity) || '' : value;
  return raceEthnicity.find(((val) => val === option)) !== undefined;
}

export function getQuestionOneOtherValue(questionOne = []) {
  const value = questionOne.find(((val) => !questionOneOptions.filter((opt) => opt !== 'Other').includes(val)));
  return value === undefined ? undefined : value;
}

export function getQuestionOneIsChecked(questionOne = [], value) {
  const option = value === 'Other' ? getQuestionOneOtherValue(questionOne) || '' : value;
  return questionOne.find(((val) => val === option)) !== undefined;
}
