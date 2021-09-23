import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sendForgotPasswordRequest } from '../actions/authentication'
import { isFormValid, getEmailStateFromClient } from '../components/forms/Validators'
import { ForgotPassword } from '../components/views/ForgotPassword'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { isAndroid } from '../lib/jello'

class ForgotPasswordContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      formStatus: STATUS.INDETERMINATE,
    }
    this.emailValue = ''
  }

  onChangeControl = ({ email }) => {
    this.emailValue = email
    const { emailState, formStatus } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: email, currentStatus, formStatus })
    if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const { emailState, formStatus } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromClient({ value: this.emailValue, currentStatus, formStatus })
    if (newState.status === STATUS.SUCCESS) {
      dispatch(sendForgotPasswordRequest(this.emailValue))
      this.setState({ formStatus: STATUS.SUBMITTED })
    } else if (newState.status !== currentStatus) {
      this.setState({ emailState: newState })
    }
  }

  render() {
    const { emailState, formStatus } = this.state
    return (
      <ForgotPassword
        emailState={emailState}
        isSubmitted={formStatus === STATUS.SUBMITTED}
        isFormValid={isFormValid([emailState])}
        onBlur={isAndroid() ? () => document.body.classList.remove('isCreditsHidden') : null}
        onFocus={isAndroid() ? () => document.body.classList.add('isCreditsHidden') : null}
        onChangeControl={this.onChangeControl}
        onClickTrackCredits={this.onClickTrackCredits}
        onSubmit={this.onSubmit}
      />
    )
  }
}

export default connect()(ForgotPasswordContainer)

