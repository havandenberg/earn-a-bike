import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import removeImg from 'images/remove.svg';
import editImg from 'images/edit.svg';

export default class Bike extends Component {
  static propTypes = {
    bike: PropTypes.shape({
      date: PropTypes.string,
      description: PropTypes.string
    }),
    index: PropTypes.number,
    isManager: PropTypes.bool,
    onRemoveBike: PropTypes.func,
    onUpdateBike: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditing: _.isEmpty(props.bike.description)
    };
  }

  handleChange = (e) => {
    const {bike, index, onUpdateBike} = this.props;
    bike.description = e.target.value;
    onUpdateBike(index, bike);
  };

  handleToggleEditing = () => {
    if (!this.state.isEditing) {
      this.setState({isEditing: true});
    }
  };

  handleStopEditing = () => {
    setTimeout(() => {
      this.setState({isEditing: false});
    }, 200);
  };

  handleRemove = () => {
    this.props.onRemoveBike(this.props.index);
  };

  render() {
    const {bike, isManager} = this.props;
    const {isEditing} = this.state;

    return (
      <div className="bike">
        <div className="bike-date">{`${bike.date} -`}</div>
        {isEditing
          ? <input
            autoFocus={true}
            type="text"
            className="bike-description bike-description__editing"
            onChange={this.handleChange}
            onBlur={this.handleStopEditing}
            value={bike.description}/>
          : <div className="bike-description">
            {bike.description}
          </div>}
        {isManager &&
          <button className="bike-edit" onClick={this.handleToggleEditing}>
            <img alt="editing" className="bike-edit__img" src={editImg} />
          </button>}
        {isManager &&
          <button className="bike-remove" onClick={this.handleRemove}>
            <img alt="remove" className="bike-remove__img" src={removeImg} />
          </button>}
      </div>
    );
  }
}
