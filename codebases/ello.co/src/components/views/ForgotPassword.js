import React from 'react'
import PropTypes from 'prop-types'
import { MainView } from '../views/MainView'
import Emoji from '../assets/Emoji'
import EmailControl from '../forms/EmailControl'
import FormButton from '../forms/FormButton'
import { forgotPassword } from '../../networking/api'

const SubmittedState = () =>
  (<div>
    If your email address exists in our database, you will receive a
    password recovery link at your email address in a few minutes.
  </div>)

const ForgotPasswordForm = (props) => {
  const {
    emailState, isFormValid, onBlurControl, onChangeControl, onFocusControl, onSubmit,
  } = props
  return (
    <form
      action={forgotPassword().path}
      className="AuthenticationForm"
      id="ForgotPasswordForm"
      method="POST"
      noValidate="novalidate"
      onSubmit={onSubmit}
    >
      <EmailControl
        classList="isBoxControl"
        label="Email"
        onBlur={onBlurControl}
        onChange={onChangeControl}
        onFocus={onFocusControl}
        tabIndex="1"
      />
      {emailState.message ?
        <p className="HoppyStatusMessage hasContent">{emailState.message}</p> :
        <p className="HoppyStatusMessage"><span /></p>
      }
      <FormButton className="FormButton isRounded" disabled={!isFormValid} tabIndex="2">
        Reset password
      </FormButton>
    </form>
  )
}

ForgotPasswordForm.propTypes = {
  emailState: PropTypes.object.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onBlurControl: PropTypes.func,
  onChangeControl: PropTypes.func.isRequired,
  onFocusControl: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
}

export const ForgotPassword = (props) => {
  const { emailState, isFormValid, isSubmitted } = props
  const { onBlurControl, onChangeControl, onFocusControl, onSubmit } = props
  return (
    <MainView className="Authentication isForgotPassword">
      <div className="AuthenticationFormDialog">
        <h1>
          <Emoji name="hot_shit" title="It really does" size={32} />
          Shit happens.
        </h1>
        {isSubmitted ?
          <SubmittedState /> :
          <ForgotPasswordForm
            emailState={emailState}
            isFormValid={isFormValid}
            onBlurControl={onBlurControl}
            onChangeControl={onChangeControl}
            onFocusControl={onFocusControl}
            onSubmit={onSubmit}
          />
        }
      </div>
    </MainView>
  )
}

ForgotPassword.propTypes = {
  emailState: PropTypes.object.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onBlurControl: PropTypes.func,
  onChangeControl: PropTypes.func.isRequired,
  onFocusControl: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
}

export default ForgotPassword

