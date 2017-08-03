import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';

export default class QuestionTwoStep extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.questionTwo = e.target.value;
    onChange(newUser);
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <div className="registration-question">
          What brings you to Earn a Bike?
        </div>
        <textarea
          autoFocus={true}
          className={classNames(
            'registration-field',
            'registration-field__question',
            {'registration-field__error': errors.questionTwo}
          )}
          type="text"
          value={newUser.questionTwo}
          onChange={this.handleChange} />
      </div>
    );
  }
}
