import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {hasError} from 'utils/messages';

export default class ParentInfoStep extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleParentNameChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.parentName = e.target.value;
    onChange(newUser);
  }

  handleParentPhoneChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.parentPhone = e.target.value;
    onChange(newUser);
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <input
          autoFocus={true}
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['parentName'])})}
          type="text"
          placeholder="Parent's name"
          value={newUser.parentName}
          onChange={this.handleParentNameChange} />
        <input
          className={classNames('registration-field', {'registration-field__error': hasError(errors, ['parentPhone'])})}
          type="text"
          placeholder="Parent's phone"
          value={newUser.parentPhone}
          onChange={this.handleParentPhoneChange} />
      </div>
    );
  }
}
