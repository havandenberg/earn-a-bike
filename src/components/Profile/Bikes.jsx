import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {bikeChecklistItems} from 'utils/constants';
import userProps from 'proptypes/user';
import Bike from 'components/Bike.jsx';
import addImg from 'images/add.svg';

export default class Bikes extends Component {
  static propTypes = {
    selectedUser: PropTypes.shape(userProps),
    updateUser: PropTypes.func,
    user: PropTypes.shape(userProps)
  };

  handleAddBike = () => {
    const {bikesEarned} = this.props.selectedUser;
    const newBike = {
      date: moment().format('MM/DD/YYYY'),
      description: '',
      details: '',
      checklist: [],
      isSignedOff: false,
      signedOffBy: ''
    };
    _.each(bikeChecklistItems, (item) => {
      newBike.checklist.push({
        text: item,
        value: false
      });
    });
    bikesEarned.push(newBike);
    this.props.updateUser({...this.props.selectedUser, bikesEarned});
  };

  handleRemoveBike = (index) => {
    const {bikesEarned} = this.props.selectedUser;
    bikesEarned.splice(index, 1);
    this.props.updateUser({...this.props.selectedUser, bikesEarned});
  };

  handleUpdateBike = (index, bike) => {
    const {bikesEarned} = this.props.selectedUser;
    bikesEarned[index] = bike;
    this.props.updateUser({...this.props.selectedUser, bikesEarned});
  };

  render() {
    const {
      selectedUser,
      user
    } = this.props;

    return (
      <div className="bike__container scroll">
        {_.isEmpty(selectedUser.bikesEarned) ? (
          <div className="bike-none">{`${user.isManager ? 'This volunteer has' : 'You have'} not earned any bikes yet.`}</div>
        ) : (
          <div>
            {selectedUser.bikesEarned.map((bike, index) => {
              return (
                <Bike
                  key={index}
                  bike={bike}
                  index={index}
                  user={user}
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
    );
  }
}
