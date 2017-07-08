import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {hasError} from 'utils/messages';

export default class PersonalInfoStep extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleFirstNameChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.firstName = e.target.value;
    onChange(newUser);
  }

  handleLastNameChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.lastName = e.target.value;
    onChange(newUser);
  }

  handleMonthChange = (e) => {
    const {newUser, onChange} = this.props;
    const month = e.target.value;
    if (month.match(/^[0-9]{0,2}$/)) {
      newUser.dateOfBirth.month = month;
      onChange(newUser);
      if (month.length === 2) {
        this.refs.day.focus();
      }
    }
  }

  handleDayChange = (e) => {
    const {newUser, onChange} = this.props;
    const day = e.target.value;
    if (day.match(/^[0-9]{0,2}$/)) {
      newUser.dateOfBirth.day = day;
      onChange(newUser);
      if (day.length === 2) {
        this.refs.year.focus();
      }
    }
  }

  handleYearChange = (e) => {
    const {newUser, onChange} = this.props;
    if (e.target.value.match(/^[0-9]{0,4}$/)) {
      newUser.dateOfBirth.year = e.target.value;
      onChange(newUser);
    }
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <input
          autoFocus={true}
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['firstName'])})}
          type="text"
          placeholder="First name"
          value={newUser.firstName}
          onChange={this.handleFirstNameChange} />
        <input
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['lastName'])})}
          type="text"
          placeholder="Last name"
          value={newUser.lastName}
          onChange={this.handleLastNameChange} />
        <div className="registration-dob-container">
          <input
            className={classNames(
              'registration-field',
              'registration-dob-month',
              {'registration-field__error': hasError(errors, ['month'])})
            }
            type="text"
            placeholder="MM"
            value={newUser.dateOfBirth.month}
            onChange={this.handleMonthChange} />
          &nbsp;/&nbsp;
          <input
            className={classNames(
              'registration-field',
              'registration-dob-day',
              {'registration-field__error': hasError(errors, ['day'])})
            }
            type="text"
            placeholder="DD"
            ref="day"
            value={newUser.dateOfBirth.day}
            onChange={this.handleDayChange} />
            &nbsp;/&nbsp;
          <input
            className={classNames(
              'registration-field',
              'registration-dob-year',
              {'registration-field__error': hasError(errors, ['year'])})
            }
            type="text"
            placeholder="YYYY"
            ref="year"
            value={newUser.dateOfBirth.year}
            onChange={this.handleYearChange} />
          <div className="registration-dob-text">Birthdate</div>
        </div>
      </div>
    );
  }
}
