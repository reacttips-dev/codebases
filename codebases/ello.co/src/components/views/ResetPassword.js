import React from 'react'
import PropTypes from 'prop-types'
import { MainView } from '../views/MainView'
import PasswordControl from '../forms/PasswordControl'
import FormButton from '../forms/FormButton'
import { resetPassword } from '../../networking/api'

const ResetPasswordForm = (props) => {
  const { passwordState, failureMessage, isFormValid, onSubmit, onChangeControl } = props
  return (
    <form
      action={resetPassword().path}
      className="AuthenticationForm"
      id="ResetPasswordForm"
      method="POST"
      noValidate="novalidate"
      onSubmit={onSubmit}
    >
      {failureMessage ? <p>{failureMessage}</p> : null}
      <PasswordControl
        classList="isBoxControl"
        placeholder="Enter new password"
        label="Password"
        onChange={onChangeControl}
      />
      {passwordState.message ?
        <p className="HoppyStatusMessage hasContent">{passwordState.message}</p> :
        <p className="HoppyStatusMessage"><span /></p>
      }
      <FormButton className="FormButton isRounded" disabled={!isFormValid} tabIndex="2">
        Change password
      </FormButton>
    </form>
  )
}

ResetPasswordForm.propTypes = {
  passwordState: PropTypes.object.isRequired,
  failureMessage: PropTypes.object.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onChangeControl: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export const ResetPassword = (props) => {
  const { passwordState, failureMessage, isFormValid, onSubmit, onChangeControl } = props
  return (
    <MainView className="Authentication isForgotPassword">
      <div className="AuthenticationFormDialog">
        <h1>
          Set new password
        </h1>
        <ResetPasswordForm
          passwordState={passwordState}
          failureMessage={failureMessage}
          isFormValid={isFormValid}
          onChangeControl={onChangeControl}
          onSubmit={onSubmit}
        />
      </div>
    </MainView>
  )
}

ResetPassword.propTypes = {
  passwordState: PropTypes.object.isRequired,
  failureMessage: PropTypes.object.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onChangeControl: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default ResetPassword
