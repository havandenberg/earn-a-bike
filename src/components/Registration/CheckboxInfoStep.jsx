import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {userProps} from 'proptypes/user';
import checkImg from 'images/check.svg';

export default class CheckboxInfoStep extends Component {
  static propTypes = {
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleEmailListChange = () => {
    const {newUser, onChange} = this.props;
    newUser.emailList = !newUser.emailList;
    onChange(newUser);
  }

  handleIsInterestedManagerChange = () => {
    const {newUser, onChange} = this.props;
    newUser.isInterestedManager = !newUser.isInterestedManager;
    onChange(newUser);
  }

  render() {
    const {newUser} = this.props;

    return (
      <div className="registration-step">
        <div className="registration-checkbox">
          <button className="checkbox" onClick={this.handleEmailListChange}>
            {newUser.emailList && <img alt="Check" src={checkImg} />}
          </button>
          <button className="registration-checkbox__text" onClick={this.handleEmailListChange}>
            Would you like to be added to the volunteer email list?
          </button>
        </div>
        <div className="registration-checkbox">
          <button className="checkbox" onClick={this.handleIsInterestedManagerChange}>
            {newUser.isInterestedManager && <img alt="Check" src={checkImg} />}
          </button>
          <button className="registration-checkbox__text" onClick={this.handleIsInterestedManagerChange}>
            Are you interested in becoming a shop manager?
          </button>
        </div>
      </div>
    );
  }
}
