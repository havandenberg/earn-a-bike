import _ from 'lodash';
import {getTotalHours} from 'utils/helpers';

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

export const sortByHours = (a, b) => {
  const aTotalHours = parseInt(getTotalHours(a.visits), 10);
  const bTotalHours = parseInt(getTotalHours(b.visits), 10);
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
  return a.firstName < b.firstName ? -1 : a.firstName > b.firstName ? 1 : 0;
};
