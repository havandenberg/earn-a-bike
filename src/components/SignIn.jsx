import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';
import {clearMessages, handleSignIn} from 'actions/app';
import Messages from 'components/Messages.jsx';
import UserList from 'components/UserList.jsx';
import {messages as messageList} from 'utils/messages';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';

class SignIn extends Component {
  static propTypes = {
    clearMessages: PropTypes.func,
    handleSignIn: PropTypes.func,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    users: PropTypes.arrayOf(PropTypes.shape({}))
  }

  state = {
    errors: [],
    hover: false,
    pin: '',
    email: ''
  };

  handleChange = (field) => {
    return (e) => {
      if (field !== 'pin' || e.target.value.match(/^[0-9]{0,4}$/)) {
        this.setState({[field]: e.target.value});
      }
    };
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

  handleSubmit = (e) => {
    e.preventDefault();
    const {email, pin} = this.state;
    this.props.clearMessages();
    if (this.validate()) {
      this.props.handleSignIn(email, pin);
      this.setState({email: '', pin: ''});
      this.refs.email.focus();
    }
  }

  render() {
    const {messages, users} = this.props;
    const {email, errors, hover, pin} = this.state;

    return (
      <div className="sign-in__container">
        <div className="sign-in">
          <h1>Sign In</h1>
          <Messages messages={messages.concat(errors)} />
          <form onSubmit={this.handleSubmit}>
            <div className="field-container">
              <input
                autoFocus={true}
                className="input-primary"
                placeholder="Email"
                ref="email"
                type="text"
                value={email}
                onChange={this.handleChange('email')} />
              <input
                autoComplete="off"
                className="field input-primary sign-in-pin"
                type="password"
                name="pin"
                placeholder="Pin"
                value={pin}
                onChange={this.handleChange('pin')} />
            </div>
            <div className="sign-in-options">
              <Link className="sign-in-new" to="/registration">New?</Link>
              <button className="btn-forward" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} type="submit">
                <img alt="Sign In" src={hover ? bicycleForwardGif : bicycleForwardImg} />
                <div className="btn-help">Sign In</div>
              </button>
            </div>
          </form>
        </div>
        <UserList users={users} />
      </div>
    );
  }
}

export default connect(({app}) => {
  return {
    messages: app.get('messages').toJS(),
    users: app.get('users').toJS()
  };
}, {
  clearMessages,
  handleSignIn
})(SignIn);
