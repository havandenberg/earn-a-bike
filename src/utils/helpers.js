import moment from 'moment';

export function getHoursDifference(startTime, endTime) {
  return moment.duration(endTime.diff(startTime)).asHours().toFixed(1);
}
