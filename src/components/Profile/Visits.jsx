import classNames from 'classnames';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {userProps, visitProps} from 'proptypes/user';
import Visit from 'components/Visit.jsx';

export default class Visits extends Component {
  static propTypes = {
    isManager: PropTypes.bool,
    selectedHourType: PropTypes.string,
    setSelectedHourType: PropTypes.func,
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps),
    visits: PropTypes.arrayOf(PropTypes.shape(visitProps))
  };

  constructor(props) {
    super(props);
    const {user} = props;

    this.state = {
      isEditing: false,
      openVisits: [],
      visits: user.visits
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.user, this.props.user)) {
      this.setState({visits: nextProps.user.visits, isEditing: false, openVisits: []});
    }
  }

  handleToggleOpenVisit = (visit) => {
    const {openVisits} = this.state;
    if (_.includes(openVisits, visit)) {
      _.remove(openVisits, visit);
    } else {
      openVisits.push(visit);
    }
    this.setState({openVisits});
  };

  handleUpdateVisit = (visit, visitIndex) => {
    const {visits} = this.props;
    visits[visitIndex] = visit;
    this.setState({visits});
  };

  setSelectedHourType = (hourType) => {
    return () => {
      this.props.setSelectedHourType(hourType);
    };
  }

  toggleEditing = () => {
    const {isEditing, visits} = this.state;

    if (isEditing) {
      const updatedUser = {...this.props.user, visits};
      this.props.updateUser(updatedUser);
      this.setState({isEditing: false});
    } else {
      this.setState({isEditing: true});
    }
  };

  render() {
    const {isManager, selectedHourType, setSelectedHourType} = this.props;
    const {isEditing, openVisits, visits} = this.state;

    return (
      <div className="visit-container">
        <div className="visit-header visit-header__labels">
          <div className="visit-item visit-item__container">Date</div>
          <div className="visit-item visit-item__container">Time In</div>
          <div className="visit-item visit-item__container">Time Out</div>
          <div className={classNames(
            'visit-action visit-item visit-item__container',
            {'visit-action__active': !_.isEmpty(selectedHourType)}
          )} onClick={this.setSelectedHourType('')}>Type</div>
          <div className="visit-item visit-item__container">Hours</div>
          <div className="visit-item visit-item__notes" />
        </div>
        <div className="visit-container__inner scroll">
          {visits.map((visit, index) => {
            return (
              (isManager || index > 0 || !_.isEmpty(selectedHourType)) && (
                <Visit
                  key={index}
                  isEditing={isEditing}
                  isManager={isManager}
                  openVisits={openVisits}
                  selectedHourType={selectedHourType}
                  setSelectedHourType={setSelectedHourType}
                  stopEditing={this.stopEditing}
                  toggleOpenVisit={this.handleToggleOpenVisit}
                  visit={visit}
                  updateVisit={this.handleUpdateVisit}
                  visitIndex={index}/>
              )
            );
          })}
        </div>
        {isManager && (
          <button className="personal-info__edit btn-action" onClick={this.toggleEditing}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
        )}
      </div>
    );
  }
}
