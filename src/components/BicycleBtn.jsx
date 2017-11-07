import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import classNames from 'classnames';
import bicycleGif from 'images/bicycle.gif';
import bicycleImg from 'images/bicycle.png';

export default class BicycleBtn extends Component {
  static propTypes = {
    baseClass: PropTypes.string,
    isReverse: PropTypes.bool,
    text: PropTypes.string,
    onClick: PropTypes.func,
    onSubmit: PropTypes.func
  };

  state = {
    hover: false
  };

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  };

  render() {
    const {baseClass, isReverse, onClick, text} = this.props;
    const {hover} = this.state;

    return (
      <button
        className={classNames('btn-bicycle', {[baseClass]: baseClass})}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        onClick={onClick}
        type="submit">
        <img className={classNames({'flip-x': isReverse})} alt="bicycle" src={hover ? bicycleGif : bicycleImg} />
        {text && <div className="btn-help">{text}</div>}
      </button>
    );
  }
}
