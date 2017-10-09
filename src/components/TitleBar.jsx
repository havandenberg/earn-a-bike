import React from 'react';
import {minimize, maximize, close} from 'utils/titleBar';
import minImg from 'images/min.svg';
import maxImg from 'images/max.svg';
import closeImg from 'images/close.svg';

const TitleBar = () => (
  <div className="title-bar">
    <button className="title-btn" onClick={minimize}>
      <img alt="min" src={minImg} />
    </button>
    <button className="title-btn" onClick={maximize}>
      <img alt="max" src={maxImg} />
    </button>
    <button className="title-btn" onClick={close}>
      <img alt="close" src={closeImg} />
    </button>
  </div>
);

export default TitleBar;
