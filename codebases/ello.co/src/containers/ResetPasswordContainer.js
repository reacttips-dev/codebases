import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import set from 'lodash/set'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { sendResetPasswordRequest } from '../actions/authentication'
import { isFormValid, getPasswordState } from '../components/forms/Validators'
import { ResetPassword } from '../components/views/ResetPassword'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'

class ResetPasswordContainer extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      failureMessage: '',
    }
    this.passwordValue = ''
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { dispatch, location } = this.props
    const resetPasswordToken = location.query.reset_password_token
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: this.passwordValue, currentStatus })
    const action = dispatch(sendResetPasswordRequest(this.passwordValue, resetPasswordToken))

    set(action, 'meta.failureAction', () => this.setState({
      failureMessage: <span>Your password link has expired. <Link to="/forgot-password">Click here to request another link.</Link></span>,
    }))

    if (newState.status === STATUS.SUCCESS) {
      dispatch(action)
    } else if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
  }

  onChangeControl = ({ password }) => {
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
  }

  render() {
    const { passwordState, failureMessage } = this.state
    return (
      <ResetPassword
        passwordState={passwordState}
        failureMessage={failureMessage}
        isFormValid={isFormValid([passwordState])}
        onSubmit={this.onSubmit}
        onChangeControl={this.onChangeControl}
      />
    )
  }
}

export default connect()(ResetPasswordContainer)
