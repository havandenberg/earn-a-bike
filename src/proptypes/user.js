import PropTypes from 'prop-types';

export const visitProps = {
  timeIn: PropTypes.number,
  timeOut: PropTypes.number,
  hours: PropTypes.number,
  notes: PropTypes.string,
  type: PropTypes.string
};

export const userProps = {
  addressCity: PropTypes.string,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressState: PropTypes.string,
  addressZip: PropTypes.string,
  bikesEarned: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      description: PropTypes.string
    })
  ),
  countryOfOrigin: PropTypes.string,
  dobDay: PropTypes.string,
  dobMonth: PropTypes.string,
  dobYear: PropTypes.string,
  email: PropTypes.string,
  emailList: PropTypes.bool,
  firstName: PropTypes.string,
  id: PropTypes.number,
  isActive: PropTypes.bool,
  isInterestedManager: PropTypes.bool,
  isManager: PropTypes.bool,
  lastName: PropTypes.string,
  parentName: PropTypes.string,
  parentPhone: PropTypes.string,
  phone: PropTypes.string,
  pin: PropTypes.string,
  raceEthnicity: PropTypes.arrayOf(
    PropTypes.string,
  ),
  username: PropTypes.string,
  visits: PropTypes.arrayOf(PropTypes.shape(visitProps)),
  waiver: PropTypes.bool
};
