import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {visitProps} from 'proptypes/user';
import notesImg from 'images/notes.svg';
import notesLightImg from 'images/notes-light.svg';

export default class Visit extends Component {
  static propTypes = {
    isEditing: PropTypes.bool,
    isManager: PropTypes.bool,
    openVisits: PropTypes.arrayOf(PropTypes.shape(visitProps)),
    stopEditing: PropTypes.func,
    toggleOpenVisit: PropTypes.func,
    updateVisit: PropTypes.func,
    visit: PropTypes.shape(visitProps),
    visitIndex: PropTypes.number
  }

  state = {
    hover: false
  }

  handleHoursChange = (e) => {
    const {visit, visitIndex} = this.props;
    visit.hours = parseFloat(e.target.value);
    this.props.updateVisit(visit, visitIndex);
  }

  handleNotesChange = (e) => {
    const {visit, visitIndex} = this.props;
    visit.notes = e.target.value;
    this.props.updateVisit(visit, visitIndex);
  }

  toggleHover = () => {
    this.setState({hover: !this.state.hover});
  }

  showNotes = () => {
    const {isEditing, toggleOpenVisit, openVisits, visit} = this.props;
    if (isEditing) {
      if (!_.includes(openVisits, visit)) {
        toggleOpenVisit(visit);
      }
    } else {
      toggleOpenVisit(visit);
    }
  }

  hideNotes = () => {
    const {stopEditing, toggleOpenVisit, visit} = this.props;
    setTimeout(() => {
      if (this) {
        stopEditing();
        toggleOpenVisit(visit);
      }
    }, 200);
  }

  render() {
    const {isEditing, isManager, openVisits, visit} = this.props;
    const {hover} = this.state;
    const isOpen = _.includes(openVisits, visit);

    return (
      <div className="visit">
        <div className="visit-header">
          <div className="visit-item">{moment.unix(visit.timeIn).format('MM/DD/YYYY')}</div>
          <div className="visit-item">{moment.unix(visit.timeIn).format('h:mm a')}</div>
          <div className="visit-item">{visit.timeOut === 0 ? '-' : moment.unix(visit.timeOut).format('h:mm a')}</div>
          {isEditing && isManager
            ? <input
              type="number"
              className="visit-item visit-hours"
              onChange={this.handleHoursChange}
              value={visit.hours} />
            : <div className="visit-item">{visit.hours}</div>
          }
          <div className="visit-item__notes">
            <button
              className="visit-notes__btn"
              onClick={this.showNotes}
              onMouseEnter={this.toggleHover}
              onMouseLeave={this.toggleHover}>
              <img alt="notes" className="visit-notes__img" src={(hover || isOpen) ? notesImg : notesLightImg} />
            </button>
          </div>
        </div>
        {isOpen && (isEditing
          ? <textarea
            autoFocus={true}
            className="visit-notes__input scroll"
            onBlur={this.hideNotes}
            onChange={this.handleNotesChange}
            value={_.isEmpty(visit.notes) ? '-' : visit.notes} />
          : <div className="visit-notes__text">{_.isEmpty(visit.notes) ? '-' : visit.notes}</div>)
        }
      </div>
    );
  }
}
