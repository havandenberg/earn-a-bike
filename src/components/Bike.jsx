import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import BikeEdit from 'components/BikeEdit.jsx';
import bikeProps from 'proptypes/bike';
import userProps from 'proptypes/user';
import editImg from 'images/edit.svg';
import removeImg from 'images/remove.svg';

export default class Bike extends Component {
  static propTypes = {
    bike: PropTypes.shape(bikeProps),
    index: PropTypes.number,
    user: PropTypes.shape(userProps),
    onRemoveBike: PropTypes.func,
    onUpdateBike: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isConfirm: false,
      isEditing: _.isEmpty(props.bike.description)
    };
  }

  handleChange = (e) => {
    const {bike, index, onUpdateBike} = this.props;
    bike.description = e.target.value;
    onUpdateBike(index, bike);
  };

  handleToggleEditing = () => {
    this.setState({isEditing: !this.state.isEditing});
  };

  handleConfirm = () => {
    this.setState({isConfirm: true});
  };

  handleCancelConfirm = () => {
    this.setState({isConfirm: false});
  };

  handleRemove = () => {
    this.props.onRemoveBike(this.props.index);
    this.setState({isConfirm: false});
  };

  render() {
    const {
      bike,
      index,
      user,
      onRemoveBike,
      onUpdateBike
    } = this.props;
    const {isConfirm, isEditing} = this.state;

    return (
      <div className="bike">
        <div className="bike-header">
          <div className={classNames('bike-status__indicator', {'bike-status__success': bike.isSignedOff})} />
          <div className="bike-date">{`${bike.date} -`}</div>
          <div className="bike-description">
            {bike.description}
          </div>
          <button className="bike-btn-edit" onClick={this.handleToggleEditing}>
            <img alt="editing" className="bike-edit__img" src={editImg} />
          </button>
          {isConfirm && <div className="bike-confirm">Confirm?</div>}
          {isConfirm && <button className="bike-confirm__btn" onClick={this.handleRemove}>Yes</button>}
          {isConfirm && <button className="bike-confirm__btn" onClick={this.handleCancelConfirm}>No</button>}
          {user.isManager && !isConfirm &&
            <button className="bike-remove" onClick={this.handleConfirm}>
              <img alt="removing" className="bike-remove__img" src={removeImg} />
            </button>}
        </div>
        {isEditing &&
          <BikeEdit
            bike={bike}
            index={index}
            user={user}
            toggleEditing={this.handleToggleEditing}
            onRemoveBike={onRemoveBike}
            onUpdateBike={onUpdateBike}/>
        }
      </div>
    );
  }
}
