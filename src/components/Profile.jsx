import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {updateUser} from 'actions/app';
import {getHoursDifference, getTotalHours} from 'utils/helpers';
import {history} from 'utils/store';
import PersonalInfo from 'components/PersonalInfo.jsx';
import UserList from 'components/UserList.jsx';
import Visit from 'components/Visit.jsx';
import {userProps} from 'proptypes/user';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';

class Profile extends Component {
  static propTypes = {
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps),
    users: PropTypes.arrayOf(PropTypes.shape(userProps))
  }

  constructor(props) {
    super(props);

    const {user} = props;

    this.state = {
      selectedUser: user,
      errors: [],
      hover: false,
      isEditing: false,
      firstName: user.firstName,
      lastName: user.lastName,
      month: user.dateOfBirth.month,
      day: user.dateOfBirth.day,
      year: user.dateOfBirth.year,
      email: user.email,
      phone: user.phone,
      parentName: user.parentName,
      parentPhone: user.parentPhone,
      streetLine1: user.address.streetLine1,
      streetLine2: user.address.streetLine2,
      city: user.address.city,
      state: user.address.state,
      zip: user.address.zip,
      oldPin: '',
      newPin: '',
      confirmNewPin: '',
      visits: user.visits,
      view: 'personal',
      openVisits: []
    };
  }

  componentWillMount() {
    const {user} = this.props;
    if (!user.isActive) {history.push('/');}
  }

  handleChange = (field, value) => {
    this.setState({[field]: value});
  }

  handleUpdateVisit = (visit, visitIndex) => {
    const {visits} = this.state;
    visits[visitIndex] = visit;
    this.setState({visits});
  }

  handleNotesChange = (e) => {
    const {selectedUser} = this.state;
    const visit = selectedUser.visits[0];
    visit.notes = e.target.value;
    this.props.updateUser(selectedUser);
  }

  handleSelectVisit = (visitIndex) => {
    this.setState({visitIndex});
  }

  handleToggleOpenVisit = (visit) => {
    const {openVisits} = this.state;
    if (_.includes(openVisits, visit)) {
      _.remove(openVisits, visit);
    } else {
      openVisits.push(visit);
    }
    this.setState({openVisits});
  }

  getTotalHours = () => {
    return getTotalHours(this.state.selectedUser);
  }

  getUpdatedUser = (isSave) => {
    const newUser = {};

    _.each(['firstName', 'lastName', 'email', 'phone', 'parentName', 'parentPhone', 'visits'], (key) => {
      newUser[key] = this.state[key];
    });

    newUser.dateOfBirth = {
      month: this.state.month,
      day: this.state.day,
      year: this.state.year
    };

    newUser.address = {
      streetLine1: this.state.streetLine1,
      streetLine2: this.state.streetLine2,
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip
    };

    if (isSave) {
      newUser.pin = this.state.newPin;
    } else {
      newUser.oldPin = this.state.oldPin;
      newUser.newPin = this.state.newPin;
      newUser.confirmNewPin = this.state.confirmNewPin;
    }

    return newUser;
  }

  setSelectedUser = (selectedUser) => {
    this.setState({
      selectedUser,
      isEditing: false,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      month: selectedUser.dateOfBirth.month,
      day: selectedUser.dateOfBirth.day,
      year: selectedUser.dateOfBirth.year,
      email: selectedUser.email,
      phone: selectedUser.phone,
      parentName: selectedUser.parentName,
      parentPhone: selectedUser.parentPhone,
      streetLine1: selectedUser.address.streetLine1,
      streetLine2: selectedUser.address.streetLine2,
      city: selectedUser.address.city,
      state: selectedUser.address.state,
      zip: selectedUser.address.zip,
      oldPin: '',
      newPin: '',
      confirmNewPin: '',
      visits: selectedUser.visits,
      view: 'personal'
    });
  }

  setView = (view) => {
    return (e) => {
      e.preventDefault();
      this.setState({view});
    };
  }

  stopEditing = () => {
    const {openVisits} = this.state;
    if (_.isEmpty(openVisits)) {
      this.setState({isEditing: false});
    }
  }

  toggleEditing = () => {
    const {isEditing, selectedUser, newPin} = this.state;

    if (isEditing) {
      if (this.validate()) {
        const newUser = {
          ...selectedUser,
          ...this.getUpdatedUser(true),
          pin: _.isEmpty(newPin) ? selectedUser.pin : newPin
        };
        this.props.updateUser(newUser);
        this.setState({isEditing: false, oldPin: '', newPin: '', confirmNewPin: '', selectedUser: newUser});
      }
    } else {
      this.setState({isEditing: true});
    }
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  }

  validate = () => {
    const {user} = this.props;
    const errors = [];
    const {
      firstName,
      lastName,
      month,
      day,
      year,
      email,
      phone,
      parentName,
      parentPhone,
      streetLine1,
      city,
      state,
      zip,
      oldPin,
      newPin,
      confirmNewPin
    } = this.state;

    if (_.isEmpty(firstName)) {
      errors.push('firstName');
    }
    if (_.isEmpty(lastName)) {
      errors.push('lastName');
    }
    if (_.isEmpty(month)) {
      errors.push('month');
    }
    if (_.isEmpty(day)) {
      errors.push('day');
    }
    if (_.isEmpty(year)) {
      errors.push('year');
    }
    if (_.isEmpty(email)) {
      errors.push('email');
    }
    if (_.isEmpty(phone)) {
      errors.push('phone');
    }
    if (!_.isEmpty(user.parentName)) {
      if (_.isEmpty(parentName)) {
        errors.push('parentName');
      }
      if (_.isEmpty(parentPhone)) {
        errors.push('parentPhone');
      }
    }
    if (_.isEmpty(streetLine1)) {
      errors.push('streetLine1');
    }
    if (_.isEmpty(city)) {
      errors.push('city');
    }
    if (_.isEmpty(state)) {
      errors.push('state');
    }
    if (_.isEmpty(zip)) {
      errors.push('zip');
    }
    if (!_.isEmpty(oldPin) || !_.isEmpty(newPin) || !_.isEmpty(confirmNewPin)) {
      if (user.isManager ? false : _.isEmpty(oldPin)) {
        errors.push('oldPin');
      }
      if (_.isEmpty(newPin)) {
        errors.push('newPin');
      }
      if (_.isEmpty(confirmNewPin)) {
        errors.push('confirmNewPin');
      }
      if (user.isManager ? false : (!_.isEmpty(oldPin) && oldPin !== user.pin)) {
        errors.push('oldPin');
      }
      if (!_.isEmpty(newPin) && !_.isEmpty(confirmNewPin) && newPin !== confirmNewPin) {
        errors.push('newPin');
        errors.push('confirmNewPin');
      }
    }

    this.setState({errors});
    return !errors.length;
  }

  render() {
    const {user, users} = this.props;
    const {
      errors,
      hover,
      isEditing,
      openVisits,
      selectedUser,
      idsToExport,
      view,
      visits
    } = this.state;
    const totalHours = this.getTotalHours();

    return (
      <div className="profile">
        <div className="profile-header">
          <Link
            className="btn-forward"
            to="/"
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}>
            <img alt="Sign In" className="profile-back flip-x" src={hover ? bicycleForwardGif : bicycleForwardImg} />
            <div className="btn-help btn-help__back">Back</div>
          </Link>
          <div className="profile-title">{user.isManager ? 'Volunteer Info' : 'My Info'}</div>
          <button
            className="btn-action"
            onClick={this.toggleEditing}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="profile-content">
          {user.isManager
            ? <UserList
              users={users}
              idsToExport={idsToExport}
              selectedUser={selectedUser}
              isProfile={true}
              onSelectUser={this.setSelectedUser}
              onMultiSelectUser={this.setMultiSelectUser} />
            : <div className="profile-content__left">
              <div className={classNames(
                'profile-current-hours',
                {'user-name__profile-over-ten': totalHours >= 10}
              )}>
                <span className={classNames(
                  'profile-total-hours',
                  {'user-name__profile-over-ten': totalHours >= 10}
                )}>{totalHours}</span>&nbsp;/ 10 hours
              </div>
              <div className="profile-today">
                <div className="profile-today-header">Today</div>
                <div className="profile-today-time">
                  <div>Signed In: </div>
                  <div>{moment.unix(user.visits[0].timeIn).format('h:mm a')}</div>
                </div>
                <div className="profile-today-time">
                  <div>Current Hours: </div>
                  <div>+{getHoursDifference(moment.unix(user.visits[0].timeIn), moment())}</div>
                </div>
                <div className="profile-today-notes">
                  Notes:
                  <textarea
                    autoFocus={true}
                    className="profile-today-notes__input"
                    onChange={this.handleNotesChange}
                    value={user.visits[0].notes} />
                </div>
              </div>
            </div>
          }
          <div className={classNames('profile-content__right', {'profile-content__right-manager': user.isManager})}>
            <div className="profile-options">
              <button className={classNames(
                {'profile-option': !selectedUser.isManager},
                {'profile-option__no-hover': selectedUser.isManager},
                {'profile-option__active': !selectedUser.isManager && view === 'personal'}
              )} onClick={this.setView('personal')}>Personal Info</button>
              {!selectedUser.isManager &&
                <button className={classNames(
                  'profile-option',
                  {'profile-option__active': view === 'visits'}
                )} onClick={this.setView('visits')}>Past Visits</button>
              }
              {!selectedUser.isManager &&
                <button className={classNames(
                  'profile-option',
                  {'profile-option__active': view === 'questions'}
                )} onClick={this.setView('questions')}>Questions</button>
              }
            </div>
            {view === 'personal' && <PersonalInfo
              errors={errors}
              isEditing={isEditing}
              isManager={user.isManager}
              user={this.getUpdatedUser()}
              onChange={this.handleChange}
              onSubmit={this.toggleEditing} />
            }
            {view === 'visits' &&
              <div className="visit-container scroll">
                <div className="visit-header">
                  <div className="visit-item visit-item__container">Date</div>
                  <div className="visit-item visit-item__container">Time In</div>
                  <div className="visit-item visit-item__container">Time Out</div>
                  <div className="visit-item visit-item__container">Hours</div>
                  <div className="visit-item visit-item__notes"></div>
                </div>
                {visits.map((visit, index) => {
                  return (user.isManager ? true : index > 0) &&
                    <Visit
                      key={index}
                      isEditing={isEditing}
                      isManager={user.isManager}
                      openVisits={openVisits}
                      stopEditing={this.stopEditing}
                      toggleOpenVisit={this.handleToggleOpenVisit}
                      visit={visit}
                      updateVisit={this.handleUpdateVisit}
                      visitIndex={index} />;
                })}
              </div>
            }
            {view === 'questions' &&
              <div className="profile-question__container scroll">
                <div className="profile-question">1. How did you find out about Earn-A-Bike?</div>
                <div className="profile-answer">{selectedUser.questionOne}</div>
                <div className="profile-question">2. What brings you to Earn-A-Bike?</div>
                <div className="profile-answer">{selectedUser.questionTwo}</div>
                <div className="profile-question">3. Would you like to be added to the volunteer email list?</div>
                <div className="profile-answer">{selectedUser.emailList ? 'Yes' : 'No'}</div>
                <div className="profile-question">4. Are you interested in becoming a shop manager?</div>
                <div className="profile-answer">{selectedUser.isInterestedManager ? 'Yes' : 'No'}</div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({app}, ownProps) => {
  const users = app.get('users').toJS();
  const user = _.find(users, (u) => {
    return u.id === parseInt(ownProps.match.params.userid, 10);
  });

  return {
    user,
    users
  };
}, {
  updateUser
})(Profile);
