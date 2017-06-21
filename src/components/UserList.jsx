import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {handleSignOut} from 'actions/app';
import UserItem from 'components/UserItem.jsx';
import searchImg from 'images/search.svg';

class UserList extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape({})),
    onSignout: PropTypes.func
  }

  state = {
    searchText: ''
  };

  handleChange = (e) => {
    this.setState({searchText: e.target.value});
  }

  handleSignout = (email) => {
    this.props.onSignout(email);
  }

  filterUsers = (user) => {
    return user.isActive && this.searchUsers(user);
  }

  searchUsers = (user) => {
    const {searchText} = this.state;
    const text = user.firstName + user.lastName[0];
    return text.toLowerCase().includes(searchText.toLowerCase());
  }

  sortUsers = (a, b) => {
    const x = a.visits[0].timeIn;
    const y = b.visits[0].timeIn;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
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
        {users
          .filter(this.filterUsers)
          .sort(this.sortUsers)
          .map((user, i) => {
            return (
              <UserItem key={i} onSignout={this.handleSignout} user={user} />
            );
          })
        }
      </div>
    );
  }
}

export default connect(null, {
  onSignout: handleSignOut
})(UserList);
