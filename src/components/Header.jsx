import React, {Component} from 'react';
import {history} from 'utils/store';
import logoImg from 'assets/images/logo.png';
import titleImg from 'assets/images/title.png';

export default class Header extends Component {
  goHome = () => {
    history.push('/');
  };

  render() {
    return (
      <div className="header">
        <button className="header-logo" onClick={this.goHome}>
          <img src={logoImg} alt="Worcester Earn A Bike" />
        </button>
        <div className="header-inner">
          <img className="header-title" src={titleImg} alt="Worcester Earn A Bike" />
          <div className="header-subtitle">
            Your Part Time Bicycle Shop With Full Time Bicycle Love
          </div>
        </div>
      </div>
    );
  }
}
