import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';

export default class PersonalInfoStep extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleChange = (field, validation) => {
    return (e) => {
      const {newUser, onChange} = this.props;
      const {value} = e.target;
      if (validation ? value.match(validation) : true) {
        newUser[field] = value;
        onChange(newUser);
      }
      return value;
    };
  }

  handleFocusDay = (month) => {
    if (month.length === 2) {
      this.refs.day.focus();
    }
  }

  handleFocusYear = (day) => {
    if (day.length === 2) {
      this.refs.year.focus();
    }
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <input
          autoFocus={true}
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.lastName}
          )}
          type="text"
          placeholder="First name"
          value={newUser.firstName}
          onChange={this.handleChange('firstName')} />
        <input
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.lastName}
          )}
          type="text"
          placeholder="Last name"
          value={newUser.lastName}
          onChange={this.handleChange('lastName')} />
        <div className="registration-dob-container">
          <input
            className={classNames(
              'registration-field',
              'registration-dob-month',
              {'registration-field__error': errors.dobMonth})
            }
            type="text"
            placeholder="MM"
            value={newUser.dobMonth}
            onChange={_.flow([
              this.handleChange('dobMonth', /^[0-9]{0,2}$/),
              this.handleFocusDay
            ])} />
          &nbsp;/&nbsp;
          <input
            className={classNames(
              'registration-field',
              'registration-dob-day',
              {'registration-field__error': errors.dobDay})
            }
            type="text"
            placeholder="DD"
            ref="day"
            value={newUser.dobDay}
            onChange={_.flow([
              this.handleChange('dobDay', /^[0-9]{0,2}$/),
              this.handleFocusYear
            ])} />
            &nbsp;/&nbsp;
          <input
            className={classNames(
              'registration-field',
              'registration-dob-year',
              {'registration-field__error': errors.dobYear})
            }
            type="text"
            placeholder="YYYY"
            ref="year"
            value={newUser.dobYear}
            onChange={this.handleChange('dobYear', /^[0-9]{0,4}$/)} />
          <div className="registration-dob-text">Birthdate</div>
        </div>
        <input
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.email}
          )}
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={this.handleChange('email')} />
        <input
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.phone}
          )}
          type="text"
          placeholder="Phone"
          value={newUser.phone}
          onChange={this.handleChange('phone')} />
      </div>
    );
  }
}
