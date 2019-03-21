import _ from 'lodash';
import {getTotalHours} from 'utils/helpers';
import {filterVisitsByHourType} from './helpers';

export const sortByActive = (a, b) => {
  if (!a.isManager && !b.isManager) {
    const aHasVisits = !_.isEmpty(a.visits);
    const bHasVisits = !_.isEmpty(b.visits);
    if (aHasVisits && bHasVisits) {
      const x = _.isEmpty(a.visits) ? 0 : a.visits[0].timeIn;
      const y = _.isEmpty(b.visits) ? 0 : b.visits[0].timeIn;
      return x < y ? -1 : x > y ? 1 : 0;
    }
    if (!aHasVisits && bHasVisits) {
      return 1;
    }
    if (aHasVisits && !bHasVisits) {
      return 1;
    }
    return 0;
  }
  if (!a.isManager && b.isManager) {
    return 1;
  }
  if (a.isManager && !b.isManager) {
    return -1;
  }
  return 0;
};

export const sortByHours = (a, b, selectedHourType) => {
  const aVisits = !_.isEmpty(selectedHourType) ? filterVisitsByHourType(a.visits, selectedHourType) : a.visits;
  const bVisits = !_.isEmpty(selectedHourType) ? filterVisitsByHourType(b.visits, selectedHourType) : b.visits;
  const aTotalHours = parseInt(getTotalHours(aVisits), 10);
  const bTotalHours = parseInt(getTotalHours(bVisits), 10);
  return aTotalHours < bTotalHours ? 1 : aTotalHours > bTotalHours ? -1 : 0;
};

export const sortByDate = (a, b) => {
  const aHasVisits = !_.isEmpty(a.visits);
  const bHasVisits = !_.isEmpty(b.visits);
  if (aHasVisits && bHasVisits) {
    const x = _.isEmpty(a.visits) ? 0 : a.visits[0].timeIn;
    const y = _.isEmpty(b.visits) ? 0 : b.visits[0].timeIn;
    return x < y ? 1 : x > y ? -1 : 0;
  }
  if (!aHasVisits && bHasVisits) {
    return 1;
  }
  if (aHasVisits && !bHasVisits) {
    return -1;
  }
  return 0;
};

export const sortByName = (a, b) => {
  const aName = a.firstName.toLowerCase();
  const bName = b.firstName.toLowerCase();
  return aName < bName ? -1 : aName > bName ? 1 : 0;
};
