import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {userProps} from 'proptypes/user';
import {getTotalHours} from 'utils/helpers';
import {history} from 'utils/store';
import {getHoursDifference} from 'utils/helpers';
import checkImg from 'images/check.svg';
import checkGreenImg from 'images/check-green.svg';

export default class UserItem extends Component {
  static propTypes = {
    isExportSelected: PropTypes.bool,
    isProfile: PropTypes.bool,
    selectedUser: PropTypes.shape(userProps),
    user: PropTypes.shape(userProps),
    onExportSelectUser: PropTypes.func,
    onSelectUser: PropTypes.func,
    onSignout: PropTypes.func
  }

  state = {
    hover: false,
    pin: '',
    showPin: false
  }

  handleChange = (e) => {
    if (e.target.value.match(/^[0-9]{0,4}$/)) {
      this.setState({pin: e.target.value});
    }
  }

  handleHidePin = () => {
    setTimeout(() => {
      if (this) {
        this.setState({showPin: false, pin: ''});
      }
    }, 200);
  }

  handleExportSelectUser = (userId) => {
    return (e) => {
      e.preventDefault();
      this.props.onExportSelectUser(userId);
    };
  }

  handleSelectUser = () => {
    this.props.onSelectUser(this.props.user);
  }

  getTotalHours = () => {
    return getTotalHours(this.props.user);
  }

  showPin = () => {
    const {showPin} = this.state;
    if (!showPin) {
      this.setState({showPin: true});
    }
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  }

  handleSignout = () => {
    const {onSignout, user} = this.props;
    onSignout(user.id);
  }

  handleProfile = (e) => {
    e.preventDefault();
    const {user} = this.props;
    const {pin} = this.state;

    if (pin === user.pin) {
      history.push(`/profile/${user.id}`);
    } else {
      this.setState({pin: ''});
      this.refs.pin.focus();
    }
  }

  render() {
    const {hover, pin, showPin} = this.state;
    const {isExportSelected, isProfile, selectedUser, user} = this.props;
    const startTime = _.isEmpty(user.visits) ? moment() : moment.unix(user.isManager ? 0 : user.visits[0].timeIn);
    const endTime = moment();
    const isSelected = selectedUser ? selectedUser.id === user.id : false;
    const totalHours = this.getTotalHours();

    return (
      <div>
        {isProfile
          ? <div className="user">
            <div className="user-left">
              <button className={classNames(
                'checkbox', {'checkbox-over-ten': totalHours >= 10}
              )} onClick={this.handleExportSelectUser(user.id)}>
                {isExportSelected &&
                  <img alt="Check" src={totalHours >= 10 ? checkGreenImg : checkImg} />
                }
              </button>
              <button
                className={classNames(
                  'user-name', 'user-name__profile', 'user-name__profile-link',
                  {'user-name__profile-active': isSelected},
                  {'user-name__profile-over-ten': totalHours >= 10}
                )} onClick={this.handleSelectUser}>
                {`${user.firstName} ${user.lastName}${user.isManager ? ' (M)' : ''}`}
              </button>
            </div>
            {!user.isManager && <div className={classNames(
              'user-list-header', {'user-list-header__over-ten': totalHours >= 10})
            }>{`(${totalHours})`}</div>}
          </div>
          : <div className="user">
            {showPin
              ? <div className="user-name user-name__link">
                {`${user.firstName} ${user.lastName[0]}.${user.isManager ? ' (M)' : ''}`}
              </div>
              : <button
                className="user-name user-name__link"
                onClick={this.showPin}>
                {`${user.firstName} ${user.lastName[0]}.${user.isManager ? ' (M)' : ''}`}
              </button>
            }
            {showPin
              ? <form className="user-pin" onSubmit={this.handleProfile}>
                {!user.isManager && <div className="user-time-in"><strong>In</strong> {startTime.format('h:mm')}</div>}
                <input
                  autoFocus={true}
                  type="password"
                  placeholder="Pin"
                  ref="pin"
                  value={pin}
                  onBlur={this.handleHidePin}
                  onChange={this.handleChange} />
                <button
                  className="user-name"
                  type="submit">-></button>
              </form>
              : <div className="user-pin">
                {!user.isManager &&
                  <div className="user-time-in">
                    <strong>In</strong> {startTime.format('h:mm')}
                  </div>
                }
                {!user.isManager && hover &&
                  <div className="user-time-in"><strong>Out</strong> {endTime.format('h:mm')}</div>
                }
                {!user.isManager && hover &&
                  <div className="user-time-in"><strong>+{getHoursDifference(startTime, endTime)} hrs</strong></div>
                }
                <button
                  className="user-name user-name__link"
                  onClick={this.handleSignout}
                  onMouseEnter={this.toggleHover}
                  onMouseLeave={this.toggleHover}>Sign Out</button>
              </div>
            }
          </div>
        }
      </div>
    );
  }
}
