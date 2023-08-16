import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import checkImg from 'images/check.svg';
import {raceEthnicityOptions} from 'utils/constants';
import {getRaceEthnicityIsChecked, getRaceEthnicityOtherValue} from 'utils/helpers';

export default class RaceEthnicityStep extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleChange = (optionArg) => {
    return () => {
      const {newUser, onChange} = this.props;

      const option = optionArg === 'Other' ? getRaceEthnicityOtherValue(newUser.raceEthnicity) || '' : optionArg;

      if (newUser.raceEthnicity.find(((val) => val === option)) !== undefined) {
        newUser.raceEthnicity = newUser.raceEthnicity.filter(((val) => val !== option));
      } else {
        newUser.raceEthnicity = newUser.raceEthnicity.concat([option]);
      }

      onChange(newUser);
    };
  }

  handleOtherChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.raceEthnicity = newUser.raceEthnicity
      .filter((val) => val !== getRaceEthnicityOtherValue(newUser.raceEthnicity))
      .concat([e.target.value]);
    onChange(newUser);
  }

  render() {
    const {newUser: {raceEthnicity}} = this.props;
    const other = getRaceEthnicityOtherValue(raceEthnicity);

    return (
      <div className="registration-step">
        <div className="registration-question">
          If you are willing to identify your race, please answer below:
        </div>
        {raceEthnicityOptions.map((option) => (
          <div className="registration-checkbox-small" key={option}>
            <button
              className="checkbox"
              onClick={this.handleChange(option)}>
              {getRaceEthnicityIsChecked(raceEthnicity, option) && <img alt="Check" src={checkImg} />}
            </button>
            <button
              className="registration-checkbox__text"
              onClick={this.handleChange(option)}>
              {option}
            </button>
          </div>
        )
        )}
        {other !== undefined
          ? <input
            autoFocus={true}
            className={classNames(
              'registration-field',
              'registration-field__other',
            )}
            type="text"
            value={other}
            onChange={this.handleOtherChange} />
          : <div className="registration-field__other-placeholder" />
        }
      </div>
    );
  }
}
