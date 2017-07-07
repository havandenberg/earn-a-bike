import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {updateUser} from 'actions/app';
import {userProps} from 'proptypes/user';
import {hasError} from 'utils/messages';

class PersonalInfo extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    isEditing: PropTypes.bool,
    user: PropTypes.shape(userProps),
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
  }

  handleChange = (field) => {
    return (e) => {
      if (this.validate(field, e.target.value)) {
        this.props.onChange(field, e.target.value);
      }
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit();
  }

  validate = (field, value) => {
    if (_.includes(['oldPin', 'newPin', 'confirmNewPin', 'year'], field)) {
      return value.match(/^[0-9]{0,4}$/);
    }
    if (_.includes(['day', 'month'], field)) {
      return value.match(/^[0-9]{0,2}$/);
    }
    return true;
  }

  render() {
    const {errors, isEditing, user} = this.props;

    return (
      <form className="personal-info scroll" onSubmit={this.handleSubmit}>
        <div className="personal-info__container">
          <div className="personal-info__labels">
            <div className="personal-info__label">Name:</div>
            <div className="personal-info__label">Date Of Birth:</div>
            <div className="personal-info__label">Email:</div>
            <div className="personal-info__label">Phone:</div>
            {!_.isEmpty(user.parentName) &&
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
                <div className="personal-info__label">Old Pin:</div>
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
                      {'personal-info__input-error': hasError(errors, ['firstName'])}
                    )}
                    onChange={this.handleChange('firstName')}
                    value={user.firstName} />
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-last',
                      {'personal-info__input-error': hasError(errors, ['lastName'])}
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
                      {'personal-info__input-error': hasError(errors, ['month'])}
                    )}
                    onChange={this.handleChange('month')}
                    value={user.dateOfBirth.month} />
                  &nbsp;/&nbsp;
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-day',
                      {'personal-info__input-error': hasError(errors, ['day'])}
                    )}
                    onChange={this.handleChange('day')}
                    value={user.dateOfBirth.day} />
                  &nbsp;/&nbsp;
                  <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-year',
                      {'personal-info__input-error': hasError(errors, ['year'])}
                    )}
                    onChange={this.handleChange('year')}
                    value={user.dateOfBirth.year} />
                </div>
                : <div>
                  {`${user.dateOfBirth.month}/${user.dateOfBirth.day}/${user.dateOfBirth.year}`}
                </div>
              }
            </div>
            {isEditing
              ? <input
                type="text"
                className={classNames(
                  'personal-info__input',
                  {'personal-info__input-error': hasError(errors, ['email'])}
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
                  {'personal-info__input-error': hasError(errors, ['phone'])}
                )}
                onChange={this.handleChange('phone')}
                value={user.phone} />
              : <div className="personal-info__value">{user.phone}</div>
            }
            {!_.isEmpty(user.parentName) &&
              <div className="personal-info__spacing">
                {isEditing
                  ? <input
                    type="text"
                    className={classNames(
                      'personal-info__input',
                      {'personal-info__input-error': hasError(errors, ['parentName'])}
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
                      {'personal-info__input-error': hasError(errors, ['parentPhone'])}
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
                    {'personal-info__input-error': hasError(errors, ['streetLine1'])}
                  )}
                  onChange={this.handleChange('streetLine1')}
                  value={user.address.streetLine1} />
                : <div className="personal-info__value">{user.address.streetLine1}</div>
              }
              {isEditing
                ? <input
                  type="text"
                  className={classNames(
                    'personal-info__input',
                    {'personal-info__input-error': hasError(errors, ['streetLine2'])}
                  )}
                  onChange={this.handleChange('streetLine2')}
                  value={user.address.streetLine2} />
                : <div>
                  {!_.isEmpty(user.address.streetLine2) &&
                    <div className="personal-info__value">{user.address.streetLine2}</div>
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
                        {'personal-info__input-error': hasError(errors, ['city'])}
                      )}
                      onChange={this.handleChange('city')}
                      value={user.address.city} />
                    &nbsp;/&nbsp;
                    <input
                      type="text"
                      className={classNames(
                        'personal-info__input',
                        'personal-info__input-state',
                        {'personal-info__input-error': hasError(errors, ['state'])}
                      )}
                      onChange={this.handleChange('state')}
                      value={user.address.state} />
                    &nbsp;/&nbsp;
                    <input
                      type="text"
                      className={classNames(
                        'personal-info__input',
                        'personal-info__input-zip',
                        {'personal-info__input-error': hasError(errors, ['zip'])}
                      )}
                      onChange={this.handleChange('zip')}
                      value={user.address.zip} />
                  </div>
                  : <div>
                    {`${user.address.city}, ${user.address.state} ${user.address.zip}`}
                  </div>
                }
              </div>
              <div className="personal-info__spacing">
                {isEditing &&
                  <input
                    type="password"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-pin',
                      'personal-info__input-pin-space',
                      {'personal-info__input-error': hasError(errors, ['oldPin'])}
                    )}
                    onChange={this.handleChange('oldPin')}
                    value={user.oldPin} />
                }
                {isEditing &&
                  <input
                    type="password"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-pin',
                      {'personal-info__input-error': hasError(errors, ['newPin', 'confirmNewPin'])}
                    )}
                    onChange={this.handleChange('newPin')}
                    value={user.newPin} />
                }
                {isEditing &&
                  <input
                    type="password"
                    className={classNames(
                      'personal-info__input',
                      'personal-info__input-pin',
                      {'personal-info__input-error': hasError(errors, ['newPin', 'confirmNewPin'])}
                    )}
                    onChange={this.handleChange('confirmNewPin')}
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

export default connect(null, {
  updateUser
})(PersonalInfo);
