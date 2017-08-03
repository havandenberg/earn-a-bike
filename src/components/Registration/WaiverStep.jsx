/* eslint-disable max-len */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import checkImg from 'images/check.svg';

export default class WaiverStep extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func,
    onForward: PropTypes.func
  }

  handleChange = () => {
    const {newUser, onChange} = this.props;
    newUser.waiver = !newUser.waiver;
    onChange(newUser);
  }

  render() {
    const {errors, newUser, onForward} = this.props;

    return (
      <div className="registration-step registration-step__waiver scroll">
        <p className="registration-step__waiver-intro"><strong>
          Please read the following liability information carefully and check the box below.
        </strong></p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;By signing this form in the space provided below, I hereby assume all of the risks associated with: the use of services, tools, and advice or assistance at Worcester Earn-A-Bike [WEAB]; participation at any Worcester Earn-A-Bike event; the use of any parts, tools, complete bicycles, or associated items furnished by WEAB; and any other harm that I may encounter during my use of the services of WEAB or my role as a volunteer at the WEAB (if applicable). I acknowledge and fully understand that the use of bicycles for transportation, repair of bicycles, and use of shop tools at WEAB contains inherent risks. Such risks include accidental injury and death. I acknowledge that even when due care is exercised, these risk cannot be completely eliminated and I assume all such risks. Such risks may come from the use of recycled bicycle parts, complete bicycles, and the methods of repair or installation. As a result of my assumption of the risk, I, the undersigned, agree to the following: (A) I Waive, Release, and Discharge from any and all liability for my death, disability, personal injury, property damage, property theft or other harm that may hereafter accrue to me, including my traveling to and from this program or using the program's bicycle, equipment, facilities or other fixtures; (B) This release of liability applies to THE FOLLOWING ENTITIES AND PERSONS: the directors, officers, employees, volunteers, representatives, agents, and sponsors of WEAB who will be indemnified and Held Harmless from any and all liabilities and claims arising from my participation in this program or the use of the services, parts, tools, advice, or complete bicycles of WEAB, including my use of a bicycle belonging to the program, regardless of whether the cause of the claims or liability arise from the negligence, acts or omissions of me, a third party, or the program. I also agree to follow the Code of Conduct of WEAB and will adhere to the rules contained therein. I understand that I may be refused service and further participation if the directors or officers have determined that I have violated the Code of Conduct. By my signature, I warrant that I am not relying on any oral representations, statements or inducement apart from the statements made on this form. By signing this form I agree that I understand the terms of this form and have read it and considered it carefully and have the capacity to release liability and assume the risks described above.</p>
        <div className="registration-checkbox">
          <button className="checkbox" onClick={this.handleChange}>
            {newUser.waiver && <img alt="Check" src={checkImg} />}
          </button>
          <button
            className={classNames(
              'registration-checkbox__text',
              {'registration-checkbox__text-error': errors.waiver}
            )}
            onClick={this.handleChange}>
            I agree to the terms stated above.
          </button>
        </div>
        <button className="registration-complete" onClick={onForward}>
          Confirm Registration
        </button>
      </div>
    );
  }
}
