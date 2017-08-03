import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';

export default class ParentInfoStep extends Component {
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
            {'registration-field__error': errors.parentName}
          )}
          type="text"
          placeholder="Parent's name"
          value={newUser.parentName}
          onChange={this.handleChange('parentName')} />
        <input
          className={classNames(
            'registration-field',
            {'registration-field__error': errors.parentPhone}
          )}
          type="text"
          placeholder="Parent's phone"
          value={newUser.parentPhone}
          onChange={this.handleChange('parentPhone')} />
      </div>
    );
  }
}
