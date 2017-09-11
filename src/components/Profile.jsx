import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {updateUser} from 'actions/app';
import {getHoursDifference, getTotalHours, isUsernameUnique} from 'utils/helpers';
import {history} from 'utils/store';
import Bike from 'components/Bike.jsx';
import PersonalInfo from 'components/PersonalInfo.jsx';
import UserList from 'components/UserList.jsx';
import Visit from 'components/Visit.jsx';
import {userProps} from 'proptypes/user';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';
import addImg from 'images/add.svg';

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
      addressCity: user.addressCity,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      addressState: user.addressState,
      addressZip: user.addressZip,
      bikesEarned: user.bikesEarned,
      confirmNewPin: '',
      countryOfOrigin: user.countryOfOrigin,
      dobDay: user.dobDay,
      dobMonth: user.dobMonth,
      dobYear: user.dobYear,
      email: user.email,
      emailList: user.emailList,
      errors: {},
      firstName: user.firstName,
      hover: false,
      id: user.id,
      isActive: user.isActive,
      isEditing: false,
      isInterestedManager: user.isInterestedManager,
      isManager: user.isManager,
      lastName: user.lastName,
      newPin: '',
      oldPin: '',
      oldUsername: user.username,
      openVisits: [],
      parentName: user.parentName,
      parentPhone: user.parentPhone,
      phone: user.phone,
      pin: user.pin,
      questionOne: user.questionOne,
      questionTwo: user.questionTwo,
      username: user.username,
      view: 'personal',
      visits: user.visits,
      waiver: user.waiver
    };
  }

  componentWillMount() {
    const {user} = this.props;
    if (!user.isActive) {
      history.push('/');
    }
  }

  handleChange = (field, value) => {
    this.setState({[field]: value});
  };

  handleUpdateVisit = (visit, visitIndex) => {
    const {visits} = this.state;
    visits[visitIndex] = visit;
    this.setState({visits});
  };

  handleNotesChange = (e) => {
    const {visits} = this.state;
    const visit = visits[0];
    visit.notes = e.target.value;
    this.props.updateUser(this.getUpdatedUser(true));
  };

  handleToggleOpenVisit = (visit) => {
    const {openVisits} = this.state;
    if (_.includes(openVisits, visit)) {
      _.remove(openVisits, visit);
    } else {
      openVisits.push(visit);
    }
    this.setState({openVisits});
  };

  handleAddBike = () => {
    const {bikesEarned} = this.state;
    bikesEarned.push({
      date: moment().format('MM/DD/YYYY'),
      description: ''
    });
    this.setState({bikesEarned});
  };

  handleRemoveBike = (index) => {
    const {bikesEarned} = this.state;
    bikesEarned.splice(index, 1);
    this.setState({bikesEarned});
    this.props.updateUser(this.getUpdatedUser(true));
  };

  handleUpdateBike = (index, bike) => {
    const {bikesEarned} = this.state;
    bikesEarned[index] = bike;
    this.setState({bikesEarned});
    this.props.updateUser(this.getUpdatedUser(true));
  };

  getTotalHours = () => {
    return getTotalHours(this.state.visits);
  };

  getUpdatedUser = (isSave) => {
    const {confirmNewPin, newPin, oldPin} = this.state;
    const updatedUser = _.omit(this.state, ['confirmNewPin', 'errors', 'hover', 'newPin', 'oldPin', 'openVisits', 'view']);

    if (isSave) {
      if (!_.isEmpty(newPin)) {
        updatedUser.pin = newPin;
      }
    } else {
      updatedUser.oldPin = oldPin;
      updatedUser.newPin = newPin;
      updatedUser.confirmNewPin = confirmNewPin;
    }

    return updatedUser;
  };

  setSelectedUser = (user) => {
    this.setState({
      addressCity: user.addressCity,
      addressLine1: user.addressLine1,
      addressLine2: user.addressLine2,
      addressState: user.addressState,
      addressZip: user.addressZip,
      bikesEarned: user.bikesEarned,
      confirmNewPin: '',
      countryOfOrigin: user.countryOfOrigin,
      dobDay: user.dobDay,
      dobMonth: user.dobMonth,
      dobYear: user.dobYear,
      email: user.email,
      emailList: user.emailList,
      errors: {},
      firstName: user.firstName,
      hover: false,
      id: user.id,
      isActive: user.isActive,
      isEditing: false,
      isInterestedManager: user.isInterestedManager,
      isManager: user.isManager,
      lastName: user.lastName,
      newPin: '',
      oldPin: '',
      oldUsername: user.username,
      openVisits: [],
      parentName: user.parentName,
      parentPhone: user.parentPhone,
      phone: user.phone,
      pin: user.pin,
      questionOne: user.questionOne,
      questionTwo: user.questionTwo,
      username: user.username,
      view: 'personal',
      visits: user.visits,
      waiver: user.waiver
    });
  };

  setView = (view) => {
    return () => {
      this.setState({view, isEditing: false});
    };
  };

  setUsernameChanged = () => {
    this.setState({usernameChanged: true});
  };

  stopEditing = () => {
    const {openVisits} = this.state;
    if (_.isEmpty(openVisits)) {
      this.setState({isEditing: false});
    }
  };

  toggleEditing = () => {
    const {isEditing} = this.state;

    if (isEditing) {
      if (this.validate()) {
        this.props.updateUser(this.getUpdatedUser(true));
        this.setState({isEditing: false, oldPin: '', newPin: '', confirmNewPin: ''});
      }
    } else {
      this.setState({isEditing: true});
    }
  };

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  };

  validate = () => {
    const {user, users} = this.props;
    const errors = {};
    const {
      addressCity,
      addressLine1,
      addressState,
      addressZip,
      confirmNewPin,
      countryOfOrigin,
      dobDay,
      dobMonth,
      dobYear,
      email,
      firstName,
      lastName,
      newPin,
      oldPin,
      oldUsername,
      parentName,
      parentPhone,
      phone,
      username
    } = this.state;
    const hasPinError = _.isEmpty(newPin) ? false : (user.isManager ? false : user.pin !== oldPin) || newPin !== confirmNewPin;

    errors.addressLine1 = _.isEmpty(addressLine1);
    errors.addressCity = _.isEmpty(addressCity);
    errors.addressState = _.isEmpty(addressState);
    errors.addressZip = _.isEmpty(addressZip);
    errors.countryOfOrigin = _.isEmpty(countryOfOrigin);
    errors.firstName = _.isEmpty(firstName);
    errors.lastName = _.isEmpty(lastName);
    errors.dobMonth = _.isEmpty(dobMonth);
    errors.dobDay = _.isEmpty(dobDay);
    errors.dobYear = _.isEmpty(dobYear);
    errors.email = _.isEmpty(email);
    errors.parentName = _.isEmpty(user.parentName) ? false : _.isEmpty(parentName);
    errors.parentPhone = _.isEmpty(user.parentName) ? false : _.isEmpty(parentPhone);
    errors.phone = _.isEmpty(phone);
    errors.username = _.isEmpty(username);
    errors.usernameNotUnique = username !== oldUsername && !isUsernameUnique(users, username);
    errors.oldPin = hasPinError;
    errors.newPin = hasPinError;
    errors.confirmNewPin = hasPinError;

    this.setState({errors});
    return !_.some(errors, (error) => error);
  };

  render() {
    const {user, users} = this.props;
    const {
      bikesEarned,
      errors,
      emailList,
      hasNotesError,
      hover,
      isEditing,
      isManager,
      openVisits,
      questionOne,
      questionTwo,
      isInterestedManager,
      idsToExport,
      view,
      visits
    } = this.state;
    const totalHours = this.getTotalHours();

    return (
      <div className="profile">
        <div className="profile-header">
          <Link className="btn-forward" to="/" onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
            <img alt="Sign In" className="profile-back flip-x" src={hover ? bicycleForwardGif : bicycleForwardImg} />
            <div className="btn-help btn-help__back">Back</div>
          </Link>
          <div className="profile-title">{user.isManager ? 'Volunteer Info' : 'My Info'}</div>
          {_.includes(['personal', 'visits'], view) ? (
            <button className="btn-action" onClick={this.toggleEditing}>
              {isEditing ? 'Save' : 'Edit'}
            </button>
          ) : (
            <div className="btn-placeholder" />
          )}
        </div>
        <div className="profile-content">
          {user.isManager ? (
            <UserList
              users={users}
              idsToExport={idsToExport}
              selectedUser={this.getUpdatedUser()}
              isProfile={true}
              onSelectUser={this.setSelectedUser}
              onMultiSelectUser={this.setMultiSelectUser}/>
          ) : (
            <div className="profile-content__left">
              <div className={classNames('profile-current-hours', {'user-name__profile-over-ten': totalHours >= 10})}>
                <span className={classNames('profile-total-hours', {'user-name__profile-over-ten': totalHours >= 10})}>
                  {totalHours}
                </span>&nbsp;/ 10 hours
              </div>
              <div className="profile-today">
                <div className="profile-today-header">Today</div>
                <div className="profile-today-time">
                  <div>Time in: </div>
                  <div>{moment.unix(user.visits[0].timeIn).format('h:mm a')}</div>
                </div>
                <div className="profile-today-time">
                  <div>Hours added: </div>
                  <div>+{getHoursDifference(moment.unix(user.visits[0].timeIn), moment())}</div>
                </div>
                <div className="profile-today-notes">
                  Notes:
                  <textarea
                    autoFocus={true}
                    className={classNames('profile-today-notes__input', {'input-error': hasNotesError})}
                    onChange={this.handleNotesChange}
                    value={user.visits[0].notes}/>
                </div>
              </div>
            </div>
          )}
          <div className={classNames('profile-content__right', {'profile-content__right-manager': user.isManager})}>
            {!isManager && (
              <div className="profile-options">
                <button
                  className={classNames(
                    {'profile-option': !isManager},
                    {'profile-option__no-hover': isManager},
                    {'profile-option__active': !isManager && view === 'personal'}
                  )}
                  onClick={this.setView('personal')}>
                  Personal Info
                </button>
                {!isManager && (
                  <button
                    className={classNames('profile-option', {'profile-option__active': view === 'visits'})}
                    onClick={this.setView('visits')}>
                    Past Visits
                  </button>
                )}
                {!isManager && (
                  <button
                    className={classNames('profile-option', {'profile-option__active': view === 'bikes'})}
                    onClick={this.setView('bikes')}>
                    Bikes Earned
                  </button>
                )}
                {!isManager &&
                user.isManager && (
                    <button
                      className={classNames('profile-option', {'profile-option__active': view === 'questions'})}
                      onClick={this.setView('questions')}>
                    Questions
                    </button>
                  )}
              </div>
            )}
            {view === 'personal' && (
              <PersonalInfo
                errors={errors}
                isEditing={isEditing}
                isManager={user.isManager}
                user={this.getUpdatedUser()}
                onChange={this.handleChange}
                onSubmit={this.toggleEditing}/>
            )}
            {view === 'visits' && (
              <div className="visit-container scroll">
                <div className="visit-header">
                  <div className="visit-item visit-item__container">Date</div>
                  <div className="visit-item visit-item__container">Time In</div>
                  <div className="visit-item visit-item__container">Time Out</div>
                  <div className="visit-item visit-item__container">Hours</div>
                  <div className="visit-item visit-item__notes" />
                </div>
                {visits.map((visit, index) => {
                  return (
                    (user.isManager ? true : index > 0) && (
                      <Visit
                        key={index}
                        isEditing={isEditing}
                        isManager={user.isManager}
                        openVisits={openVisits}
                        stopEditing={this.stopEditing}
                        toggleOpenVisit={this.handleToggleOpenVisit}
                        visit={visit}
                        updateVisit={this.handleUpdateVisit}
                        visitIndex={index}/>
                    )
                  );
                })}
              </div>
            )}
            {view === 'bikes' && (
              <div className="bike__container scroll">
                {_.isEmpty(bikesEarned) ? (
                  <div className="bike-none">{`${user.isManager ? 'This volunteer has' : 'You have'} not earned any bikes yet.`}</div>
                ) : (
                  <div>
                    {bikesEarned.map((bike, index) => {
                      return (
                        <Bike
                          key={index}
                          bike={bike}
                          index={index}
                          isManager={user.isManager}
                          onRemoveBike={this.handleRemoveBike}
                          onUpdateBike={this.handleUpdateBike}/>
                      );
                    })}
                  </div>
                )}
                {user.isManager && (
                  <button className="bike-add" onClick={this.handleAddBike}>
                    <img alt="add" src={addImg} />
                  </button>
                )}
              </div>
            )}
            {view === 'questions' && (
              <div className="profile-question__container scroll">
                <div className="profile-question">1. How did you find out about Earn-A-Bike?</div>
                <div className="profile-answer">{questionOne}</div>
                <div className="profile-question">2. What brings you to Earn-A-Bike?</div>
                <div className="profile-answer">{questionTwo}</div>
                <div className="profile-question">3. Would you like to be added to the volunteer email list?</div>
                <div className="profile-answer">{emailList ? 'Yes' : 'No'}</div>
                <div className="profile-question">4. Are you interested in becoming a shop manager?</div>
                <div className="profile-answer">{isInterestedManager ? 'Yes' : 'No'}</div>
              </div>
            )}
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
  }
)(Profile);
