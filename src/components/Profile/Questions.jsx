import React, {Component} from 'react';
import PropTypes from 'prop-types';
import userProps from 'proptypes/user';

export default class Questions extends Component {
  static propTypes = {
    selectedUser: PropTypes.shape(userProps)
  };

  render() {
    const {selectedUser} = this.props;

    return (
      <div className="profile-question__container scroll">
        <div className="profile-question">1. How did you find out about Earn-A-Bike?</div>
        <div className="profile-answer">{selectedUser.questionOne}</div>
        <div className="profile-question">2. What brings you to Earn-A-Bike?</div>
        <div className="profile-answer">{selectedUser.questionTwo}</div>
        <div className="profile-question">3. Would you like to be added to the volunteer email list?</div>
        <div className="profile-answer">{selectedUser.emailList ? 'Yes' : 'No'}</div>
        <div className="profile-question">4. Are you interested in becoming a shop manager?</div>
        <div className="profile-answer">{selectedUser.isInterestedManager ? 'Yes' : 'No'}</div>
        <div className="profile-question">5. Are you a student?</div>
        <div className="profile-answer">{selectedUser.isStudent ? `Yes, at ${selectedUser.schoolName}` : 'No'}</div>
      </div>
    );
  }
}
