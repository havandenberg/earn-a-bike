import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';

export default class AddressInfoStep extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleChange = (field) => {
    return (e) => {
      const {newUser, onChange} = this.props;
      newUser[field] = e.target.value;
      onChange(newUser);
    };
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <input
          autoFocus={true}
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.addressLine1}
          )}
          type="text"
          placeholder="Address line 1"
          value={newUser.addressLine1}
          onChange={this.handleChange('addressLine1')} />
        <div className="registration-address-container">
          <input
            className={classNames(
              'registration-field',
              'registration-address-city',
              {'registration-field__error': errors.addressCity}
            )}
            type="text"
            placeholder="City"
            value={newUser.addressCity}
            onChange={this.handleChange('addressCity')} />
          <input
            className={classNames(
              'registration-field',
              'registration-address-state',
              {'registration-field__error': errors.addressState})
            }
            type="text"
            placeholder="State"
            value={newUser.addressState}
            onChange={this.handleChange('addressState')} />
          <input
            className={classNames(
              'registration-field',
              'registration-address-zip',
              {'registration-field__error': errors.addressZip})
            }
            type="text"
            placeholder="Zip code"
            value={newUser.addressZip}
            onChange={this.handleChange('addressZip')} />
        </div>
      </div>
    );
  }
}
