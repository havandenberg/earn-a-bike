import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {updateUser} from 'actions/app';
import {messages as messageList} from 'utils/messages';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';

class Profile extends Component {
  static propTypes = {
    updateUser: PropTypes.arrayOf(PropTypes.shape({})),
    user: PropTypes.shape({})
  }

  state = {
    errors: [],
    hover: false,
    isEditing: false
  };

  handleChange = (field) => {
    return (e) => {
      this.setState({[field]: e.target.value});
    };
  }

  toggleEditing = () => {
    this.setState({isEditing: !this.state.isEditing});
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  }

  validate = () => {
    const {email, pin} = this.state;
    const errors = [];

    if (_.isEmpty(email)) {
      errors.push(messageList.enterEmail);
    }

    if (_.isEmpty(pin)) {
      errors.push(messageList.enterPin);
    }

    this.setState({errors});
    return !errors.length;
  }

  render() {
    const {user} = this.props;
    const {hover, isEditing} = this.state;

    return (
      <div className="profile">
        <div className="profile-header">
          <Link
            className="btn-forward"
            to="/"
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}>
            <img alt="Sign In" className="profile-back flip-x" src={hover ? bicycleForwardGif : bicycleForwardImg} />
          </Link>
          <div className="profile-title">{user.isManager ? 'Volunteer Info' : 'My Info'}</div>
          <button
            className="btn-action"
            onClick={this.toggleEditing}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        {user.firstName}
      </div>
    );
  }
}

export default connect(({app}, ownProps) => {
  const users = app.get('users').toJS();
  const user = _.find(users, (u) => {
    return u.id === parseInt(ownProps.match.params.userid, 10);
  });

  return {
    user
  };
}, {
  updateUser
})(Profile);
