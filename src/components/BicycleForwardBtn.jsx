import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';

export default class BicycleForwardBtn extends Component {
  static propTypes = {
    onSubmit: PropTypes.func
  }

  state = {
    hover: false
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  };

  render() {
    const {hover} = this.state;

    return <button
      className="btn-forward"
      onMouseEnter={this.toggleHover}
      onMouseLeave={this.toggleHover}
      type="submit">
      <img alt="Sign In" src={hover ? bicycleForwardGif : bicycleForwardImg} />
      <div className="btn-help">Sign In</div>
    </button>;
  }
}
