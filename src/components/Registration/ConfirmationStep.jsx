import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {userProps} from 'proptypes/user';
import {history} from 'utils/store';
import {handleSignIn} from 'actions/app';

class ConfirmationStep extends Component {
  static propTypes = {
    newUser: PropTypes.shape(userProps),
    onSignIn: PropTypes.func
  }

  handleSubmit = (isSignIn) => {
    return (e) => {
      e.preventDefault();
      const {onSignIn, newUser} = this.props;
      if (isSignIn) {
        onSignIn(newUser.email, newUser.pin);
      }
      history.push('/');
    };
  }

  toggleHoverBack = () => {
    this.setState({hoverBack: !this.state.hoverBack});
  }

  toggleHoverForward = () => {
    this.setState({hoverForward: !this.state.hoverForward});
  }

  render() {
    return (
      <div className="registration-step">
        <div className="registration-confirm">
          Your registration is confirmed!
        </div>
        <div className="registration-confirm">
          Would you like to sign in now?
        </div>
        <div className="registration-confirm__btn-container">
          <button className="registration-confirm__btn" onClick={this.handleSubmit(false)}>
            No
          </button>
          <button className="registration-confirm__btn" onClick={this.handleSubmit(true)}>
            Yes
          </button>
        </div>
      </div>
    );
  }
}

export default connect(null, {
  onSignIn: handleSignIn
})(ConfirmationStep);
