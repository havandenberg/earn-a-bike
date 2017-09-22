import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {registerUser} from 'actions/app';
import {userProps} from 'proptypes/user';
import {history} from 'utils/store';
import {isUsernameUnique} from 'utils/helpers';
import {messages} from 'utils/messages';
import Messages from 'components/Messages.jsx';

class AddManager extends Component {
  static propTypes = {
    registerUser: PropTypes.func,
    users: PropTypes.arrayOf(PropTypes.shape(userProps))
  }

  state = {
    errors: {},
    newManager: {
      addressCity: '',
      addressLine1: '',
      addressLine2: '',
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
      username: '',
      visits: []
    }
  };

  handleChange = (field) => {
    return (e) => {
      if (this.validateChange(field, e.target.value)) {
        this.setState({newManager: {...this.state.newManager, [field]: e.target.value}});
      }
    };
  }

  handleBack = () => {
    history.goBack();
  }

  handleSubmit = () => {
    if (this.validate()) {
      this.props.registerUser(this.state.newManager);
      history.goBack();
    }
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  }

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
  }

  validate = () => {
    const {users} = this.props;
    const {
      addressCity,
      addressLine1,
      addressState,
      addressZip,
      confirmPin,
      countryOfOrigin,
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
    errors.countryOfOrigin = _.isEmpty(countryOfOrigin);
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
  }

  render() {
    const {errors, newManager} = this.state;

    return (
      <div className="add-manager">
        <div className="add-manager__title">Add Manager</div>
        <div className="add-manager__fields-container">
          <div className="add-manager__fields">
            <Messages messages={errors.usernameNotUnique ? [messages.usernameAlreadyExists] : []} />
            <input
              autoFocus={true}
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.firstName}
              )}
              type="text"
              placeholder="First name"
              value={newManager.firstName}
              onChange={this.handleChange('firstName')} />
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.lastName}
              )}
              type="text"
              placeholder="Last name"
              value={newManager.lastName}
              onChange={this.handleChange('lastName')} />
            <div className="add-manager-dob-container">
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-dob-month',
                  {'add-manager-field__error': errors.dobMonth}
                )}
                type="text"
                placeholder="MM"
                value={newManager.dobMonth}
                onChange={this.handleChange('dobMonth')} />
              &nbsp;/&nbsp;
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-dob-day',
                  {'add-manager-field__error': errors.dobDay}
                )}
                type="text"
                placeholder="DD"
                value={newManager.dobDay}
                ref="day"
                onChange={this.handleChange('dobDay')} />
                &nbsp;/&nbsp;
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-dob-year',
                  {'add-manager-field__error': errors.dobYear}
                )}
                type="text"
                placeholder="YYYY"
                value={newManager.dobYear}
                ref="year"
                onChange={this.handleChange('dobYear')} />
              <div className="add-manager-dob-text">Birthdate</div>
            </div>
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.username}
              )}
              type="text"
              placeholder="Username"
              value={newManager.username}
              onChange={this.handleChange('username')} />
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.pin}
              )}
              type="password"
              placeholder="4 digit pin"
              value={newManager.pin}
              onChange={this.handleChange('pin')} />
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.confirmPin}
              )}
              type="password"
              placeholder="Confirm pin"
              value={newManager.confirmPin}
              onChange={this.handleChange('confirmPin')} />
          </div>
          <div className="add-manager__fields scroll">
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.email}
              )}
              type="text"
              placeholder="Email"
              value={newManager.email}
              onChange={this.handleChange('email')} />
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.phone}
              )}
              type="text"
              placeholder="Phone"
              value={newManager.phone}
              onChange={this.handleChange('phone')} />
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.addressLine1}
              )}
              type="text"
              placeholder="Address line 1"
              value={newManager.addressLine1}
              onChange={this.handleChange('addressLine1')} />
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.addressLine2}
              )}
              type="text"
              placeholder="Address line 2"
              value={newManager.addressLine2}
              onChange={this.handleChange('addressLine2')} />
            <div className="add-manager-address-container">
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-address-city',
                  {'add-manager-field__error': errors.addressCity}
                )}
                type="text"
                placeholder="City"
                value={newManager.addressCity}
                onChange={this.handleChange('addressCity')} />
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-address-state',
                  {'add-manager-field__error': errors.addressState}
                )}
                type="text"
                placeholder="State"
                value={newManager.addressState}
                onChange={this.handleChange('addressState')} />
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-address-zip',
                  {'add-manager-field__error': errors.addressZip}
                )}
                type="text"
                placeholder="Zip code"
                value={newManager.addressZip}
                onChange={this.handleChange('addressZip')} />
            </div>
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': errors.countryOfOrigin}
              )}
              type="text"
              placeholder="Country of origin"
              value={newManager.countryOfOrigin}
              onChange={this.handleChange('countryOfOrigin')} />
          </div>
        </div>
        <div className="add-manager__btn-container">
          <button
            className="add-manager__btn"
            onClick={this.handleBack}>
            Cancel
          </button>
          <button
            className="add-manager__btn"
            onClick={this.handleSubmit}>
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
