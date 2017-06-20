import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import searchImg from 'images/search.svg';

class UserList extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    users: PropTypes.arrayOf(PropTypes.shape({}))
  }

  state = {
    searchText: ''
  };

  handleChange = (e) => {
    this.setState({searchText: e.target.value});
  }

  render() {
    const {searchText} = this.state;
    const {users} = this.props;

    return (
      <div className="user-list">
        <div className="user-list-header">Currently signed in</div>
        <div className="input-search">
          <img alt="Search" src={searchImg} />
          <input
            placeholder="Filter"
            type="text"
            value={searchText}
            onChange={this.handleChange} />
        </div>
        {users.map((user, i) => {
          return (
            <div key={i}>{user.firstName}</div>
          );
        })}
      </div>
    );
  }
}

export default connect(({app}) => {
  return {
    users: app.get('users').toJS()
  };
})(UserList);
