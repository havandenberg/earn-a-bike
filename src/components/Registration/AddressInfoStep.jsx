import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {hasError} from 'utils/messages';

export default class AddressInfoStep extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleStreetLine1Change = (e) => {
    const {newUser, onChange} = this.props;
    newUser.address.streetLine1 = e.target.value;
    onChange(newUser);
  }

  handleStreetLine2Change = (e) => {
    const {newUser, onChange} = this.props;
    newUser.address.streetLine2 = e.target.value;
    onChange(newUser);
  }

  handleCityChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.address.city = e.target.value;
    onChange(newUser);
  }

  handleStateChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.address.state = e.target.value;
    onChange(newUser);
  }

  handleZipChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.address.zip = e.target.value;
    onChange(newUser);
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <input
          autoFocus={true}
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['streetLine1'])})}
          type="text"
          placeholder="Address line 1"
          value={newUser.address.streetLine1}
          onChange={this.handleStreetLine1Change} />
        <input
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['streetLine2'])})}
          type="text"
          placeholder="Address line 2"
          value={newUser.address.streetLine2}
          onChange={this.handleStreetLine2Change} />
        <input
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['city'])})}
          type="text"
          placeholder="City"
          value={newUser.address.city}
          onChange={this.handleCityChange} />
        <div className="registration-address-container">
          <input
            className={classNames(
              'registration-field',
              'registration-address-state',
              {'registration-field__error': hasError(errors, ['state'])})
            }
            type="text"
            placeholder="State"
            value={newUser.address.state}
            onChange={this.handleStateChange} />
          <input
            className={classNames(
              'registration-field',
              'registration-address-zip',
              {'registration-field__error': hasError(errors, ['zip'])})
            }
            type="text"
            placeholder="Zip code"
            value={newUser.address.zip}
            onChange={this.handleZipChange} />
        </div>
      </div>
    );
  }
}
