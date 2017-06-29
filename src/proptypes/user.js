import PropTypes from 'prop-types';

export const visitProps = {
  timeIn: PropTypes.number,
  timeOut: PropTypes.number,
  hours: PropTypes.number,
  notes: PropTypes.string
};

export const userProps = {
  address: PropTypes.shape({
    city: PropTypes.string,
    state: PropTypes.string,
    streetLine1: PropTypes.string,
    streetLine2: PropTypes.string,
    zip: PropTypes.string
  }),
  dateOfBirth: PropTypes.shape({
    day: PropTypes.string,
    month: PropTypes.string,
    year: PropTypes.string
  }),
  email: PropTypes.string,
  firstName: PropTypes.string,
  id: PropTypes.number,
  isActive: PropTypes.bool,
  isManager: PropTypes.bool,
  lastName: PropTypes.string,
  parentName: PropTypes.string,
  parentPhone: PropTypes.string,
  pin: PropTypes.string,
  phone: PropTypes.string,
  visits: PropTypes.arrayOf(PropTypes.shape(visitProps))
};
