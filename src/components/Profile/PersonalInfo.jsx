import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {messages} from 'utils/messages';
import {isUsernameUnique} from 'utils/helpers';
import Messages from 'components/Messages.jsx';
import checkImg from 'images/check.svg';
import {raceEthnicityOptions} from 'utils/constants';
import {isUnderEighteen, getRaceEthnicityIsChecked, getRaceEthnicityOtherValue} from 'utils/helpers';

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
      raceEthnicity: user.raceEthnicity,
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

  handleRaceEthnicityChange = (optionArg) => (e) => {
    e.preventDefault();

    const {raceEthnicity = []} = this.state;
    let newRaceEthnicity = raceEthnicity;

    const option = optionArg === 'Other' ? getRaceEthnicityOtherValue(raceEthnicity) || '' : optionArg;

    if (raceEthnicity.find(((val) => val === option)) !== undefined) {
      newRaceEthnicity = raceEthnicity.filter(((val) => val !== option));
    } else {
      newRaceEthnicity = raceEthnicity.concat([option]);
    }
    this.setState({raceEthnicity: newRaceEthnicity});
  }

  handleRaceEthnicityOtherChange = (e) => {
    const {raceEthnicity = []} = this.state;
    const newRaceEthnicity = raceEthnicity.filter((val) => val !== getRaceEthnicityOtherValue(raceEthnicity)).concat([e.target.value]);
    this.setState({raceEthnicity: newRaceEthnicity});
  }

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
    const {isManager, user, users} = this.props;
    const errors = {};
    const {
      addressCity,
      addressLine1,
      addressState,
      addressZip,
      confirmNewPin,
      dobDay,
      dobMonth,
      dobYear,
      firstName,
      lastName,
      newPin,
      oldPin,
      oldUsername,
      parentName,
      parentPhone,
      username
    } = this.state;
    const hasPinError = _.isEmpty(newPin) ? false : (isManager ? false : user.pin !== oldPin) || newPin !== confirmNewPin;

    errors.addressLine1 = _.isEmpty(addressLine1);
    errors.addressCity = _.isEmpty(addressCity);
    errors.addressState = _.isEmpty(addressState);
    errors.addressZip = _.isEmpty(addressZip);
    errors.firstName = _.isEmpty(firstName);
    errors.lastName = _.isEmpty(lastName);
    errors.dobMonth = _.isEmpty(dobMonth);
    errors.dobDay = _.isEmpty(dobDay);
    errors.dobYear = _.isEmpty(dobYear);
    errors.parentName = isUnderEighteen({dobDay, dobMonth, dobYear}) ? _.isEmpty(parentName) : false;
    errors.parentPhone = isUnderEighteen({dobDay, dobMonth, dobYear}) ? _.isEmpty(parentPhone) : false;
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
      addressState,
      addressZip,
      confirmNewPin,
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
      raceEthnicity,
      username,
      errors,
      isEditing,
      isManager
    } = this.state;
    const isUnder18 = isUnderEighteen({dobDay, dobMonth, dobYear});
    const other = getRaceEthnicityOtherValue(raceEthnicity);

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
              <div className={classNames(
                'personal-info__label',
                {'personal-info__label-race-editing': isEditing},
                {'personal-info__label-race': !isEditing})}>
                  Race/Ethnicity:
              </div>
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
              {isEditing ? (
                <div>
                  {raceEthnicityOptions.map((option) => (
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
                  )
                  )}
                  <input
                    className={classNames(
                      'registration-field',
                      'registration-field__other-small',
                    )}
                    type="text"
                    value={other}
                    onChange={this.handleRaceEthnicityOtherChange} />
                </div>
              ) : (
                <div className={classNames('personal-info__value', 'personal-info__value-race')}>{(raceEthnicity || []).join(', ')}</div>
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
