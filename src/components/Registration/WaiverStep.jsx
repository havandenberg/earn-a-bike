import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import {hasError} from 'utils/messages';
import checkImg from 'images/check.svg';

export default class WaiverStep extends Component {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func,
    onForward: PropTypes.func
  }

  handleWaiverChange = () => {
    const {newUser, onChange} = this.props;
    newUser.waiver = !newUser.waiver;
    onChange(newUser);
  }

  render() {
    const {errors, newUser, onForward} = this.props;

    return (
      <div className="registration-step">
        <div className="registration-checkbox">
          <button className="checkbox" onClick={this.handleWaiverChange}>
            {newUser.waiver && <img alt="Check" src={checkImg} />}
          </button>
          <button className={classNames(
            'registration-checkbox__text',
            {'registration-checkbox__text-error': hasError(errors, ['waiver'])})
          } onClick={this.handleWaiverChange}>
            I agree to the yadda yadda yadda liability waiver etcetera etcetera etcetera
          </button>
        </div>
        <button className="registration-complete" onClick={onForward}>Confirm Registration</button>
      </div>
    );
  }
}
