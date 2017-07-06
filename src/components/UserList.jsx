import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {handleSignOut} from 'actions/app';
import UserItem from 'components/UserItem.jsx';
import {userProps} from 'proptypes/user';
import {getTotalHours} from 'utils/helpers';
import searchImg from 'images/search.svg';
import checkImg from 'images/check.svg';

class UserList extends Component {
  static propTypes = {
    isProfile: PropTypes.bool,
    selectedUser: PropTypes.shape(userProps),
    users: PropTypes.arrayOf(PropTypes.shape(userProps)),
    onSelectUser: PropTypes.func,
    onSignout: PropTypes.func
  }

  state = {
    idsToExport: [],
    searchText: '',
    sortByHours: false
  };

  handleChange = (e) => {
    this.setState({searchText: e.target.value});
  }

  handleSelectUser = (user) => {
    this.props.onSelectUser(user);
  }

  handleExportSelectUser = (userId) => {
    const {idsToExport} = this.state;
    if (_.includes(idsToExport, userId)) {
      _.remove(idsToExport, (id) => (id === userId));
    } else {
      idsToExport.push(userId);
    }
    this.setState({idsToExport});
  }

  handleToggleExportAll = () => {
    const {users} = this.props;
    const isExportAll = this.state.idsToExport.length === users.length;

    if (isExportAll) {
      this.setState({idsToExport: []});
    } else {
      const idsToExport = [];
      _.each(users, (user) => {
        idsToExport.push(user.id);
      });
      this.setState({idsToExport});
    }
  }

  handleSignout = (email) => {
    this.props.onSignout(email);
  }

  filterUsers = (user) => {
    return user.isActive && this.searchUsers(user);
  }

  filterProfileUsers = (user) => {
    return this.searchUsers(user);
  }

  searchUsers = (user) => {
    const {isProfile} = this.props;
    const {searchText} = this.state;
    const text = `${user.firstName}${isProfile ? user.lastName : user.lastName[0]}`;
    return text.toLowerCase().includes(searchText.toLowerCase());
  }

  sortUsers = (a, b) => {
    if (!a.isManager && !b.isManager) {
      const x = a.visits[0].timeIn;
      const y = b.visits[0].timeIn;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    if (!a.isManager && b.isManager) {return 1;}
    if (a.isManager && !b.isManager) {return -1;}
    return 0;
  }

  sortProfileUsers = (a, b) => {
    const {sortByHours} = this.state;
    if (!a.isManager && !b.isManager) {
      const x = sortByHours ? getTotalHours(b) : a.firstName;
      const y = sortByHours ? getTotalHours(a) : b.lastName;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    if (!a.isManager && b.isManager) {return 1;}
    if (a.isManager && !b.isManager) {return -1;}
    return 0;
  }

  toggleSortByHours = () => {
    this.setState({sortByHours: !this.state.sortByHours});
  }

  render() {
    const {idsToExport, searchText, sortByHours} = this.state;
    const {
      isProfile,
      selectedUser,
      users
    } = this.props;
    const isExportAll = idsToExport.length === users.length;

    return (
      <div className={classNames('user-list', {'user-list-profile': isProfile})}>
        {isProfile
          ? <div className="user">
            <div className="user-left">
              <button className="checkbox" onClick={this.handleToggleExportAll}>
                {isExportAll && <img alt="Check" src={checkImg} />}
              </button>
              <div className="user-list-header">All Users</div>
            </div>
            <button
              className={classNames(
                'user-list-header',
                'user-list-header__sort-hours',
                {'user-list-header__sort-hours-active': sortByHours}
              )} onClick={this.toggleSortByHours}>(hrs)</button>
          </div>
          : <div className="user-list-header">Currently signed in</div>
        }
        <div className="input-search">
          <img alt="Search" src={searchImg} />
          <input
            autoFocus={isProfile}
            placeholder="Filter"
            type="text"
            value={searchText}
            onChange={this.handleChange} />
        </div>
        <div className="user-list__users scroll">
          {users
            .filter(isProfile ? this.filterProfileUsers : this.filterUsers)
            .sort(isProfile ? this.sortProfileUsers : this.sortUsers)
            .map((user, i) => {
              return (
                <UserItem
                  key={i}
                  isExportSelected={_.includes(idsToExport, user.id)}
                  isProfile={isProfile}
                  selectedUser={selectedUser}
                  onSelectUser={this.handleSelectUser}
                  onExportSelectUser={this.handleExportSelectUser}
                  onSignout={this.handleSignout}
                  user={user} />
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default connect(null, {
  onSignout: handleSignOut
})(UserList);
