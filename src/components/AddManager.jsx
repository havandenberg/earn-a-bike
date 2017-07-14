import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {registerUser} from 'actions/app';
import {hasError} from 'utils/messages';
import {history} from 'utils/store';

class AddManager extends Component {
  static propTypes = {
    registerUser: PropTypes.func
  }

  state = {
    errors: [],
    newManager: {
      firstName: '',
      lastName: '',
      month: '',
      day: '',
      year: '',
      email: '',
      phone: '',
      streetLine1: '',
      streetLine2: '',
      city: '',
      state: '',
      zip: '',
      pin: '',
      confirmPin: '',
      isManager: true
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
      this.props.registerUser(this.formatUser());
      history.goBack();
    }
  }

  formatUser = () => {
    const {newManager} = this.state;
    const formattedManager = {};

    _.each(['firstName', 'lastName', 'email', 'phone', 'isManager'], (key) => {
      formattedManager[key] = newManager[key];
    });

    formattedManager.dateOfBirth = {
      month: newManager.month,
      day: newManager.day,
      year: newManager.year
    };

    formattedManager.address = {
      streetLine1: newManager.streetLine1,
      streetLine2: newManager.streetLine2,
      city: newManager.city,
      state: newManager.state,
      zip: newManager.zip
    };

    formattedManager.pin = newManager.pin;

    return formattedManager;
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  }

  validateChange = (field, value) => {
    if (field === 'month' && value.length === 2) {
      this.refs.day.focus();
    }
    if (field === 'day' && value.length === 2) {
      this.refs.year.focus();
    }
    if (_.includes(['pin', 'confirmPin', 'year'], field)) {
      return value.match(/^[0-9]{0,4}$/);
    }
    if (_.includes(['day', 'month'], field)) {
      return value.match(/^[0-9]{0,2}$/);
    }
    return true;
  }

  validate = () => {
    const {newManager} = this.state;
    const errors = [];

    if (_.isEmpty(newManager.firstName)) {
      errors.push('firstName');
    }
    if (_.isEmpty(newManager.lastName)) {
      errors.push('lastName');
    }
    if (_.isEmpty(newManager.month)) {
      errors.push('month');
    }
    if (_.isEmpty(newManager.day)) {
      errors.push('day');
    }
    if (_.isEmpty(newManager.year)) {
      errors.push('year');
    }
    if (_.isEmpty(newManager.email)) {
      errors.push('email');
    }
    if (_.isEmpty(newManager.phone)) {
      errors.push('phone');
    }
    if (_.isEmpty(newManager.pin) || _.isEmpty(newManager.confirmPin)) {
      errors.push('pin');
      errors.push('confirmPin');
    }
    if (!_.isEmpty(newManager.pin) && newManager.pin !== newManager.confirmPin) {
      errors.push('pin');
      errors.push('confirmPin');
    }
    if (_.isEmpty(newManager.streetLine1)) {
      errors.push('streetLine1');
    }
    if (_.isEmpty(newManager.city)) {
      errors.push('city');
    }
    if (_.isEmpty(newManager.state)) {
      errors.push('state');
    }
    if (_.isEmpty(newManager.zip)) {
      errors.push('zip');
    }

    this.setState({errors});
    return !errors.length;
  }

  render() {
    const {errors, newManager} = this.state;

    return (
      <div className="add-manager">
        <div className="add-manager__title">Add Manager</div>
        <div className="add-manager__fields-container">
          <div className="add-manager__fields">
            <input
              autoFocus={true}
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['firstName'])})}
              type="text"
              placeholder="First name"
              value={newManager.firstName}
              onChange={this.handleChange('firstName')} />
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['lastName'])})}
              type="text"
              placeholder="Last name"
              value={newManager.lastName}
              onChange={this.handleChange('lastName')} />
            <div className="add-manager-dob-container">
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-dob-month',
                  {'add-manager-field__error': hasError(errors, ['month'])})
                }
                type="text"
                placeholder="MM"
                value={newManager.month}
                onChange={this.handleChange('month')} />
              &nbsp;/&nbsp;
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-dob-day',
                  {'add-manager-field__error': hasError(errors, ['day'])})
                }
                type="text"
                placeholder="DD"
                value={newManager.day}
                ref="day"
                onChange={this.handleChange('day')} />
                &nbsp;/&nbsp;
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-dob-year',
                  {'add-manager-field__error': hasError(errors, ['year'])})
                }
                type="text"
                placeholder="YYYY"
                value={newManager.year}
                ref="year"
                onChange={this.handleChange('year')} />
              <div className="add-manager-dob-text">Birthdate</div>
            </div>
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['pin'])})}
              type="password"
              placeholder="4 digit pin"
              value={newManager.pin}
              onChange={this.handleChange('pin')} />
            <input
              className={classNames(
                'add-manager-field',
                {'add-manager-field__error': hasError(errors, ['confirmPin'])})}
              type="password"
              placeholder="Confirm pin"
              value={newManager.confirmPin}
              onChange={this.handleChange('confirmPin')} />
          </div>
          <div className="add-manager__fields">
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['email'])})}
              type="text"
              placeholder="Email"
              value={newManager.email}
              onChange={this.handleChange('email')} />
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['phone'])})}
              type="text"
              placeholder="Phone"
              value={newManager.phone}
              onChange={this.handleChange('phone')} />
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['streetLine1'])})}
              type="text"
              placeholder="Address line 1"
              value={newManager.streetLine1}
              onChange={this.handleChange('streetLine1')} />
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['streetLine2'])})}
              type="text"
              placeholder="Address line 2"
              value={newManager.streetLine2}
              onChange={this.handleChange('streetLine2')} />
            <input
              className={classNames('add-manager-field', {'add-manager-field__error': hasError(errors, ['city'])})}
              type="text"
              placeholder="City"
              value={newManager.city}
              onChange={this.handleChange('city')} />
            <div className="add-manager-address-container">
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-address-state',
                  {'add-manager-field__error': hasError(errors, ['state'])})
                }
                type="text"
                placeholder="State"
                value={newManager.state}
                onChange={this.handleChange('state')} />
              <input
                className={classNames(
                  'add-manager-field',
                  'add-manager-address-zip',
                  {'add-manager-field__error': hasError(errors, ['zip'])})
                }
                type="text"
                placeholder="Zip code"
                value={newManager.zip}
                onChange={this.handleChange('zip')} />
            </div>
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

export default connect(null, {
  registerUser
})(AddManager);
