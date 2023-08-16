import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {registerUser} from 'actions/app';
import {userProps} from 'proptypes/user';
import checkImg from 'images/check.svg';
import {raceEthnicityOptions} from 'utils/constants';
import {history} from 'utils/store';
import {isUsernameUnique, getRaceEthnicityIsChecked, getRaceEthnicityOtherValue} from 'utils/helpers';
import {messages} from 'utils/messages';
import Messages from 'components/Messages.jsx';

class AddManager extends Component {
  static propTypes = {
    registerUser: PropTypes.func,
    users: PropTypes.arrayOf(PropTypes.shape(userProps))
  };

  state = {
    errors: {},
    newManager: {
      addressCity: '',
      addressLine1: '',
      addressState: '',
      addressZip: '',
      confirmPin: '',
      dobDay: '',
      dobMonth: '',
      dobYear: '',
      email: '',
      firstName: '',
      isManager: true,
      lastName: '',
      phone: '',
      pin: '',
      raceEthnicity: [],
      username: '',
      visits: []
    }
  };

  handleChange = (field) => {
    return (e) => {
      const {value} = e.target;
      if (this.validateChange(field, value)) {
        this.setState({newManager: {...this.state.newManager, [field]: value}});
      }
      return value;
    };
  };

  handleRaceEthnicityChange = (optionArg) => (e) => {
    e.preventDefault();

    const {raceEthnicity = []} = this.state.newManager;
    let newRaceEthnicity = raceEthnicity;

    const option = optionArg === 'Other' ? getRaceEthnicityOtherValue(raceEthnicity) || '' : optionArg;

    if (raceEthnicity.find(((val) => val === option)) !== undefined) {
      newRaceEthnicity = raceEthnicity.filter(((val) => val !== option));
    } else {
      newRaceEthnicity = raceEthnicity.concat([option]);
    }

    this.setState({newManager: {...this.state.newManager, raceEthnicity: newRaceEthnicity}});
  }

  handleRaceEthnicityOtherChange = (e) => {
    const {raceEthnicity = []} = this.state.newManager;
    const newRaceEthnicity = raceEthnicity.filter((val) => val !== getRaceEthnicityOtherValue(raceEthnicity)).concat([e.target.value]);
    this.setState({newManager: {...this.state.newManager, raceEthnicity: newRaceEthnicity}});
  }

  handleBack = () => {
    history.goBack();
  };

  handleFocusDay = (month) => {
    if (month.length === 2) {
      this.refs.day.focus();
    }
  };

  handleFocusYear = (day) => {
    if (day.length === 2) {
      this.refs.year.focus();
    }
  };

  handleSubmit = () => {
    if (this.validate()) {
      this.props.registerUser(this.state.newManager);
      history.goBack();
    }
  };

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  };

  validateChange = (field, value) => {
    if (_.includes(['pin', 'confirmPin', 'dobYear'], field)) {
      return value.match(/^[0-9]{0,4}$/);
    }
    if (_.includes(['dobDay', 'dobMonth'], field)) {
      return value.match(/^[0-9]{0,2}$/);
    }
    if (field === 'dobMonth' && value.length === 2) {
      this.refs.day.focus();
    }
    if (field === 'dobDay' && value.length === 2) {
      this.refs.year.focus();
    }
    return true;
  };

  validate = () => {
    const {users} = this.props;
    const {
      addressCity,
      addressLine1,
      addressState,
      addressZip,
      confirmPin,
      dobDay,
      dobMonth,
      dobYear,
      email,
      firstName,
      lastName,
      pin,
      phone,
      username
    } = this.state.newManager;
    const errors = {};
    const hasPinError = pin !== confirmPin;

    errors.addressLine1 = _.isEmpty(addressLine1);
    errors.addressCity = _.isEmpty(addressCity);
    errors.addressState = _.isEmpty(addressState);
    errors.addressZip = _.isEmpty(addressZip);
    errors.firstName = _.isEmpty(firstName);
    errors.lastName = _.isEmpty(lastName);
    errors.dobMonth = _.isEmpty(dobMonth);
    errors.dobDay = _.isEmpty(dobDay);
    errors.dobYear = _.isEmpty(dobYear);
    errors.email = _.isEmpty(email);
    errors.phone = _.isEmpty(phone);
    errors.username = _.isEmpty(username);
    errors.usernameNotUnique = !isUsernameUnique(users, username);
    errors.pin = _.isEmpty(pin) || hasPinError;
    errors.confirmPin = _.isEmpty(confirmPin) || hasPinError;

    this.setState({errors});
    return !_.some(errors, (error) => error);
  };

  render() {
    const {errors, newManager} = this.state;
    const {raceEthnicity} = newManager;
    const other = getRaceEthnicityOtherValue(raceEthnicity);

    return (
      <div className="add-manager">
        <div className="add-manager__title">Add Manager</div>
        <div className="add-manager__fields-container">
          <div className="add-manager__fields">
            <Messages messages={errors.usernameNotUnique ? [messages.usernameAlreadyExists] : []} />
            <input
              autoFocus={true}
              className={classNames('add-manager-field', {'add-manager-field__error': errors.firstName})}
              type="text"
              placeholder="First name"
              value={newManager.firstName}
              onChange={this.handleChange('firstName')}/>
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': errors.lastName})}
              type="text"
              placeholder="Last name"
              value={newManager.lastName}
              onChange={this.handleChange('lastName')}/>
            <div className="add-manager-dob-container">
              <input
                className={classNames('add-manager-field', 'add-manager-dob-month', {'add-manager-field__error': errors.dobMonth})}
                type="text"
                placeholder="MM"
                value={newManager.dobMonth}
                onChange={_.flow([this.handleChange('dobMonth'), this.handleFocusDay])}/>
              &nbsp;/&nbsp;
              <input
                className={classNames('add-manager-field', 'add-manager-dob-day', {'add-manager-field__error': errors.dobDay})}
                type="text"
                placeholder="DD"
                value={newManager.dobDay}
                ref="day"
                onChange={_.flow([this.handleChange('dobDay'), this.handleFocusYear])}/>
              &nbsp;/&nbsp;
              <input
                className={classNames('add-manager-field', 'add-manager-dob-year', {'add-manager-field__error': errors.dobYear})}
                type="text"
                placeholder="YYYY"
                value={newManager.dobYear}
                ref="year"
                onChange={this.handleChange('dobYear')}/>
              <div className="add-manager-dob-text">Birthdate</div>
            </div>
            <div className="add-manager__race-ethnicity-text">Race / Ethnicity:</div>
            <div className="add-manager__race-ethnicity">
              <div>
                {raceEthnicityOptions.slice(0, raceEthnicityOptions.length / 2).map((option) => (
                  <div className="registration-checkbox-small" key={option}>
                    <button
                      className="checkbox"
                      onClick={this.handleRaceEthnicityChange(option)}>
                      {getRaceEthnicityIsChecked(raceEthnicity, option) && <img alt="Check" src={checkImg} />}
                    </button>
                    <button
                      className="registration-checkbox__text"
                      onClick={this.handleRaceEthnicityChange(option)}>
                      {option}
                    </button>
                  </div>
                ))}
              </div>
              <div>
                {raceEthnicityOptions.slice(raceEthnicityOptions.length / 2, raceEthnicityOptions.length).map((option) => (
                  <div className="registration-checkbox-small" key={option}>
                    <button
                      className="checkbox"
                      onClick={this.handleRaceEthnicityChange(option)}>
                      {getRaceEthnicityIsChecked(raceEthnicity, option) && <img alt="Check" src={checkImg} />}
                    </button>
                    <button
                      className="registration-checkbox__text"
                      onClick={this.handleRaceEthnicityChange(option)}>
                      {option}
                    </button>
                  </div>
                ))}
                {other !== undefined
                  ? <input
                    className={classNames(
                      'registration-field',
                      'registration-field__other-small',
                    )}
                    type="text"
                    value={other}
                    onChange={this.handleRaceEthnicityOtherChange} />
                  : <div className="registration-field__other-placeholder" />}
              </div>
            </div>
          </div>
          <div className="add-manager__fields scroll">
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': errors.username})}
              type="text"
              placeholder="Username"
              value={newManager.username}
              onChange={this.handleChange('username')}/>
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': errors.pin})}
              type="password"
              placeholder="4 digit pin"
              value={newManager.pin}
              onChange={this.handleChange('pin')}/>
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': errors.confirmPin})}
              type="password"
              placeholder="Confirm pin"
              value={newManager.confirmPin}
              onChange={this.handleChange('confirmPin')}/>
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': errors.email})}
              type="text"
              placeholder="Email"
              value={newManager.email}
              onChange={this.handleChange('email')}/>
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': errors.phone})}
              type="text"
              placeholder="Phone"
              value={newManager.phone}
              onChange={this.handleChange('phone')}/>
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': errors.addressLine1})}
              type="text"
              placeholder="Address line 1"
              value={newManager.addressLine1}
              onChange={this.handleChange('addressLine1')}/>
            <div className="add-manager-address-container">
              <input
                className={classNames('add-manager-field', 'add-manager-address-city', {'add-manager-field__error': errors.addressCity})}
                type="text"
                placeholder="City"
                value={newManager.addressCity}
                onChange={this.handleChange('addressCity')}/>
              <input
                className={classNames('add-manager-field', 'add-manager-address-state', {'add-manager-field__error': errors.addressState})}
                type="text"
                placeholder="State"
                value={newManager.addressState}
                onChange={this.handleChange('addressState')}/>
              <input
                className={classNames('add-manager-field', 'add-manager-address-zip', {'add-manager-field__error': errors.addressZip})}
                type="text"
                placeholder="Zip code"
                value={newManager.addressZip}
                onChange={this.handleChange('addressZip')}/>
            </div>
          </div>
        </div>
        <div className="add-manager__btn-container">
          <button className="add-manager__btn" onClick={this.handleBack}>
            Cancel
          </button>
          <button className="add-manager__btn" onClick={this.handleSubmit}>
            Add
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({app}) => ({
  users: app.get('users').toJS()
});

const mapDispatchToProps = {
  registerUser
};

export default connect(mapStateToProps, mapDispatchToProps)(AddManager);
