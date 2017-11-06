import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import userProps from 'proptypes/user';
import {getHoursDifference, getTotalHours} from 'utils/helpers';

export default class UserInfo extends Component {
  static propTypes = {
    selectedUser: PropTypes.shape(userProps),
    updateUser: PropTypes.func
  };

  handleNotesChange = (e) => {
    const {selectedUser} = this.props;
    const {visits} = selectedUser;
    visits[0].notes = e.target.value;
    this.props.updateUser({...selectedUser, visits});
  };

  render() {
    const {selectedUser} = this.props;
    const totalHours = getTotalHours(selectedUser.visits);

    return (
      <div className="profile-content__left">
        <div className={classNames('profile-current-hours', {'user-name__profile-over-ten': totalHours >= 10})}>
          <span className={classNames('profile-total-hours', {'user-name__profile-over-ten': totalHours >= 10})}>{totalHours}</span>&nbsp;/
          10 hours
        </div>
        <div className="profile-today">
          <div className="profile-today-header">Today</div>
          <div className="profile-today-time">
            <div>Time in: </div>
            <div>{moment.unix(selectedUser.visits[0].timeIn).format('h:mm a')}</div>
          </div>
          <div className="profile-today-time">
            <div>Hours added: </div>
            <div>+{getHoursDifference(moment.unix(selectedUser.visits[0].timeIn), moment())}</div>
          </div>
          <div className="profile-today-notes">
            Notes:
            <textarea
              autoFocus={true}
              className="profile-today-notes__input"
              onChange={this.handleNotesChange}
              value={selectedUser.visits[0].notes}/>
          </div>
        </div>
      </div>
    );
  }
}
