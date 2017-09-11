import React, {Component} from 'react';
import {history} from 'utils/store';
import logoImg from 'assets/images/logo.png';

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
        <div className="header-city">Welcome To</div>
        <div className="header-title">Worcester Earn-A-Bike</div>
        <div className="header-subtitle">Your Part Time Bicycle Shop, With Full Time Bicycle Love</div>
      </div>
    );
  }
}
