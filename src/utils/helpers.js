import _ from 'lodash';
import moment from 'moment';

export function getHoursDifference(startTime, endTime) {
  return moment.duration(endTime.diff(startTime)).asHours().toFixed(1);
}

export function getTotalHours(user) {
  return _.reduce(user.visits, (totalHours, visit) => {
    return totalHours + visit.hours;
  }, 0);
}
