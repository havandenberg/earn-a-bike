import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {history} from 'utils/store';
import {getHoursDifference} from 'utils/helpers';

export default class UserItem extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    onSignout: PropTypes.func
  }

  state = {
    hover: false,
    pin: '',
    showPin: false
  }

  handleChange = (e) => {
    this.setState({pin: e.target.value});
  }

  handleHidePin = () => {
    setTimeout(() => {
      if (this) {
        this.setState({showPin: false, pin: ''});
      }
    }, 200);
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
    onSignout(user.email);
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
    const {user} = this.props;
    const startTime = moment.unix(user.visits[0].timeIn);
    const endTime = moment();

    return (
      <div className="user">
        {showPin
          ? <div className="user-name user-name__link">{`${user.firstName} ${user.lastName[0]}.${user.isManager ? ' (M)' : ''}`}</div>
          : <button
            className="user-name user-name__link"
            onClick={this.showPin}>{`${user.firstName} ${user.lastName[0]}.${user.isManager ? ' (M)' : ''}`}</button>
        }
        {showPin
          ? <form className="user-pin" onSubmit={this.handleProfile}>
            <div className="user-time-in"><strong>In</strong> {startTime.format('h:mm')}</div>
            <input
              autoFocus={true}
              className="input-user-item"
              type="password"
              maxLength="4"
              name="pin"
              pattern="[0-9]{4}"
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
            <div className="user-time-in">
              <strong>In</strong> {moment.unix(user.visits[0].timeIn).format('h:mm')}
            </div>
            {hover && <div className="user-time-in"><strong>Out</strong> {endTime.format('h:mm')}</div>}
            {hover && <div className="user-time-in"><strong>+{getHoursDifference(startTime, endTime)} hrs</strong></div>}
            <button
              className="user-name user-name__link"
              onClick={this.handleSignout}
              onMouseEnter={this.toggleHover}
              onMouseLeave={this.toggleHover}>Sign Out</button>
          </div>
        }
      </div>
    );
  }
}
