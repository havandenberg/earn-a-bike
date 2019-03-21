import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {userProps} from 'proptypes/user';
import {getTotalHours} from 'utils/helpers';
import {history} from 'utils/store';
import {getHoursDifference} from 'utils/helpers';
import Signout from 'components/Signout.jsx';
import checkImg from 'images/check.svg';
import checkGreenImg from 'images/check-green.svg';
import {filterVisitsByHourType} from 'utils/helpers';

export default class UserItem extends Component {
  static propTypes = {
    isExportSelected: PropTypes.bool,
    isProfile: PropTypes.bool,
    selectedHourType: PropTypes.string,
    selectedUser: PropTypes.shape(userProps),
    user: PropTypes.shape(userProps),
    onExportSelectUser: PropTypes.func,
    onSelectUser: PropTypes.func,
    onSignout: PropTypes.func
  };

  state = {
    hover: false,
    pin: '',
    showPin: false,
    showSignout: false,
    isSignout: false
  };

  handleChange = (e) => {
    if (e.target.value.match(/^[0-9]{0,4}$/)) {
      this.setState({pin: e.target.value});
    }
  };

  handleHidePin = () => {
    setTimeout(() => {
      if (this) {
        this.setState({hover: false, isSignout: false, showPin: false, pin: ''});
      }
    }, 200);
  };

  handleExportSelectUser = (userId) => {
    return () => {
      this.props.onExportSelectUser(userId);
    };
  };

  handleSelectUser = () => {
    const {onSelectUser, user} = this.props;
    onSelectUser(user);
  };

  getTotalHours = () => {
    const {selectedHourType, user} = this.props;
    const filteredVisits = filterVisitsByHourType(user.visits, selectedHourType);
    return getTotalHours(filteredVisits);
  };

  showPin = (isSignout) => {
    return () => {
      const {showPin} = this.state;
      if (!showPin) {
        this.setState({showPin: true, isSignout});
      }
    };
  };

  startHover = () => {
    this.setState({hover: true});
  };

  endHover = () => {
    this.setState({hover: false});
  };

  handleSignout = () => {
    const {onSignout, user} = this.props;
    onSignout(user.id);
    this.setState({isSignout: false, showSignout: false});
  };

  handleSignoutBack = () => {
    this.setState({isSignout: false, showSignout: false, hover: false});
  };

  handleProfile = (e) => {
    e.preventDefault();
    const {user} = this.props;
    const {isSignout, pin} = this.state;

    if (pin === user.pin) {
      if (isSignout) {
        this.setState({showSignout: true});
      } else {
        history.push(`/profile/${user.id}`);
      }
    } else {
      this.setState({pin: ''});
      this.refs.pin.focus();
    }
  };

  render() {
    const {hover, isSignout, showSignout, pin, showPin} = this.state;
    const {isExportSelected, isProfile, selectedUser, user} = this.props;
    const startTime = _.isEmpty(user.visits) ? moment() : moment.unix(user.visits[0].timeIn);
    const endTime = moment();
    const isSelected = selectedUser ? selectedUser.id === user.id : false;
    const totalHours = this.getTotalHours();

    return (
      <div>
        {isProfile ? (
          <div className="user">
            <div className="user-left">
              <button
                className={classNames('checkbox', {'checkbox-over-ten': totalHours >= 10})}
                onClick={this.handleExportSelectUser(user.id)}>
                {isExportSelected && <img alt="Check" src={totalHours >= 10 ? checkGreenImg : checkImg} />}
              </button>
              <button
                className={classNames(
                  'user-name',
                  'user-name__profile',
                  'user-name__profile-link',
                  {'user-name__profile-active': isSelected},
                  {'user-name__profile-over-ten': totalHours >= 10},
                )}
                onClick={this.handleSelectUser}>
                {`${user.firstName} ${user.lastName}${user.isManager ? ' (M)' : ''}`}
              </button>
            </div>
            <div className="user-left">
              {user.isActive && (
                <button
                  className={classNames('user-signout', {'user-signout__over-ten': totalHours >= 10})}
                  onClick={this.handleSignout}>
                Sign Out
                </button>
              )}
              <div className={classNames('user-list-header', {'user-name__profile-over-ten': totalHours >= 10})}>{`(${totalHours})`}</div>
            </div>
          </div>
        ) : (
          <div className="user">
            {showPin ? (
              <div className="user-name user-name__link">{`${user.firstName} ${user.lastName[0]}.${user.isManager ? ' (M)' : ''}`}</div>
            ) : (
              <button className="user-name user-name__link" onClick={this.showPin(false)}>
                {`${user.firstName} ${user.lastName[0]}.${user.isManager ? ' (M)' : ''}`}
              </button>
            )}
            <form className="user-pin" onSubmit={this.handleProfile}>
              <div className="user-time-in">
                <strong>In</strong> {startTime.format('h:mm')}
              </div>
              {(hover || isSignout) && (
                <div className="user-time-in">
                  <strong>Out</strong> {endTime.format('h:mm')}
                </div>
              )}
              {(hover || isSignout) && (
                <div className="user-time-in">
                  <strong>+{getHoursDifference(startTime, endTime)} hrs</strong>
                </div>
              )}
              {showPin && (
                <input
                  autoFocus={true}
                  type="password"
                  placeholder="Pin"
                  ref="pin"
                  value={pin}
                  onBlur={this.handleHidePin}
                  onChange={this.handleChange}/>
              )}
              {showPin && (
                <button className="user-name" type="submit">
                  ->
                </button>
              )}
              {!showPin && (
                <button
                  className="user-name user-name__link"
                  onClick={this.showPin(true)}
                  onMouseEnter={this.startHover}
                  onMouseLeave={this.endHover}>
                  Sign Out
                </button>
              )}
            </form>
          </div>
        )}
        {showSignout && <Signout onBack={this.handleSignoutBack} onSignout={this.handleSignout} user={user} />}
      </div>
    );
  }
}
