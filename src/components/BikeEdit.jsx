import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import bikeProps from 'proptypes/bike';
import userProps from 'proptypes/user';
import checkImg from 'images/check.svg';

export default class BikeEdit extends Component {
  static propTypes = {
    bike: PropTypes.shape(bikeProps),
    index: PropTypes.number,
    toggleEditing: PropTypes.func,
    user: PropTypes.shape(userProps),
    onRemoveBike: PropTypes.func,
    onUpdateBike: PropTypes.func
  };

  state = {
    hasError: false
  }

  handleCheckboxChange = (itemIndex) => {
    return () => {
      const {bike, index, onUpdateBike} = this.props;
      if (!bike.isSignedOff) {
        bike.checklist[itemIndex].value = !bike.checklist[itemIndex].value;
        onUpdateBike(index, bike);
      }
    };
  };

  handleClose = () => {
    const {bike, toggleEditing} = this.props;
    if (!_.isEmpty(bike.description)) {
      toggleEditing();
    } else {
      this.refs.description.focus();
      this.setState({hasError: true});
    }
  }

  handleDescriptionChange = (e) => {
    const {bike, index, onUpdateBike} = this.props;
    bike.description = e.target.value;
    onUpdateBike(index, bike);
    this.setState({hasError: false});
  };

  handleDetailsChange = (e) => {
    const {bike, index, onUpdateBike} = this.props;
    bike.details = e.target.value;
    onUpdateBike(index, bike);
  };

  handleRemove = () => {
    this.props.onRemoveBike(this.props.index);
  };

  handleRemoveSignoff = () => {
    const {bike, index, onUpdateBike} = this.props;
    bike.isSignedOff = false;
    bike.signedOffBy = '';
    onUpdateBike(index, bike);
  }

  handleSignoff = () => {
    const {bike, index, user, onUpdateBike} = this.props;
    bike.isSignedOff = true;
    bike.signedOffBy = `${user.firstName} ${user.lastName}`;
    onUpdateBike(index, bike);
  }

  isBikeReady = () => {
    return _.every(this.props.bike.checklist, (item) => item.value);
  }

  render() {
    const {bike, user} = this.props;
    const {hasError} = this.state;
    const isReady = this.isBikeReady();

    return (
      <div className="bike-edit__background">
        <div className="bike-edit__container scroll">
          <div className="bike-edit__header">
            <div className={classNames('bike-status__indicator', {'bike-status__success': bike.isSignedOff})} />
            <div className="bike-edit__date">{`${bike.date} -`}&nbsp;</div>
            <input
              autoFocus={true}
              type="text"
              className={classNames('bike-edit__description', {'bike-edit__error': hasError})}
              onChange={this.handleDescriptionChange}
              placeholder="description (required)"
              ref="description"
              value={bike.description}/>
          </div>
          <textarea
            className="bike-edit__details"
            placeholder="bike details - e.g. with custom handlebars"
            onChange={this.handleDetailsChange}
            value={bike.details} />
          {!user.isManager &&
            <div className="bike-edit__prompt">
              Complete this checklist <strong>before</strong> requesting a sign off from a manager:
            </div>
          }
          <div className="bike-edit__checklist">
            {bike.checklist.map((item, index) => {
              return <div key={index} className="bike-edit__checkbox">
                <button
                  className="checkbox"
                  onClick={this.handleCheckboxChange(index)}>
                  {item.value && <img alt="Check" src={checkImg} />}
                </button>
                <button
                  className="bike-edit__checkbox-text"
                  onClick={this.handleCheckboxChange(index)}>
                  {item.text}
                </button>
              </div>;
            })}
          </div>
          <div className="bike-edit__footer">
            {bike.isSignedOff
              ? <div className="bike-edit__signoff">
                <div className="bike-edit__signoff-success">
                  <strong>Signed off by {`${bike.signedOffBy}`}</strong>
                </div>
                {user.isManager &&
                  <button className="btn-action btn-action__error" onClick={this.handleRemoveSignoff}>
                    Remove Signoff
                  </button>
                }
              </div>
              : <div className="bike-edit__signoff">
                <div><strong>Not signed off</strong></div>
                {user.isManager &&
                  <button
                    className={classNames('btn-action', 'btn-action__success', {'btn-action__disabled': !isReady})}
                    disabled={!isReady}
                    onClick={this.handleSignoff}>
                    Sign Off
                  </button>
                }
              </div>
            }
            <button className="bike-edit__close" onClick={this.handleClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }
}
