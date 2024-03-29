import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import checkImg from 'images/check.svg';
import {questionOneOptions} from 'utils/constants';
import {getQuestionOneIsChecked, getQuestionOneOtherValue} from 'utils/helpers';

export default class QuestionOneStep extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleChange = (optionArg) => {
    return () => {
      const {newUser, onChange} = this.props;

      const option = optionArg === 'Other' ? getQuestionOneOtherValue(newUser.questionOne) || '' : optionArg;

      if (newUser.questionOne.find(((val) => val === option)) !== undefined) {
        newUser.questionOne = newUser.questionOne.filter(((val) => val !== option));
      } else {
        newUser.questionOne = newUser.questionOne.concat([option]);
      }

      onChange(newUser);
    };
  }

  handleOtherChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.questionOne = newUser.questionOne
      .filter((val) => val !== getQuestionOneOtherValue(newUser.questionOne))
      .concat([e.target.value]);
    onChange(newUser);
  }

  render() {
    const {newUser: {questionOne}} = this.props;
    const other = getQuestionOneOtherValue(questionOne);

    return (
      <div className="registration-step">
        <div className="registration-question">
          How did you find out about Earn a Bike?
        </div>
        {/* <textarea
          autoFocus={true}
          className={classNames(
            'registration-field',
            'registration-field__question',
            {'registration-field__error': errors.questionOne}
          )}
          type="text"
          value={newUser.questionOne}
          onChange={this.handleChange} /> */}
        {questionOneOptions.map((option) => (
          <div className="registration-checkbox-small" key={option}>
            <button
              className="checkbox"
              onClick={this.handleChange(option)}>
              {getQuestionOneIsChecked(questionOne, option) && <img alt="Check" src={checkImg} />}
            </button>
            <button
              className="registration-checkbox__text"
              onClick={this.handleChange(option)}>
              {option}
            </button>
          </div>
        )
        )}
        {other !== undefined
          ? <input
            autoFocus={true}
            className={classNames(
              'registration-field',
              'registration-field__other',
            )}
            type="text"
            value={other}
            onChange={this.handleOtherChange} />
          : <div className="registration-field__other-placeholder" />
        }
      </div>
    );
  }
}
