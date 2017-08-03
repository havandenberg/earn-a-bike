import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {messages} from 'utils/messages';
import Messages from 'components/Messages.jsx';

export default class LoginInfoStep extends Component {
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

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <Messages messages={errors.usernameNotUnique ? [messages.usernameAlreadyExists] : []} />
        <input
          autoFocus={true}
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.username}
          )}
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={this.handleChange('username')} />
        <input
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.pin})}
          type="password"
          placeholder="4 digit pin"
          value={newUser.pin}
          onChange={this.handleChange('pin', /^[0-9]{0,4}$/)} />
        <input
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.confirmPin}
          )}
          type="password"
          placeholder="Confirm pin"
          value={newUser.confirmPin}
          onChange={this.handleChange('confirmPin', /^[0-9]{0,4}$/)} />
      </div>
    );
  }
}
