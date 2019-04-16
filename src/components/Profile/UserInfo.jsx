import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import userProps from 'proptypes/user';
import {filterVisitsByHourType, getHoursDifference, getTotalHours, getMaxHours} from 'utils/helpers';

export default class UserInfo extends Component {
  static propTypes = {
    selectedHourType: PropTypes.string,
    selectedUser: PropTypes.shape(userProps),
    updateUser: PropTypes.func
  };

  handleNotesChange = (e) => {
    const {selectedUser} = this.props;
    const {visits} = selectedUser;
    visits[0].notes = e.target.value;
    this.props.updateUser({...selectedUser, visits});
  };

  handleTypeChange = (e) => {
    const {selectedUser} = this.props;
    const {visits} = selectedUser;
    visits[0].type = e.target.value;
    this.props.updateUser({...selectedUser, visits});
  };

  render() {
    const {selectedHourType, selectedUser} = this.props;
    const filteredVisits = filterVisitsByHourType(selectedUser.visits, selectedHourType);
    const totalHours = getTotalHours(filteredVisits);
    const maxHours = getMaxHours(selectedUser);

    return (
      <div className="profile-content__left">
        <div className={classNames('profile-current-hours', {'user-name__profile-over-ten': totalHours >= maxHours})}>
          <span className={classNames('profile-total-hours', {'user-name__profile-over-ten': totalHours >= maxHours})}>
            {totalHours}
          </span>&nbsp;/
          {maxHours} hours
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
          <div className="signout-time signout-type">
            <div>Choose visit type:</div>
            <select
              onChange={this.handleTypeChange}
              value={selectedUser.visits[0].type || '-'}>
              <option value="-">-</option>
              <option value="open shop">open shop</option>
              <option value="volunteer">volunteer</option>
            </select>
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
