import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {connect} from 'react-redux';
import {updateUser} from 'actions/app';
import {getHoursDifference, getTotalHours, getMaxHours} from 'utils/helpers';
import {history} from 'utils/store';
import {userProps} from 'proptypes/user';

class Signout extends Component {
  static propTypes = {
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps),
    onBack: PropTypes.func,
    onSignout: PropTypes.func
  };

  state = {
    hasNotesError: false,
    hasTypeError: false
  };

  componentWillMount() {
    const {user} = this.props;
    if (!user.isActive) {
      history.push('/');
    }
  }

  handleNotesChange = (e) => {
    const {user} = this.props;
    const visit = user.visits[0];
    visit.notes = e.target.value;
    this.props.updateUser(user);
    this.setState({hasNotesError: false});
  };

  handleTypeChange = (e) => {
    const {user} = this.props;
    const visit = user.visits[0];
    visit.type = e.target.value;
    this.props.updateUser(user);
    this.setState({hasTypeError: false});
  };

  handleSignout = () => {
    const {onSignout, user} = this.props;
    const visit = user.visits[0];
    const hasNotesError = _.isEmpty(visit.notes);
    const hasTypeError = !visit.type || _.isEqual(visit.type, '-');
    if ((user.isManager || !hasNotesError) && !hasTypeError) {
      onSignout(user.id);
    } else {
      this.setState({hasNotesError, hasTypeError});
    }
  };

  getTotalHours = () => {
    return getTotalHours(this.props.user.visits);
  };

  render() {
    const {onBack, user} = this.props;
    const {hasNotesError, hasTypeError} = this.state;
    const totalHours = this.getTotalHours();
    const maxHours = getMaxHours(user);

    return (
      <div className="signout__background">
        <div className={classNames('signout__container', {'signout__container-manager': user.isManager})}>
          <div className="profile-title">Bye, {user.firstName}!</div>
          {!user.isManager && (
            <div className="signout-time">
              <div className={classNames({'user-name__profile-over-ten': totalHours >= maxHours})}>
                Current hours:&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <div>
                <span className={classNames('profile-total-hours', {'user-name__profile-over-ten': totalHours >= maxHours})}>
                  {totalHours}
                </span>&nbsp;/ {maxHours}
              </div>
            </div>
          )}
          <div className="signout-today-header">Today</div>
          <div className="signout-time">
            <div>Time in:</div>
            <div>{moment.unix(user.visits[0].timeIn).format('h:mm a')}</div>
          </div>
          <div className="signout-time">
            <div>Time out:</div>
            <div>{moment().format('h:mm a')}</div>
          </div>
          <div className="signout-time">
            <div>Hours added:</div>
            <div>+{getHoursDifference(moment.unix(user.visits[0].timeIn), moment())}</div>
          </div>
          <div className="signout-time signout-type">
            <div>Choose visit type:</div>
            <select
              className={classNames({'signout-error': hasTypeError})}
              onChange={this.handleTypeChange}
              value={user.visits[0].type || '-'}>
              <option value="-">-</option>
              <option value="open shop">open shop</option>
              <option value="volunteer">volunteer</option>
            </select>
          </div>
          {!user.isManager && <div className="signout-today-header">Add your notes for the day before you go...</div>}
          <div className="signout-notes">
            Notes:
            <textarea
              autoFocus={true}
              className={classNames('signout-notes__input', {'signout-error': hasNotesError})}
              onChange={this.handleNotesChange}
              value={user.visits[0].notes}/>
          </div>
          <div className="signout-confirm">
            <button className="signout-confirm__btn" onClick={onBack}>
              Back
            </button>
            <button className="signout-confirm__btn" onClick={this.handleSignout}>
              Signout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, {
  updateUser
})(Signout);
