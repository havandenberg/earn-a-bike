import React from 'react';
import PropTypes from 'prop-types';
import alertImg from 'images/alert-msg.svg';

const Messages = ({messages}) => (
  <div className="messages">
    {messages.map((message, i) => {
      return (
        <div key={i} className="message">
          <img alt="message" className="message-img" src={alertImg} />
          <div className="message-text">
            {message.text}
          </div>
        </div>
      );
    })}
  </div>
);

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({}))
};

export default Messages;
