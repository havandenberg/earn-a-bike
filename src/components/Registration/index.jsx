import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import {connect} from 'react-redux';
import {registerUser, updateUser} from 'actions/app';
import {history} from 'utils/store';
import ProgressBar from 'components/ProgressBar.jsx';
import bicycleForwardGif from 'images/bicycle-forward.gif';
import bicycleForwardImg from 'images/bicycle-forward.png';
import {
  PERSONAL_INFO_STEP,
  CONTACT_INFO_STEP,
  PARENT_INFO_STEP,
  ADDRESS_INFO_STEP,
  QUESTION_ONE_STEP,
  QUESTION_TWO_STEP,
  CHECKBOX_INFO_STEP,
  WAIVER_STEP,
  CONFIRMATION_STEP
} from './constants';
import PersonalInfoStep from './PersonalInfoStep.jsx';
import ContactInfoStep from './ContactInfoStep.jsx';
import ParentInfoStep from './ParentInfoStep.jsx';
import AddressInfoStep from './AddressInfoStep.jsx';
import QuestionOneStep from './QuestionOneStep.jsx';
import QuestionTwoStep from './QuestionTwoStep.jsx';
import CheckboxInfoStep from './CheckboxInfoStep.jsx';
import WaiverStep from './WaiverStep.jsx';
import ConfirmationStep from './ConfirmationStep.jsx';

const steps = [
  PERSONAL_INFO_STEP,
  CONTACT_INFO_STEP,
  ADDRESS_INFO_STEP,
  QUESTION_ONE_STEP,
  QUESTION_TWO_STEP,
  CHECKBOX_INFO_STEP,
  WAIVER_STEP,
  CONFIRMATION_STEP
];

class Registration extends Component {
  static propTypes = {
    registerUser: PropTypes.func,
    updateUser: PropTypes.func
  }

  state = {
    activeStep: PERSONAL_INFO_STEP,
    errors: [],
    hoverBack: false,
    hoverForward: false,
    firstName: '',
    lastName: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    address: {
      streetLine1: '',
      streetLine2: '',
      city: '',
      state: '',
      zip: ''
    },
    pin: '',
    confirmPin: '',
    questionOne: '',
    questionTwo: '',
    emailList: false,
    isInterestedManager: false,
    visits: [],
    waiver: false
  };

  handleBack = () => {
    const {activeStep} = this.state;
    const activeStepIndex = steps.indexOf(activeStep);
    if (activeStepIndex > 0) {
      this.setState({activeStep: steps[activeStepIndex - 1]});
    } else {
      history.push('/');
    }
  }

  handleForward = () => {
    const {activeStep, dateOfBirth} = this.state;
    const activeStepIndex = steps.indexOf(activeStep);
    if (this.validate()) {
      if (activeStep === PERSONAL_INFO_STEP) {
        const age = moment().diff(`${dateOfBirth.month}-${dateOfBirth.day}-${dateOfBirth.year}`, 'years');
        if (age < 18) {
          steps.splice(2, 0, PARENT_INFO_STEP);
        } else if (_.includes(steps, PARENT_INFO_STEP)) {
          steps.splice(2, 1);
        }
      }
      if (activeStep === WAIVER_STEP) {
        this.props.registerUser(
          _.omit(this.state, ['activeStep', 'confirmPin', 'errors', 'hoverBack', 'hoverForward'])
        );
      }
      if (activeStepIndex < steps.length) {
        this.setState({activeStep: steps[activeStepIndex + 1]});
      }
    }
  }

  handleChange = (user) => {
    this.setState({...this.state, ...user});
  }

  toggleHoverBack = () => {
    this.setState({hoverBack: !this.state.hoverBack});
  }

  toggleHoverForward = () => {
    this.setState({hoverForward: !this.state.hoverForward});
  }

  validate = () => {
    const {activeStep} = this.state;
    const newUser = _.omit(this.state, ['activeStep', 'errors', 'hoverBack', 'hoverForward']);
    const errors = [];

    switch (activeStep) {
    case PERSONAL_INFO_STEP:
      if (_.isEmpty(newUser.firstName)) {
        errors.push('firstName');
      }
      if (_.isEmpty(newUser.lastName)) {
        errors.push('lastName');
      }
      if (_.isEmpty(newUser.dateOfBirth.month)) {
        errors.push('month');
      }
      if (_.isEmpty(newUser.dateOfBirth.day)) {
        errors.push('day');
      }
      if (_.isEmpty(newUser.dateOfBirth.year)) {
        errors.push('year');
      }
      break;
    case CONTACT_INFO_STEP:
      if (_.isEmpty(newUser.email)) {
        errors.push('email');
      }
      if (_.isEmpty(newUser.phone)) {
        errors.push('phone');
      }
      if (_.isEmpty(newUser.pin) || _.isEmpty(newUser.confirmPin)) {
        errors.push('pin');
        errors.push('confirmPin');
      }
      if (!_.isEmpty(newUser.pin) && newUser.pin !== newUser.confirmPin) {
        errors.push('pin');
        errors.push('confirmPin');
      }
      break;
    case PARENT_INFO_STEP:
      if (_.isEmpty(newUser.parentName)) {
        errors.push('parentName');
      }
      if (_.isEmpty(newUser.parentPhone)) {
        errors.push('parentPhone');
      }
      break;
    case ADDRESS_INFO_STEP:
      if (_.isEmpty(newUser.address.streetLine1)) {
        errors.push('streetLine1');
      }
      if (_.isEmpty(newUser.address.streetLine2)) {
        errors.push('streetLine2');
      }
      if (_.isEmpty(newUser.address.city)) {
        errors.push('city');
      }
      if (_.isEmpty(newUser.address.state)) {
        errors.push('state');
      }
      if (_.isEmpty(newUser.address.zip)) {
        errors.push('zip');
      }
      break;
    case QUESTION_ONE_STEP:
      if (_.isEmpty(newUser.questionOne)) {
        errors.push('questionOne');
      }
      break;
    case QUESTION_TWO_STEP:
      if (_.isEmpty(newUser.questionTwo)) {
        errors.push('questionTwo');
      }
      break;
    case WAIVER_STEP:
      if (!newUser.waiver) {
        errors.push('waiver');
      }
      break;
    case CHECKBOX_INFO_STEP:
    case CONFIRMATION_STEP:
      break;
    default:
      return false;
    }

    this.setState({errors});
    return !errors.length;
  }

  setStep = (activeStep) => () => this.setState({activeStep});

  getStep = () => {
    const {
      activeStep,
      errors
    } = this.state;
    const newUser = _.omit(this.state, ['activeStep', 'errors', 'hoverBack', 'hoverForward']);

    switch (activeStep) {
    case PERSONAL_INFO_STEP:
      return <PersonalInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case CONTACT_INFO_STEP:
      return <ContactInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case PARENT_INFO_STEP:
      return <ParentInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case ADDRESS_INFO_STEP:
      return <AddressInfoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case QUESTION_ONE_STEP:
      return <QuestionOneStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case QUESTION_TWO_STEP:
      return <QuestionTwoStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    case CHECKBOX_INFO_STEP:
      return <CheckboxInfoStep newUser={newUser} onChange={this.handleChange} />;
    case WAIVER_STEP:
      return <WaiverStep errors={errors} newUser={newUser} onChange={this.handleChange} onForward={this.handleForward} />;
    case CONFIRMATION_STEP:
      return <ConfirmationStep errors={errors} newUser={newUser} onChange={this.handleChange} />;
    default:
      return <div></div>;
    }

  }

  render() {
    const {activeStep, dateOfBirth, hoverBack, hoverForward} = this.state;

    return (
      <div className="registration">
        <h1 className="registration-title">Sign Up</h1>
        <div className="registration-step__container">
          {activeStep !== CONFIRMATION_STEP
            ? <button
              className="btn-forward"
              onClick={this.handleBack}
              onMouseEnter={this.toggleHoverBack}
              onMouseLeave={this.toggleHoverBack}>
              <img alt="back" className="registration-forward flip-x" src={hoverBack ? bicycleForwardGif : bicycleForwardImg} />
            </button>
            : <div className="registration-placeholder"></div>
          }
          {this.getStep()}
          {!_.includes([WAIVER_STEP, CONFIRMATION_STEP], activeStep)
            ? <button
              className="btn-forward"
              onClick={this.handleForward}
              onMouseEnter={this.toggleHoverForward}
              onMouseLeave={this.toggleHoverForward}>
              <img alt="Forward" className="registration-forward" src={hoverForward ? bicycleForwardGif : bicycleForwardImg} />
            </button>
            : <div className="registration-placeholder"></div>
          }
        </div>
        {activeStep !== CONFIRMATION_STEP &&
          <ProgressBar activeStep={activeStep} dateOfBirth={dateOfBirth} steps={steps} />
        }
      </div>
    );
  }
}

export default connect(null, {
  registerUser,
  updateUser
})(Registration);
