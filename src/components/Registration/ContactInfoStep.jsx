import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {hasError} from 'utils/messages';

export default class ContactInfoStep extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleEmailChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.email = e.target.value;
    onChange(newUser);
  }

  handlePhoneChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.phone = e.target.value;
    onChange(newUser);
  }

  handlePinChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.pin = e.target.value;
    onChange(newUser);
  }

  handleConfirmPinChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.confirmPin = e.target.value;
    onChange(newUser);
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <input
          autoFocus={true}
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['email'])})}
          type="text"
          placeholder="Email"
          value={newUser.email}
          onChange={this.handleEmailChange} />
        <input
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['phone'])})}
          type="text"
          placeholder="Phone"
          value={newUser.phone}
          onChange={this.handlePhoneChange} />
        <input
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['pin'])})}
          type="text"
          placeholder="4 digit pin"
          value={newUser.pin}
          onChange={this.handlePinChange} />
        <input
          className={classNames(
            'registration-field',
            {'registration-field__error': hasError(errors, ['confirmPin'])})}
          type="text"
          placeholder="Confirm pin"
          value={newUser.confirmPin}
          onChange={this.handleConfirmPinChange} />
      </div>
    );
  }
}
