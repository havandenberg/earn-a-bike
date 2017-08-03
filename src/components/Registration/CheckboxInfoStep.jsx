import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {userProps} from 'proptypes/user';
import checkImg from 'images/check.svg';

export default class CheckboxInfoStep extends Component {
  static propTypes = {
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleChange = (field) => {
    return () => {
      const {newUser, onChange} = this.props;
      newUser[field] = !newUser[field];
      onChange(newUser);
    };
  }

  render() {
    const {newUser} = this.props;

    return (
      <div className="registration-step">
        <div className="registration-checkbox">
          <button
            className="checkbox"
            onClick={this.handleChange('emailList')}>
            {newUser.emailList && <img alt="Check" src={checkImg} />}
          </button>
          <button
            className="registration-checkbox__text"
            onClick={this.handleChange('emailList')}>
            Would you like to be added to the volunteer email list?
          </button>
        </div>
        <div className="registration-checkbox">
          <button
            className="checkbox"
            onClick={this.handleChange('isInterestedManager')}>
            {newUser.isInterestedManager && <img alt="Check" src={checkImg} />}
          </button>
          <button
            className="registration-checkbox__text"
            onClick={this.handleChange('isInterestedManager')}>
            Are you interested in becoming a shop manager?
          </button>
        </div>
      </div>
    );
  }
}
