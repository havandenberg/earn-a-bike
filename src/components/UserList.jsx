import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {deleteUsers, handleSignOut} from 'actions/app';
import UserItem from 'components/UserItem.jsx';
import {userProps} from 'proptypes/user';
import {exportData, importData} from 'utils/fileIO';
import {getTotalHours} from 'utils/helpers';
import searchImg from 'images/search.svg';
import checkImg from 'images/check.svg';

class UserList extends Component {
  static propTypes = {
    deleteUsers: PropTypes.func,
    isProfile: PropTypes.bool,
    selectedUser: PropTypes.shape(userProps),
    users: PropTypes.arrayOf(PropTypes.shape(userProps)),
    onSelectUser: PropTypes.func,
    onSignout: PropTypes.func
  };

  state = {
    confirmDelete: false,
    selectedUserIds: [],
    searchText: '',
    sortByHours: false
  };

  handleChange = (e) => {
    this.setState({searchText: e.target.value});
  };

  handleSignout = (id) => {
    this.props.onSignout(id);
  };

  handleSelectUser = (user) => {
    this.props.onSelectUser(user);
  };

  handleExportSelectUser = (userId) => {
    const {selectedUserIds} = this.state;
    if (_.includes(selectedUserIds, userId)) {
      _.remove(selectedUserIds, (id) => id === userId);
    } else {
      selectedUserIds.push(userId);
    }
    this.setState({selectedUserIds});
  };

  handleToggleExportAll = () => {
    const {users} = this.props;
    const isExportAll = this.state.selectedUserIds.length === users.length;

    if (isExportAll) {
      this.setState({selectedUserIds: []});
    } else {
      const selectedUserIds = [];
      _.each(users, (user) => {
        selectedUserIds.push(user.id);
      });
      this.setState({selectedUserIds});
    }
  };

  confirmDelete = () => {
    this.setState({confirmDelete: true});
  };

  resetConfirmDelete = () => {
    this.setState({confirmDelete: false});
  };

  deleteUsers = () => {
    const {selectedUserIds} = this.state;
    this.props.deleteUsers(selectedUserIds);
    this.setState({confirmDelete: false, selectedUserIds: []});
  };

  filterUsers = (user) => {
    return user.isActive && this.searchUsers(user);
  };

  filterProfileUsers = (user) => {
    return this.searchUsers(user);
  };

  searchUsers = (user) => {
    const {isProfile} = this.props;
    const {searchText} = this.state;
    const text = `${user.firstName}${isProfile ? user.lastName : user.lastName[0]}`;
    return text.toLowerCase().includes(searchText.toLowerCase());
  };

  sortUsers = (a, b) => {
    if (!a.isManager && !b.isManager) {
      const x = a.visits[0].timeIn;
      const y = b.visits[0].timeIn;
      return x < y ? -1 : x > y ? 1 : 0;
    }
    if (!a.isManager && b.isManager) {
      return 1;
    }
    if (a.isManager && !b.isManager) {
      return -1;
    }
    return 0;
  };

  sortProfileUsers = (a, b) => {
    const {sortByHours} = this.state;
    if (!a.isManager && !b.isManager) {
      const x = sortByHours ? parseInt(getTotalHours(b.visits), 10) : a.firstName;
      const y = sortByHours ? parseInt(getTotalHours(a.visits), 10) : b.firstName;
      return x < y ? -1 : x > y ? 1 : 0;
    }
    if (!a.isManager && b.isManager) {
      return 1;
    }
    if (a.isManager && !b.isManager) {
      return -1;
    }
    if (a.isManager && b.isManager) {
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    }
    return 0;
  };

  toggleSortByHours = () => {
    this.setState({sortByHours: !this.state.sortByHours});
  };

  render() {
    const {confirmDelete, selectedUserIds, searchText, sortByHours} = this.state;
    const {isProfile, selectedUser, users} = this.props;
    const isExportAll = selectedUserIds.length === users.length;

    return (
      <div className={classNames('user-list', {'user-list-profile': isProfile})}>
        {isProfile ? (
          <div className="user">
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
              )}
              onClick={this.toggleSortByHours}>
              (hrs)
            </button>
          </div>
        ) : (
          <div className="user-list-header">Currently signed in</div>
        )}
        <div className="input-search">
          <img alt="Search" src={searchImg} />
          <input
            autoFocus={isProfile}
            placeholder="Filter"
            type="text"
            value={searchText}
            onChange={this.handleChange} />
        </div>
        <div className={classNames('user-list__users', {'user-list__users-sign-in': !isProfile}, 'scroll')}>
          {users
            .filter(isProfile ? this.filterProfileUsers : this.filterUsers)
            .sort(isProfile ? this.sortProfileUsers : this.sortUsers)
            .map((user, i) => {
              return (
                <UserItem
                  key={i}
                  isExportSelected={_.includes(selectedUserIds, user.id)}
                  isProfile={isProfile}
                  selectedUser={selectedUser}
                  onSelectUser={this.handleSelectUser}
                  onExportSelectUser={this.handleExportSelectUser}
                  onSignout={this.handleSignout}
                  user={user}/>
              );
            })}
        </div>
        {isProfile &&
          (confirmDelete ? (
            <div className="user-list__options">
              <div className="user-list__options-text">Are you sure?</div>
              <button className="btn-action btn-action__delete" onClick={this.deleteUsers}>
                Yes
              </button>
              <button className="btn-action btn-action__delete" onClick={this.resetConfirmDelete}>
                No
              </button>
            </div>
          ) : (
            <div className="user-list__options">
              <button className="btn-action" onClick={importData}>
                Import
              </button>
              <button className="btn-action" onClick={exportData}>
                Export
              </button>
              {selectedUserIds.length > 0 && (
                <button className="btn-action btn-action__delete" onClick={this.confirmDelete}>
                  Delete
                </button>
              )}
            </div>
          ))}
      </div>
    );
  }
}

const mapDispatchToProps = {
  deleteUsers,
  onSignout: handleSignOut
};

export default connect(null, mapDispatchToProps)(UserList);
