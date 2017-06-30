import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {hasError} from 'utils/messages';

export default class QuestionTwoStep extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleQuestionTwoChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.questionTwo = e.target.value;
    onChange(newUser);
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <div className="registration-question">What brings you to Earn a Bike?</div>
        <textarea
          autoFocus={true}
          className={classNames(
            'registration-field',
            'registration-field__question',
            {'registration-field__error': hasError(errors, ['questionTwo'])})
          }
          type="text"
          value={newUser.questionTwo}
          onChange={this.handleQuestionTwoChange} />
      </div>
    );
  }
}
