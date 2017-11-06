import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {messages} from 'utils/messages';
import {isUsernameUnique} from 'utils/helpers';
import Messages from 'components/Messages.jsx';

export default class PersonalInfo extends Component {
  static propTypes = {
    isManager: PropTypes.bool,
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps),
    users: PropTypes.arrayOf(PropTypes.shape(userProps))
  };

  constructor(props) {
    super(props);
    const {user} = props;

    this.state = {
      addressCity: user.addressCity,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      addressState: user.addressState,
      addressZip: user.addressZip,
      bikesEarned: user.bikesEarned,
      confirmNewPin: '',
      countryOfOrigin: user.countryOfOrigin,
      dobDay: user.dobDay,
      dobMonth: user.dobMonth,
      dobYear: user.dobYear,
      email: user.email,
      emailList: user.emailList,
      errors: {},
      firstName: user.firstName,
      isEditing: false,
      lastName: user.lastName,
      newPin: '',
      oldPin: '',
      oldUsername: user.username,
      parentName: user.parentName,
      parentPhone: user.parentPhone,
      phone: user.phone,
      pin: user.pin,
      username: user.username
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.id !== this.props.user.id) {
      const selectedUser = {};
      _.each(Object.keys(_.omit(this.state, ['confirmNewPin', 'errors', 'newPin', 'oldPin'])), (key) => {
        selectedUser[key] = nextProps.user[key];
      });
      selectedUser.oldUsername = nextProps.user.username;
      this.setState({...selectedUser, newPin: '', oldPin: '', confirmNewPin: '', isEditing: false, errors: {}});
    }
  }

  handleChange = (field, validation) => {
    return (e) => {
      const {value} = e.target;
      if (validation ? value.match(validation) : true) {
        this.setState({[field]: value});
      }
      return value;
    };
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.toggleEditing();
  };

  getUpdatedUser = (isSave) => {
    const {confirmNewPin, newPin, oldPin} = this.state;
    const updatedUser = _.omit(this.state, ['confirmNewPin', 'errors', 'newPin', 'oldPin']);

    if (isSave) {
      if (!_.isEmpty(newPin)) {
        updatedUser.pin = newPin;
      }
    } else {
      updatedUser.oldPin = oldPin;
      updatedUser.newPin = newPin;
      updatedUser.confirmNewPin = confirmNewPin;
    }

    return {...this.props.user, ...updatedUser};
  };

  toggleEditing = () => {
    const {isEditing} = this.state;

    if (isEditing) {
      if (this.validate()) {
        this.props.updateUser(this.getUpdatedUser(true));
        this.setState({isEditing: false, oldPin: '', newPin: '', confirmNewPin: ''});
      }
    } else {
      this.setState({isEditing: true});
    }
  };

  validate = () => {
    const {user, users} = this.props;
    const errors = {};
    const {
      addressCity,
      addressLine1,
      addressState,
      addressZip,
      confirmNewPin,
      countryOfOrigin,
      dobDay,
      dobMonth,
      dobYear,
      email,
      firstName,
      lastName,
      newPin,
      oldPin,
      oldUsername,
      parentName,
      parentPhone,
      phone,
      username
    } = this.state;
    const hasPinError = _.isEmpty(newPin) ? false : (user.isManager ? false : user.pin !== oldPin) || newPin !== confirmNewPin;

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
    errors.parentName = _.isEmpty(user.parentName) ? false : _.isEmpty(parentName);
    errors.parentPhone = _.isEmpty(user.parentName) ? false : _.isEmpty(parentPhone);
    errors.phone = _.isEmpty(phone);
    errors.username = _.isEmpty(username);
    errors.usernameNotUnique = username !== oldUsername && !isUsernameUnique(users, username);
    errors.oldPin = hasPinError;
    errors.newPin = hasPinError;
    errors.confirmNewPin = hasPinError;

    this.setState({errors});
    return !_.some(errors, (error) => error);
  };

  render() {
    const {
      addressCity,
      addressLine1,
      addressLine2,
      addressState,
      addressZip,
      confirmNewPin,
      countryOfOrigin,
      dobDay,
      dobMonth,
      dobYear,
      email,
      firstName,
      lastName,
      newPin,
      oldPin,
      parentName,
      parentPhone,
      phone,
      username,
      errors,
      isEditing,
      isManager
    } = this.state;
    const isUnder18 = moment().diff(`${dobMonth}-${dobDay}-${dobYear}`, 'years') < 18;

    return (
      <form className="personal-info__outer" onSubmit={this.handleSubmit}>
        <div className="personal-info scroll">
          <div className="personal-info__messages">
            <Messages messages={errors.usernameNotUnique ? [messages.usernameAlreadyExists] : []} />
          </div>
          <div className="personal-info__container">
            <div className="personal-info__labels">
              <div className="personal-info__label">Name:</div>
              <div className="personal-info__label">Date Of Birth:</div>
              <div className="personal-info__label">Username:</div>
              <div className="personal-info__label">Email:</div>
              <div className="personal-info__label">Phone:</div>
              {isUnder18 && (
                <div className="personal-info__spacing">
                  <div className="personal-info__label">Parent's Name:</div>
                  <div className="personal-info__label">Parent's Phone:</div>
                </div>
              )}
              <div className="personal-info__spacing">
                <div className="personal-info__label">Address:</div>
              </div>
              {isEditing && (
                <div className="personal-info__spacing-pin">
                  {!isManager && <div className="personal-info__label">Old Pin:</div>}
                  <div className="personal-info__label">New Pin:</div>
                  <div className="personal-info__label">Confirm New Pin:</div>
                </div>
              )}
            </div>
            <div className="personal-info__values">
              <div className="personal-info__value">
                {isEditing ? (
                  <div className="personal-info__input-container">
                    <input
                      type="text"
                      className={classNames('personal-info__input', 'personal-info__input-first', {
                        'personal-info__input-error': errors.firstName
                      })}
                      onChange={this.handleChange('firstName')}
                      value={firstName}/>
                    <input
                      type="text"
                      className={classNames('personal-info__input', 'personal-info__input-last', {
                        'personal-info__input-error': errors.lastName
                      })}
                      onChange={this.handleChange('lastName')}
                      value={lastName}/>
                  </div>
                ) : (
                  <div>{`${firstName} ${lastName}`}</div>
                )}
              </div>
              <div className="personal-info__value">
                {isEditing ? (
                  <div className="personal-info__input-container">
                    <input
                      type="text"
                      className={classNames('personal-info__input', 'personal-info__input-month', {
                        'personal-info__input-error': errors.dobMonth
                      })}
                      onChange={this.handleChange('dobMonth', /^[0-9]{0,2}$/)}
                      value={dobMonth}/>
                    &nbsp;/&nbsp;
                    <input
                      type="text"
                      className={classNames('personal-info__input', 'personal-info__input-day', {
                        'personal-info__input-error': errors.dobDay
                      })}
                      onChange={this.handleChange('dobDay', /^[0-9]{0,2}$/)}
                      value={dobDay}/>
                    &nbsp;/&nbsp;
                    <input
                      type="text"
                      className={classNames('personal-info__input', 'personal-info__input-year', {
                        'personal-info__input-error': errors.dobYear
                      })}
                      onChange={this.handleChange('dobYear', /^[0-9]{0,4}$/)}
                      value={dobYear}/>
                  </div>
                ) : (
                  <div>{`${dobMonth}/${dobDay}/${dobYear}`}</div>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  className={classNames('personal-info__input', {
                    'personal-info__input-error': errors.username || errors.usernameNotUnique
                  })}
                  onChange={this.handleChange('username')}
                  value={username}/>
              ) : (
                <div className="personal-info__value">{username}</div>
              )}
              {isEditing ? (
                <input
                  type="text"
                  className={classNames('personal-info__input', {'personal-info__input-error': errors.email})}
                  onChange={this.handleChange('email')}
                  value={email}/>
              ) : (
                <div className="personal-info__value">{email}</div>
              )}
              {isEditing ? (
                <input
                  type="text"
                  className={classNames('personal-info__input', {'personal-info__input-error': errors.phone})}
                  onChange={this.handleChange('phone')}
                  value={phone}/>
              ) : (
                <div className="personal-info__value">{phone}</div>
              )}
              {isUnder18 && (
                <div className="personal-info__spacing">
                  {isEditing ? (
                    <input
                      type="text"
                      className={classNames('personal-info__input', {'personal-info__input-error': errors.parentName})}
                      onChange={this.handleChange('parentName')}
                      value={parentName}/>
                  ) : (
                    <div className="personal-info__value">{parentName}</div>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      className={classNames('personal-info__input', {'personal-info__input-error': errors.parentPhone})}
                      onChange={this.handleChange('parentPhone')}
                      value={parentPhone}/>
                  ) : (
                    <div className="personal-info__value">{parentPhone}</div>
                  )}
                </div>
              )}
              <div className="personal-info__spacing">
                {isEditing ? (
                  <input
                    type="text"
                    className={classNames('personal-info__input', {'personal-info__input-error': errors.addressLine1})}
                    onChange={this.handleChange('addressLine1')}
                    value={addressLine1}/>
                ) : (
                  <div className="personal-info__value">{addressLine1}</div>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    className={classNames('personal-info__input', {'personal-info__input-error': errors.addressLine2})}
                    onChange={this.handleChange('addressLine2')}
                    value={addressLine2}/>
                ) : (
                  <div>{!_.isEmpty(addressLine2) && <div className="personal-info__value">{addressLine2}</div>}</div>
                )}
                <div className="personal-info__value">
                  {isEditing ? (
                    <div className="personal-info__input-container">
                      <input
                        type="text"
                        className={classNames('personal-info__input', 'personal-info__input-city', {
                          'personal-info__input-error': errors.addressCity
                        })}
                        onChange={this.handleChange('addressCity')}
                        value={addressCity}/>
                      ,&nbsp;
                      <input
                        type="text"
                        className={classNames('personal-info__input', 'personal-info__input-state', {
                          'personal-info__input-error': errors.addressState
                        })}
                        onChange={this.handleChange('addressState')}
                        value={addressState}/>
                      &nbsp;
                      <input
                        type="text"
                        className={classNames('personal-info__input', 'personal-info__input-zip', {
                          'personal-info__input-error': errors.addressZip
                        })}
                        onChange={this.handleChange('addressZip')}
                        value={addressZip}/>
                    </div>
                  ) : (
                    <div>{`${addressCity}, ${addressState} ${addressZip}`}</div>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    className={classNames('personal-info__input', {'personal-info__input-error': errors.countryOfOrigin})}
                    onChange={this.handleChange('countryOfOrigin')}
                    value={countryOfOrigin}/>
                ) : (
                  <div>{!_.isEmpty(countryOfOrigin) && <div className="personal-info__value">{countryOfOrigin}</div>}</div>
                )}
                <div className="personal-info__spacing">
                  {isEditing &&
                    !isManager && (
                      <input
                        type="password"
                        className={classNames('personal-info__input', 'personal-info__input-pin', 'personal-info__input-pin-space', {
                          'personal-info__input-error': errors.oldPin
                        })}
                        onChange={this.handleChange('oldPin', /^[0-9]{0,4}$/)}
                        value={oldPin}/>
                    )}
                  {isEditing && (
                    <input
                      type="password"
                      className={classNames(
                        'personal-info__input',
                        'personal-info__input-pin',
                        {'personal-info__input-pin-space': isManager},
                        {'personal-info__input-error': errors.newPin || errors.confirmNewPin},
                      )}
                      onChange={this.handleChange('newPin', /^[0-9]{0,4}$/)}
                      value={newPin}/>
                  )}
                  {isEditing && (
                    <input
                      type="password"
                      className={classNames('personal-info__input', 'personal-info__input-pin', {
                        'personal-info__input-error': errors.newPin || errors.confirmNewPin
                      })}
                      onChange={this.handleChange('confirmNewPin', /^[0-9]{0,4}$/)}
                      value={confirmNewPin}/>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="personal-info__edit btn-action" type="submit">
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </form>
    );
  }
}
