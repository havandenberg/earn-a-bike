import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {userProps, visitProps} from 'proptypes/user';
import Visit from 'components/Visit.jsx';

export default class Visits extends Component {
  static propTypes = {
    isManager: PropTypes.bool,
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps),
    visits: PropTypes.arrayOf(PropTypes.shape(visitProps))
  };

  state = {
    isEditing: false,
    openVisits: []
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

  handleUpdateVisit = (visit, visitIndex) => {
    const {visits} = this.props;
    visits[visitIndex] = visit;
    this.setState({visits});
    this.props.updateUser({...this.props.user, visits});
  };

  toggleEditing = () => {
    const {isEditing} = this.state;
    this.setState({isEditing: !isEditing});
  };

  render() {
    const {isManager, user, visits} = this.props;
    const {isEditing, openVisits} = this.state;

    return (
      <div className="visit-container">
        <div className="visit-header visit-header__labels">
          <div className="visit-item visit-item__container">Date</div>
          <div className="visit-item visit-item__container">Time In</div>
          <div className="visit-item visit-item__container">Time Out</div>
          <div className="visit-item visit-item__container">Hours</div>
          <div className="visit-item visit-item__notes" />
        </div>
        <div className="visit-container__inner scroll">
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
        {isManager && (
          <button className="personal-info__edit btn-action" onClick={this.toggleEditing}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
        )}
      </div>
    );
  }
}
