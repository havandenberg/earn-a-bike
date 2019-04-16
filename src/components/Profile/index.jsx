import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {updateUser} from 'actions/app';
import {history} from 'utils/store';
import Bikes from 'components/Profile/Bikes.jsx';
import PersonalInfo from 'components/Profile/PersonalInfo.jsx';
import Questions from 'components/Profile/Questions.jsx';
import UserInfo from 'components/Profile/UserInfo.jsx';
import Visits from 'components/Profile/Visits.jsx';
import UserList from 'components/UserList.jsx';
import BicycleBtn from 'components/BicycleBtn.jsx';
import {userProps} from 'proptypes/user';

class Profile extends Component {
  static propTypes = {
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps),
    users: PropTypes.arrayOf(PropTypes.shape(userProps))
  };

  constructor(props) {
    super(props);

    const {user} = props;

    this.state = {
      errors: {},
      selectedHourType: '',
      selectedUser: user,
      view: 'personal'
    };
  }

  componentWillMount() {
    const {user} = this.props;
    if (!user.isActive) {
      history.push('/');
    }
  }

  handleBack = () => {
    history.push('/');
  };

  setSelectedHourType = (hourType) => {
    this.setState({
      selectedHourType: hourType
    });
  };

  setSelectedUser = (user) => {
    const {selectedUser, view} = this.state;
    const resetView = user.isManager && !selectedUser.isManager && (view === 'bikes' || view === 'questions');
    this.setState({
      selectedUser: user,
      view: resetView ? 'personal' : view
    });
  };

  setView = (view) => {
    return () => {
      this.setState({view});
    };
  };

  render() {
    const {user, users} = this.props;
    const {idsToExport, selectedHourType, selectedUser, view} = this.state;

    return (
      <div className="profile">
        <div className="profile-header">
          <BicycleBtn onClick={this.handleBack} isReverse={true} />
          <div className="profile-title">{user.isManager ? 'Volunteer Info' : 'My Info'}</div>
          <div className="btn-placeholder" />
        </div>
        <div className="profile-content">
          {user.isManager ? (
            <UserList
              users={users}
              idsToExport={idsToExport}
              selectedHourType={selectedHourType}
              selectedUser={selectedUser}
              isProfile={true}
              onSelectUser={this.setSelectedUser}
              onMultiSelectUser={this.setMultiSelectUser}/>
          ) : (
            <UserInfo selectedUser={selectedUser} selectedHourType={selectedHourType} updateUser={this.props.updateUser} />
          )}
          <div className={classNames('profile-content__right', {'profile-content__right-manager': user.isManager})}>
            <div className="user-name__profile-active">{selectedUser.firstName}{' '}{selectedUser.lastName}</div>
            <div className="profile-options">
              <button
                className={classNames('profile-option', {'profile-option__active': view === 'personal'})}
                onClick={this.setView('personal')}>
                Personal Info
              </button>
              <button
                className={classNames('profile-option', {'profile-option__active': view === 'visits'})}
                onClick={this.setView('visits')}>
                Past Visits
              </button>
              {!selectedUser.isManager && (
                <button
                  className={classNames('profile-option', {'profile-option__active': view === 'bikes'})}
                  onClick={this.setView('bikes')}>
                  Bikes Earned
                </button>
              )}
              {!selectedUser.isManager &&
                user.isManager && (
                  <button
                    className={classNames('profile-option', {'profile-option__active': view === 'questions'})}
                    onClick={this.setView('questions')}>
                    Questions
                  </button>
                )}
            </div>
            {view === 'personal' && (
              <PersonalInfo isManager={user.isManager} user={selectedUser} users={this.props.users} updateUser={this.props.updateUser} />
            )}
            {view === 'visits' && (
              <Visits
                isManager={user.isManager}
                selectedHourType={selectedHourType}
                setSelectedHourType={this.setSelectedHourType}
                updateUser={this.props.updateUser}
                user={selectedUser}
                visits={selectedUser.visits} />
            )}
            {view === 'bikes' && <Bikes selectedUser={selectedUser} user={user} updateUser={this.props.updateUser} />}
            {view === 'questions' && <Questions selectedUser={selectedUser} />}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  ({app}, ownProps) => {
    const users = app.get('users').toJS();
    const user = _.find(users, (u) => {
      return u.id === parseInt(ownProps.match.params.userid, 10);
    });

    return {
      user,
      users
    };
  },
  {
    updateUser
  },
)(Profile);
