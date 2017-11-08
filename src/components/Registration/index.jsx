import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {connect} from 'react-redux';
import {registerUser, updateUser} from 'actions/app';
import {history} from 'utils/store';
import {isUsernameUnique} from 'utils/helpers';
import {userProps} from 'proptypes/user';
import ProgressBar from 'components/ProgressBar.jsx';
import BicycleBtn from 'components/BicycleBtn.jsx';
import {
  PERSONAL_INFO_STEP,
  LOGIN_INFO_STEP,
  PARENT_INFO_STEP,
  ADDRESS_INFO_STEP,
  QUESTION_ONE_STEP,
  QUESTION_TWO_STEP,
  CHECKBOX_INFO_STEP,
  WAIVER_STEP,
  CONFIRMATION_STEP
} from './constants';
import PersonalInfoStep from './PersonalInfoStep.jsx';
import LoginInfoStep from './LoginInfoStep.jsx';
import ParentInfoStep from './ParentInfoStep.jsx';
import AddressInfoStep from './AddressInfoStep.jsx';
import QuestionOneStep from './QuestionOneStep.jsx';
import QuestionTwoStep from './QuestionTwoStep.jsx';
import CheckboxInfoStep from './CheckboxInfoStep.jsx';
import WaiverStep from './WaiverStep.jsx';
import ConfirmationStep from './ConfirmationStep.jsx';

class Registration extends Component {
  static propTypes = {
    registerUser: PropTypes.func,
    updateUser: PropTypes.func,
    users: PropTypes.arrayOf(PropTypes.shape(userProps))
  };

  state = {
    activeStep: PERSONAL_INFO_STEP,
    addressCity: '',
    addressState: '',
    addressLine1: '',
    addressLine2: '',
    addressZip: '',
    bikesEarned: [],
    confirmPin: '',
    countryOfOrigin: '',
    dateJoined: moment().format('MM/DD/YYYY'),
    dobMonth: '',
    dobDay: '',
    dobYear: '',
    email: '',
    emailList: false,
    errors: {},
    firstName: '',
    isInterestedManager: false,
    isManager: false,
    lastName: '',
    parentName: '',
    parentPhone: '',
    phone: '',
    pin: '',
    questionOne: '',
    questionTwo: '',
    steps: [
      PERSONAL_INFO_STEP,
      LOGIN_INFO_STEP,
      ADDRESS_INFO_STEP,
      QUESTION_ONE_STEP,
      QUESTION_TWO_STEP,
      CHECKBOX_INFO_STEP,
      WAIVER_STEP,
      CONFIRMATION_STEP
    ],
    username: '',
    visits: [],
    waiver: false
  };

  handleBack = () => {
    const {activeStep, steps} = this.state;
    const activeStepIndex = steps.indexOf(activeStep);
    if (activeStepIndex > 0) {
      this.setState({activeStep: steps[activeStepIndex - 1]});
    } else {
      history.push('/');
    }
  };

  handleForward = () => {
    const {activeStep, dobMonth, dobDay, dobYear, steps} = this.state;
    const activeStepIndex = steps.indexOf(activeStep);
    if (this.validate()) {
      if (activeStep === PERSONAL_INFO_STEP) {
        const age = moment().diff(`${dobMonth}-${dobDay}-${dobYear}`, 'years');
        if (age < 18) {
          steps.splice(2, 0, PARENT_INFO_STEP);
        } else if (_.includes(steps, PARENT_INFO_STEP)) {
          steps.splice(2, 1);
        }
      }
      if (activeStep === WAIVER_STEP) {
        this.props.registerUser(_.omit(this.state, ['activeStep', 'confirmPin', 'errors', 'steps']));
      }
      if (activeStepIndex < steps.length) {
        this.setState({activeStep: steps[activeStepIndex + 1], steps});
      }
    }
  };

  handleChange = (user) => {
    this.setState({...this.state, ...user});
  };

  validate = () => {
    const {users} = this.props;
    const {activeStep} = this.state;
    const newUser = _.omit(this.state, ['activeStep', 'errors', 'hoverBack', 'hoverForward', 'steps']);
    const errors = {};
    const hasPinError
      = _.isEmpty(newUser.pin) || _.isEmpty(newUser.confirmPin) || (!_.isEmpty(newUser.pin) && newUser.pin !== newUser.confirmPin);

    switch (activeStep) {
    case PERSONAL_INFO_STEP:
      errors.firstName = _.isEmpty(newUser.firstName);
      errors.lastName = _.isEmpty(newUser.lastName);
      errors.dobMonth = _.isEmpty(newUser.dobMonth);
      errors.dobDay = _.isEmpty(newUser.dobDay);
      errors.dobYear = _.isEmpty(newUser.dobYear);
      errors.email = _.isEmpty(newUser.email);
      errors.phone = _.isEmpty(newUser.phone);
      break;
    case LOGIN_INFO_STEP:
      errors.username = _.isEmpty(newUser.username);
      errors.usernameNotUnique = !isUsernameUnique(users, newUser.username);
      errors.pin = hasPinError;
      errors.confirmPin = hasPinError;
      break;
    case PARENT_INFO_STEP:
      errors.parentName = _.isEmpty(newUser.parentName);
      errors.parentPhone = _.isEmpty(newUser.parentPhone);
      break;
    case ADDRESS_INFO_STEP:
      errors.addressLine1 = _.isEmpty(newUser.addressLine1);
      errors.addressCity = _.isEmpty(newUser.addressCity);
      errors.addressState = _.isEmpty(newUser.addressState);
      errors.addressZip = _.isEmpty(newUser.addressZip);
      errors.countryOfOrigin = _.isEmpty(newUser.countryOfOrigin);
      break;
    case CHECKBOX_INFO_STEP:
      errors.schoolName = newUser.isStudent ? _.isEmpty(newUser.schoolName) : false;
      break;
    case QUESTION_ONE_STEP:
      errors.questionOne = _.isEmpty(newUser.questionOne);
      break;
    case QUESTION_TWO_STEP:
      errors.questionTwo = _.isEmpty(newUser.questionTwo);
      break;
    case WAIVER_STEP:
      errors.waiver = !newUser.waiver;
      break;
    case CONFIRMATION_STEP:
      break;
    default:
      return false;
    }

    this.setState({errors});
    return !_.some(errors, (error) => error);
  };

  setStep = (activeStep) => () => this.setState({activeStep});

  getStep = () => {
    const {activeStep, errors} = this.state;
    const newUser = _.omit(this.state, ['activeStep', 'errors', 'hoverBack', 'hoverForward', 'steps']);

    switch (activeStep) {
    case PERSONAL_INFO_STEP:
      return <PersonalInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case LOGIN_INFO_STEP:
      return <LoginInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case PARENT_INFO_STEP:
      return <ParentInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case ADDRESS_INFO_STEP:
      return <AddressInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case QUESTION_ONE_STEP:
      return <QuestionOneStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case QUESTION_TWO_STEP:
      return <QuestionTwoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case CHECKBOX_INFO_STEP:
      return <CheckboxInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case WAIVER_STEP:
      return <WaiverStep errors={errors} newUser={newUser} onChange={this.handleChange} onForward={this.handleForward} />;
    case CONFIRMATION_STEP:
      return <ConfirmationStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    default:
      return <div>No step found</div>;
    }
  };

  render() {
    const {activeStep, dateOfBirth, steps} = this.state;

    return (
      <div className="registration">
        <h1 className="registration-title">Sign Up</h1>
        <div className="registration-step__container">
          {activeStep !== CONFIRMATION_STEP ? (
            <BicycleBtn baseClass="registration-btn" isReverse={true} text="Back" onClick={this.handleBack} />
          ) : (
            <div className="registration-placeholder" />
          )}
          {this.getStep()}
          {!_.includes([WAIVER_STEP, CONFIRMATION_STEP], activeStep) ? (
            <BicycleBtn baseClass="registration-btn" text="Next" onClick={this.handleForward} />
          ) : (
            <div className="registration-placeholder" />
          )}
        </div>
        {activeStep !== CONFIRMATION_STEP && <ProgressBar activeStep={activeStep} dateOfBirth={dateOfBirth} steps={steps} />}
      </div>
    );
  }
}

const mapStateToProps = ({app}) => {
  return {
    users: app.get('users').toJS()
  };
};

const mapDispatchToProps = {
  registerUser,
  updateUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
