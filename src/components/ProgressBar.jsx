import React, {Component} from 'react';
import PropTypes from 'prop-types';
import progressImg from 'images/progress.svg';
import progressSelectedImg from 'images/progress-selected.svg';

export default class ProgressBar extends Component {
  static propTypes = {
    activeStep: PropTypes.string,
    steps: PropTypes.arrayOf(PropTypes.string)
  }

  render() {
    const {activeStep, steps} = this.props;

    return (
      <div className="progress-bar">
        {steps.map((step, index) => {
          return index < steps.length - 1 &&
            <img
              alt={step}
              className="progress-bar__step"
              key={index}
              src={index === steps.indexOf(activeStep) ? progressSelectedImg : progressImg} />;
        })}
      </div>
    );
  }
}
