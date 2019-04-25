import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {deleteUsers, handleSignOut, resetUsers} from 'actions/app';
import UserItem from 'components/UserItem.jsx';
import {userProps} from 'proptypes/user';
import {exportCSV, exportJSON, importData} from 'utils/fileIO';
import {sortByActive, sortByHours, sortByDate, sortByName} from 'utils/sortBy';
import searchImg from 'images/search.svg';
import checkImg from 'images/check.svg';

const OPTIONS = 'OPTIONS';
const CHOOSE_EXPORT = 'CHOOSE_EXPORT';
const CONFIRM_DELETE = 'CONFIRM_DELETE';
const CONFIRM_RESET = 'CONFIRM_RESET';
const INCLUDE_VISITS = 'INCLUDE_VISITS';

const SORT_BY_ACTIVE = 'SORT_BY_ACTIVE';
const SORT_BY_NAME = 'SORT_BY_NAME';
const SORT_BY_HOURS = 'SORT_BY_HOURS';
const SORT_BY_DATE = 'SORT_BY_DATE';

const sortOptions = {
  [SORT_BY_HOURS]: 'hrs',
  [SORT_BY_NAME]: 'name',
  [SORT_BY_DATE]: 'date'
};

const FILTER_BY_ACTIVE = 'FILTER_BY_ACTIVE';
const FILTER_BY_MANAGERS = 'FILTER_BY_MANAGERS';
const FILTER_BY_VOLUNTEERS = 'FILTER_BY_VOLUNTEERS';

class UserList extends Component {
  static propTypes = {
    deleteUsers: PropTypes.func,
    isProfile: PropTypes.bool,
    resetUsers: PropTypes.func,
    selectedHourType: PropTypes.string,
    selectedUser: PropTypes.shape(userProps),
    users: PropTypes.arrayOf(PropTypes.shape(userProps)),
    onSelectUser: PropTypes.func,
    onSignout: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      filterBy: props.isProfile ? FILTER_BY_MANAGERS : FILTER_BY_ACTIVE,
      optionSet: OPTIONS,
      selectedUserIds: [],
      searchText: '',
      sortBy: props.isProfile ? SORT_BY_NAME : SORT_BY_ACTIVE
    };
  }

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

  chooseExport = () => {
    this.setState({optionSet: CHOOSE_EXPORT});
  };

  confirmDelete = () => {
    this.setState({optionSet: CONFIRM_DELETE});
  };

  confirmReset = () => {
    this.setState({optionSet: CONFIRM_RESET});
  };

  includeVisits = () => {
    this.setState({optionSet: INCLUDE_VISITS});
  };

  export = (type, includeVisits) => {
    return (e) => {
      e.preventDefault();
      const {selectedUserIds} = this.state;
      if (type === 'CSV') {
        exportCSV(selectedUserIds, includeVisits);
      } else {
        exportJSON(selectedUserIds);
      }
      this.setState({optionSet: OPTIONS});
    };
  };

  resetOptions = () => {
    this.setState({optionSet: OPTIONS});
  };

  deleteUsers = () => {
    const {selectedUserIds} = this.state;
    this.props.deleteUsers(selectedUserIds);
    this.setState({optionSet: OPTIONS, selectedUserIds: []});
  };

  resetUserVisits = () => {
    const {selectedUser} = this.props;
    const {selectedUserIds} = this.state;
    this.props.resetUsers(selectedUserIds);
    if (_.includes(selectedUserIds, selectedUser.id)) {
      this.props.onSelectUser({...selectedUser, visits: selectedUser.isActive ? [selectedUser.visits[0]] : []});
    }
    this.setState({optionSet: OPTIONS, selectedUserIds: []});
  };

  getOptions = () => {
    const {optionSet, selectedUserIds} = this.state;
    switch (optionSet) {
    case CONFIRM_DELETE:
      return (
        <div className="user-list__options">
          <div className="user-list__options-text">Are you sure?</div>
          <button className="btn-action btn-action__delete" onClick={this.deleteUsers}>
              Yes
          </button>
          <button className="btn-action btn-action__delete" onClick={this.resetOptions}>
              No
          </button>
        </div>
      );
    case CONFIRM_RESET:
      return (
        <div className="user-list__options">
          <div className="user-list__options-text user-list__options-clear-visits">Clear all visits for selected users?</div>
          <button className="btn-action btn-action__delete" onClick={this.resetUserVisits}>
              Yes
          </button>
          <button className="btn-action btn-action__delete" onClick={this.resetOptions}>
              No
          </button>
        </div>
      );
    case CHOOSE_EXPORT:
      return (
        <div className="user-list__options">
          <div className="user-list__options-text__export">Export As:</div>
          <button className="btn-action btn-action__export" onClick={this.includeVisits}>
              CSV
          </button>
          <button className="btn-action btn-action__export" onClick={this.export('JSON')}>
              JSON
          </button>
          <button className="btn-action btn-action__delete" onClick={this.resetOptions}>
              Cancel
          </button>
        </div>
      );
    case INCLUDE_VISITS:
      return (
        <div className="user-list__options">
          <div className="user-list__options-text__export user-list__options-include-visits">Include visits?</div>
          <button className="btn-action btn-action__export" onClick={this.export('CSV', true)}>
              Yes
          </button>
          <button className="btn-action btn-action__export" onClick={this.export('CSV')}>
              No
          </button>
          <button className="btn-action btn-action__delete" onClick={this.resetOptions}>
              Cancel
          </button>
        </div>
      );
    default:
      return (
        <div className="user-list__options">
          <button className="btn-action" onClick={importData}>
              Import
          </button>
          <button className="btn-action" onClick={this.chooseExport}>
              Export
          </button>
          {selectedUserIds.length > 0 && (
            <button className="btn-action btn-action__reset" onClick={this.confirmReset}>
              Reset
            </button>)}
          {selectedUserIds.length > 0 && (
            <button className="btn-action btn-action__delete" onClick={this.confirmDelete}>
                Delete
            </button>
          )}
        </div>
      );
    }
  };

  searchUsers = (user) => {
    const {isProfile} = this.props;
    const {searchText} = this.state;
    const text = `${user.firstName}${isProfile ? user.lastName : user.lastName[0]}`;
    return text.toLowerCase().includes(searchText.toLowerCase());
  };

  getFilterBy = (user) => {
    switch (this.state.filterBy) {
    case FILTER_BY_ACTIVE:
      return user.isActive && this.searchUsers(user);
    case FILTER_BY_MANAGERS:
      return user.isManager && this.searchUsers(user);
    case FILTER_BY_VOLUNTEERS:
      return !user.isManager && this.searchUsers(user);
    default:
      return this.searchUsers(user);
    }
  };

  getSortBy = () => {
    if (this.state.filterBy === FILTER_BY_MANAGERS) {
      return sortByName;
    }
    switch (this.state.sortBy) {
    case SORT_BY_ACTIVE:
      return sortByActive;
    case SORT_BY_HOURS:
      return (a, b) => sortByHours(a, b, this.props.selectedHourType);
    case SORT_BY_DATE:
      return sortByDate;
    default:
      return sortByName;
    }
  };

  setFilterBy = (filterBy) => {
    return () => {
      this.setState({filterBy});
    };
  };

  setSortBy = (sortBy) => {
    return () => {
      this.setState({sortBy});
    };
  };

  render() {
    const {filterBy, selectedUserIds, searchText, sortBy} = this.state;
    const {isProfile, selectedHourType, selectedUser, users} = this.props;
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
            {filterBy === FILTER_BY_VOLUNTEERS && (
              <div className="user-list__sort-container">
                <button
                  className={classNames('user-list__sort', {'user-list__sort-active': sortBy === SORT_BY_NAME})}
                  onClick={this.setSortBy(SORT_BY_NAME)}>
                  {`(${sortOptions[SORT_BY_NAME]})`}
                </button>
                <button
                  className={classNames('user-list__sort', {'user-list__sort-active': sortBy === SORT_BY_HOURS})}
                  onClick={this.setSortBy(SORT_BY_HOURS)}>
                  {`(${sortOptions[SORT_BY_HOURS]})`}
                </button>
                <button
                  className={classNames('user-list__sort', {'user-list__sort-active': sortBy === SORT_BY_DATE})}
                  onClick={this.setSortBy(SORT_BY_DATE)}>
                  {`(${sortOptions[SORT_BY_DATE]})`}
                </button>
              </div>
            )}
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
        {isProfile && (
          <div className="user-list__filter-container">
            <button
              className={classNames('user-list__filter', {'user-list__filter-active': filterBy === FILTER_BY_MANAGERS})}
              onClick={this.setFilterBy(FILTER_BY_MANAGERS)}>
              Managers
            </button>
            <button
              className={classNames('user-list__filter', {'user-list__filter-active': filterBy === FILTER_BY_VOLUNTEERS})}
              onClick={this.setFilterBy(FILTER_BY_VOLUNTEERS)}>
              Volunteers
            </button>
          </div>
        )}
        <div className={classNames('user-list__users', {'user-list__users-sign-in': !isProfile}, 'scroll')}>
          {users
            .filter(this.getFilterBy)
            .sort(this.getSortBy())
            .map((user, i) => {
              return (
                <UserItem
                  key={i}
                  isExportSelected={_.includes(selectedUserIds, user.id)}
                  isProfile={isProfile}
                  selectedHourType={selectedHourType}
                  selectedUser={selectedUser}
                  onSelectUser={this.handleSelectUser}
                  onExportSelectUser={this.handleExportSelectUser}
                  onSignout={this.handleSignout}
                  user={user}/>
              );
            })}
          {isProfile &&
            filterBy === FILTER_BY_MANAGERS && (
              <div className="user-list__add-manager-container">
                <Link className="user-list__add-manager" to="/registration/manager">
                  Add Manager
                </Link>
              </div>
            )}
        </div>
        {isProfile && this.getOptions()}
      </div>
    );
  }
}

const mapDispatchToProps = {
  deleteUsers,
  resetUsers,
  onSignout: handleSignOut
};

export default connect(null, mapDispatchToProps)(UserList);
