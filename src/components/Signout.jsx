import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {updateUser, handleSignOut} from 'actions/app';
import {getHoursDifference, getTotalHours} from 'utils/helpers';
import {history} from 'utils/store';
import {userProps} from 'proptypes/user';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';

class Signout extends Component {
  static propTypes = {
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps),
    onSignout: PropTypes.func
  };


  state = {
    hasNotesError: false,
    hover: false
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

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  };

  handleSignout = () => {
    const {onSignout, user} = this.props;
    if (!_.isEmpty(user.visits[0].notes)) {
      onSignout(user.id);
      history.push('/');
    } else {
      this.setState({hasNotesError: true});
    }
  };

  getTotalHours = () => {
    return getTotalHours(this.state.visits);
  };

  render() {
    const {user} = this.props;
    const {hasNotesError, hover} = this.state;
    const totalHours = this.getTotalHours();

    return (
      <div className="signout">
        <div className="signout-header">
          <Link className="btn-forward" to="/" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
            <img alt="Sign In" className="profile-back flip-x" src={hover ? bicycleForwardGif : bicycleForwardImg} />
            <div className="btn-help btn-help__back">Back</div>
          </Link>
          <div className="profile-title">Signout</div>
          <div className="btn-placeholder" />
        </div>
        <div className="signout-content">
          <div className="signout-time">
            <div className={classNames({'user-name__profile-over-ten': totalHours >= 10})}>Current hours:&nbsp;&nbsp;&nbsp;&nbsp;</div>
            <div><span className={classNames('profile-total-hours', {'user-name__profile-over-ten': totalHours >= 10})}>
              {totalHours}
            </span>&nbsp;/ 10</div>
          </div>
          <div className="signout-today-header">Today</div>
          <div className="signout-time">
            <div>Time in:</div>
            <div>{moment.unix(user.visits[0].timeIn).format('h:mm a')}</div>
          </div>
          <div className="signout-time">
            <div>Hours added:</div>
            <div>+{getHoursDifference(moment.unix(user.visits[0].timeIn), moment())}</div>
          </div>
          <div className="signout-today-header">Add your notes for the day before you go</div>
          <div className="signout-notes">
            Notes:
            <textarea
              autoFocus={true}
              className={classNames('signout-notes__input', {'signout-error': hasNotesError})}
              onChange={this.handleNotesChange}
              value={user.visits[0].notes}/>
          </div>
          <div className="signout-confirm">
            <button
              className="signout-confirm__btn"
              onClick={this.handleSignout}>
              Confirm Signout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({app}, ownProps) => {
    const users = app.get('users').toJS();
    const user = _.find(users, (u) => {
      return u.id === parseInt(ownProps.match.params.userid, 10);
    });

    return {
      user
    };
  },
  {
    updateUser,
    onSignout: handleSignOut
  }
)(Signout);
