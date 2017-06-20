import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';
import {handleSignIn} from 'actions/app';
import Messages from 'components/Messages.jsx';
import {messages as messageList} from 'utils/messages';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';

class SignIn extends Component {
  static propTypes = {
    handleSignIn: PropTypes.func,
    messages: PropTypes.arrayOf(PropTypes.shape({}))
  }

  state = {
    errors: [],
    hover: false,
    pin: '',
    email: ''
  };

  handleChange = (field) => {
    return (e) => {
      this.setState({[field]: e.target.value});
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
    if (this.validate()) {
      this.props.handleSignIn(email, pin);
    }
  }

  render() {
    const {messages} = this.props;
    const {email, errors, hover, pin} = this.state;

    return (
      <div className="sign-in">
        <h1>Sign In</h1>
        <Messages messages={messages.concat(errors)} />
        <form onSubmit={this.handleSubmit}>
          <div className="field-container">
            <input
              autoFocus={true}
              className="input-primary"
              placeholder="Email"
              type="text"
              value={email}
              onChange={this.handleChange('email')} />
            <input
              autoComplete="off"
              className="field input-primary"
              type="password"
              maxLength="4"
              name="pin"
              pattern="[0-9]{4}"
              placeholder="PIN"
              value={pin}
              onChange={this.handleChange('pin')} />
          </div>
          <div className="sign-in-options">
            <Link className="sign-in-new" to="/sign-up">New?</Link>
            <button className="btn-forward" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} type="submit">
              <img alt="Sign In" src={hover ? bicycleForwardGif : bicycleForwardImg} />
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(({app}) => {
  return {
    messages: app.get('messages').toJS()
  };
}, {
  handleSignIn
})(SignIn);
