import PropTypes from 'prop-types';

export const bikeProps = {
  date: PropTypes.string,
  description: PropTypes.string,
  checklist: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.bool,
    text: PropTypes.string
  })),
  isSignedOff: PropTypes.bool,
  signedOffBy: PropTypes.string
};
