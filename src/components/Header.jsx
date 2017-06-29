import React from 'react';
import logoImg from 'assets/images/logo.png';

const Header = () => {
  return (
    <div>
      <div className="header">
        <img className="header-logo" src={logoImg} alt="Worcester Earn A Bike" />
        <div className="header-content">
          <div className="header-welcome">Welcome To</div>
          <div className="header-city">Worcester</div>
          <div className="header-title">Earn a Bike</div>
          <div className="header-subtitle">Your Part Time Bicycle Shop</div>
          <div className="header-subtitle">With Full Time Bicycle Love</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
