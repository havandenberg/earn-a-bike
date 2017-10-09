import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {updateUser} from 'actions/app';
import {userProps} from 'proptypes/user';
import {messages} from 'utils/messages';
import Messages from 'components/Messages.jsx';

class PersonalInfo extends Component {
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.bool),
    isEditing: PropTypes.bool,
    isManager: PropTypes.bool,
    user: PropTypes.shape(userProps),
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
  }

  handleChange = (field, validation) => {
    return (e) => {
      const {value} = e.target;
      if (validation ? value.match(validation) : true) {
        this.props.onChange(field, value);
      }
      return value;
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
    const {errors, isEditing, isManager, user} = this.props;
    const isUnder18 = moment().diff(`${user.dobMonth}-${user.dobDay}-${user.dobYear}`, 'years') < 18;

    return (
      <form className="personal-info scroll" onSubmit={this.handleSubmit}>
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
            {isUnder18 &&
              <div className="personal-info__spacing">
                <div className="personal-info__label">Parent's Name:</div>
                <div className="personal-info__label">Parent's Phone:</div>
              </div>
            }
            <div className="personal-info__spacing">
              <div className="personal-info__label">Address:</div>
            </div>
            {isEditing &&
              <div className="personal-info__spacing-pin">
                {!isManager && <div className="personal-info__label">Old Pin:</div>}
                <div className="personal-info__label">New Pin:</div>
                <div className="personal-info__label">Confirm New Pin:</div>
              </div>
            }
          </div>
          <div className="personal-info__values">
            <div className="personal-info__value">
              {isEditing
                ? <div className="personal-info__input-container">
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-first',
                      {'personal-info__input-error': errors.firstName}
                    )}
                    onChange={this.handleChange('firstName')}
                    value={user.firstName} />
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-last',
                      {'personal-info__input-error': errors.lastName}
                    )}
                    onChange={this.handleChange('lastName')}
                    value={user.lastName} />
                </div>
                : <div>{`${user.firstName} ${user.lastName}`}</div>
              }
            </div>
            <div className="personal-info__value">
              {isEditing
                ? <div className="personal-info__input-container">
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-month',
                      {'personal-info__input-error': errors.dobMonth}
                    )}
                    onChange={this.handleChange('dobMonth', /^[0-9]{0,2}$/)}
                    value={user.dobMonth} />
                  &nbsp;/&nbsp;
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-day',
                      {'personal-info__input-error': errors.dobDay}
                    )}
                    onChange={this.handleChange('dobDay', /^[0-9]{0,2}$/)}
                    value={user.dobDay} />
                  &nbsp;/&nbsp;
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-year',
                      {'personal-info__input-error': errors.dobYear}
                    )}
                    onChange={this.handleChange('dobYear', /^[0-9]{0,4}$/)}
                    value={user.dobYear} />
                </div>
                : <div>
                  {`${user.dobMonth}/${user.dobDay}/${user.dobYear}`}
                </div>
              }
            </div>
            {isEditing
              ? <input
                type="text"
                className={classNames(
                  'personal-info__input',
                  {'personal-info__input-error': errors.username || errors.usernameNotUnique}
                )}
                onChange={this.handleChange('username')}
                value={user.username} />
              : <div className="personal-info__value">{user.username}</div>
            }
            {isEditing
              ? <input
                type="text"
                className={classNames(
                  'personal-info__input',
                  {'personal-info__input-error': errors.email}
                )}
                onChange={this.handleChange('email')}
                value={user.email} />
              : <div className="personal-info__value">{user.email}</div>
            }
            {isEditing
              ? <input
                type="text"
                className={classNames(
                  'personal-info__input',
                  {'personal-info__input-error': errors.phone}
                )}
                onChange={this.handleChange('phone')}
                value={user.phone} />
              : <div className="personal-info__value">{user.phone}</div>
            }
            {isUnder18 &&
              <div className="personal-info__spacing">
                {isEditing
                  ? <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      {'personal-info__input-error': errors.parentName}
                    )}
                    onChange={this.handleChange('parentName')}
                    value={user.parentName} />
                  : <div className="personal-info__value">{user.parentName}</div>
                }
                {isEditing
                  ? <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      {'personal-info__input-error': errors.parentPhone}
                    )}
                    onChange={this.handleChange('parentPhone')}
                    value={user.parentPhone} />
                  : <div className="personal-info__value">{user.parentPhone}</div>
                }
              </div>
            }
            <div className="personal-info__spacing">
              {isEditing
                ? <input
                  type="text"
                  className={classNames(
                    'personal-info__input',
                    {'personal-info__input-error': errors.addressLine1}
                  )}
                  onChange={this.handleChange('addressLine1')}
                  value={user.addressLine1} />
                : <div className="personal-info__value">{user.addressLine1}</div>
              }
              {isEditing
                ? <input
                  type="text"
                  className={classNames(
                    'personal-info__input',
                    {'personal-info__input-error': errors.addressLine2}
                  )}
                  onChange={this.handleChange('addressLine2')}
                  value={user.addressLine2} />
                : <div>
                  {!_.isEmpty(user.addressLine2) &&
                    <div className="personal-info__value">{user.addressLine2}</div>
                  }
                </div>
              }
              <div className="personal-info__value">
                {isEditing
                  ? <div className="personal-info__input-container">
                    <input
                      type="text"
                      className={classNames(
                        'personal-info__input',
                        'personal-info__input-city',
                        {'personal-info__input-error': errors.addressCity}
                      )}
                      onChange={this.handleChange('addressCity')}
                      value={user.addressCity} />
                    ,&nbsp;
                    <input
                      type="text"
                      className={classNames(
                        'personal-info__input',
                        'personal-info__input-state',
                        {'personal-info__input-error': errors.addressState}
                      )}
                      onChange={this.handleChange('addressState')}
                      value={user.addressState} />
                    &nbsp;
                    <input
                      type="text"
                      className={classNames(
                        'personal-info__input',
                        'personal-info__input-zip',
                        {'personal-info__input-error': errors.addressZip}
                      )}
                      onChange={this.handleChange('addressZip')}
                      value={user.addressZip} />
                  </div>
                  : <div>
                    {`${user.addressCity}, ${user.addressState} ${user.addressZip}`}
                  </div>
                }
              </div>
              {isEditing
                ? <input
                  type="text"
                  className={classNames(
                    'personal-info__input',
                    {'personal-info__input-error': errors.countryOfOrigin}
                  )}
                  onChange={this.handleChange('countryOfOrigin')}
                  value={user.countryOfOrigin} />
                : <div>
                  {!_.isEmpty(user.countryOfOrigin) &&
                    <div className="personal-info__value">{user.countryOfOrigin}</div>
                  }
                </div>
              }
              <div className="personal-info__spacing">
                {isEditing && !isManager &&
                  <input
                    type="password"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-pin',
                      'personal-info__input-pin-space',
                      {'personal-info__input-error': errors.oldPin}
                    )}
                    onChange={this.handleChange('oldPin', /^[0-9]{0,4}$/)}
                    value={user.oldPin} />
                }
                {isEditing &&
                  <input
                    type="password"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-pin',
                      {'personal-info__input-pin-space': isManager},
                      {'personal-info__input-error': errors.newPin || errors.confirmNewPin}
                    )}
                    onChange={this.handleChange('newPin', /^[0-9]{0,4}$/)}
                    value={user.newPin} />
                }
                {isEditing &&
                  <input
                    type="password"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-pin',
                      {'personal-info__input-error': errors.newPin || errors.confirmNewPin}
                    )}
                    onChange={this.handleChange('confirmNewPin', /^[0-9]{0,4}$/)}
                    value={user.confirmNewPin} />
                }
              </div>
            </div>
          </div>
        </div>
        <button className="personal-info__submit" type="submit" />
      </form>
    );
  }
}

const mapDispatchToProps = {
  updateUser
};

export default connect(null, mapDispatchToProps)(PersonalInfo);
