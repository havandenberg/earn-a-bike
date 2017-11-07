import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {clearMessages, handleSignIn} from 'actions/app';
import BicycleBtn from 'components/BicycleBtn.jsx';
import Messages from 'components/Messages.jsx';
import UserList from 'components/UserList.jsx';
import {messages as messageList} from 'utils/messages';
import {messageProps} from 'proptypes/message';
import {userProps} from 'proptypes/user';
import exclamationImg from 'images/exclamation-mark.svg';

class SignIn extends Component {
  static propTypes = {
    clearMessages: PropTypes.func,
    handleSignIn: PropTypes.func,
    messages: PropTypes.arrayOf(messageProps),
    users: PropTypes.arrayOf(PropTypes.shape(userProps))
  };

  state = {
    errors: [],
    pin: '',
    username: ''
  };

  handleChange = (field) => {
    return (e) => {
      const {value} = e.target;
      if (field !== 'pin' || value.match(/^[0-9]{0,4}$/)) {
        this.setState({[field]: value});
      }
    };
  };

  validate = () => {
    const {username, pin} = this.state;
    const errors = [];

    if (_.isEmpty(username)) {
      errors.push(messageList.enterUsername);
    }
    if (_.isEmpty(pin)) {
      errors.push(messageList.enterPin);
    }

    this.setState({errors});
    return !errors.length;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {username, pin} = this.state;
    this.props.clearMessages();
    if (this.validate()) {
      this.props.handleSignIn(username, pin);
      this.setState({username: '', pin: ''});
    }
    this.refs.username.focus();
  };

  render() {
    const {messages, users} = this.props;
    const {errors, pin, username} = this.state;

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
                placeholder="Username"
                ref="username"
                type="text"
                value={username}
                onChange={this.handleChange('username')}/>
              <input
                autoComplete="off"
                className="field input-primary sign-in-pin"
                type="password"
                name="pin"
                placeholder="Pin"
                value={pin}
                onChange={this.handleChange('pin')}/>
            </div>
            <div className="sign-in-options">
              <Link className="sign-in-new" to="/registration">
                New?
              </Link>
              <BicycleBtn text="Sign In" onSubmit={this.handleSubmit} />
            </div>
            <div className="sign-in-rules">
              <div className="sign-in-rules__title">
                <img className="sign-in-rules__img" src={exclamationImg} alt="Important" />
                <div>Shop Rules:</div>
              </div>
            </div>
          </form>
        </div>
        <UserList users={users} />
      </div>
    );
  }
}

const mapStateToProps = ({app}) => {
  return {
    messages: app.get('messages').toJS(),
    users: app.get('users').toJS()
  };
};

const mapDispatchToProps = {
  clearMessages,
  handleSignIn
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
