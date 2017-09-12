import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {userProps} from 'proptypes/user';
import checkImg from 'images/check.svg';

export default class CheckboxInfoStep extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    newUser: PropTypes.shape(userProps),
    onChange: PropTypes.func
  }

  handleChange = (field) => {
    return () => {
      const {newUser, onChange} = this.props;
      newUser[field] = !newUser[field];
      onChange(newUser);
    };
  }

  handleSchoolChange = (e) => {
    const {newUser, onChange} = this.props;
    newUser.schoolName = e.target.value;
    onChange(newUser);
  }

  render() {
    const {errors, newUser} = this.props;

    return (
      <div className="registration-step">
        <div className="registration-checkbox">
          <button
            className="checkbox"
            onClick={this.handleChange('emailList')}>
            {newUser.emailList && <img alt="Check" src={checkImg} />}
          </button>
          <button
            className="registration-checkbox__text"
            onClick={this.handleChange('emailList')}>
            Would you like to be added to the volunteer email list?
          </button>
        </div>
        <div className="registration-checkbox">
          <button
            className="checkbox"
            onClick={this.handleChange('isInterestedManager')}>
            {newUser.isInterestedManager && <img alt="Check" src={checkImg} />}
          </button>
          <button
            className="registration-checkbox__text"
            onClick={this.handleChange('isInterestedManager')}>
            Are you interested in becoming a shop manager?
          </button>
        </div>
        <div className="registration-checkbox registration-checkbox__school">
          <button
            className="checkbox"
            onClick={this.handleChange('isStudent')}>
            {newUser.isStudent && <img alt="Check" src={checkImg} />}
          </button>
          <button
            className="registration-checkbox__text"
            onClick={this.handleChange('isStudent')}>
            Are you a student?
          </button>
        </div>
        {newUser.isStudent
          ? <div className="registration-checkbox">
            <input
              autoFocus={true}
              className={classNames(
                'registration-field',
                'registration-field__school',
                {'registration-field__error': errors.schoolName}
              )}
              type="text"
              placeholder="Where?"
              value={newUser.schoolName}
              onChange={this.handleSchoolChange} />
          </div>
          : <div className="registration-field__school-placeholder" />
        }
      </div>
    );
  }
}
