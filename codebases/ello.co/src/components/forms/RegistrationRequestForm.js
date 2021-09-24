import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import debounce from 'lodash/debounce'
import ConfirmationCodeControl from './ConfirmationCodeControl'
import EmailControl from './EmailControl'
import FormButton from './FormButton'
import JoinForm from './JoinForm'
import { BackIcon } from '../assets/Icons'
import {
  isFormValid,
  getEmailStateFromClient,
  getEmailStateFromServer,
  getInvitationCodeStateFromServer,
} from './Validators'
import {
  addPageVisibilityObserver,
  removePageVisibilityObserver,
} from '../viewport/PageVisibilityComponent'
import { trackEvent } from '../../actions/analytics'
import { getInviteEmail } from '../../actions/invitations'
import { sendEmailForConfirmation, checkConfirmationCode } from '../../actions/authentication'
import { checkAvailability, resetAvailability } from '../../actions/profile'
import { ERROR_MESSAGES } from '../../constants/locales/en'
import { FORM_CONTROL_STATUS as STATUS, REQUEST_STATUS } from '../../constants/status_types'
import { isAndroid } from '../../lib/jello'
import { invite } from '../../networking/api'
import { selectParamsInvitationCode, selectParamsConfirmationCode } from '../../selectors/params'
import { selectAvailability, selectEmail } from '../../selectors/profile'
import { selectConfirmationCodeRequestStatus } from '../../selectors/authentication'
import { css, media, parent, descendent } from '../../styles/jss'
import * as s from '../../styles/jso'

function mapStateToProps(state, props) {
  return {
    availability: selectAvailability(state),
    email: selectEmail(state),
    invitationCode: selectParamsInvitationCode(state, props),
    confirmationCode: selectParamsConfirmationCode(state, props),
    confirmationCodeRequestStatus: selectConfirmationCodeRequestStatus(state),
  }
}

const emailFormWrapperStyle = css(
  s.relative,
  s.zIndex1,
  descendent('a:link, a:visited, a:hover, a:focus, a:active', {
    textDecoration: 'underline',
  }),
  descendent('label[for]', {
    paddingLeft: 5,
  }),
  descendent('input[type="checkbox"]', {
    MozAppearance: 'checkbox',
    WebkitAppearance: 'checkbox',
  }),
)
const clickHereStyle = css({
  textDecoration: 'underline',
})
const accountLinkStyle = css(
  { marginTop: 15 },
  s.fontSize14,
  s.colorWhite,
  parent('.AuthenticationFormDialog.inModal',
    s.mt0,
    s.mb20,
    s.colorA,
    media(s.minBreak2, s.mb0),
  ),
)

class RegistrationRequestForm extends Component {
  static propTypes = {
    availability: PropTypes.object,
    confirmationCode: PropTypes.string, // NOTE: best effort guess
    confirmationCodeRequestStatus: PropTypes.string, // NOTE: best effort guess
    dispatch: PropTypes.func.isRequired,
    email: PropTypes.string,
    inModal: PropTypes.bool,
    inEditorial: PropTypes.bool,
  }

  static defaultProps = {
    availability: null,
    email: null,
    inModal: false,
    inEditorial: false,
  }

  componentWillMount() {
    const { email, confirmationCode } = this.props
    let emailFormStatus = STATUS.INDETERMINATE
    if (email && confirmationCode) {
      emailFormStatus = STATUS.SUBMITTED
    }

    this.state = {
      emailState: { status: STATUS.INDETERMINATE, message: '' },
      emailFormStatus,
      confirmationCodeFormStatus: emailFormStatus,
      invitationCodeState: { status: STATUS.INDETERMINATE, message: '' },
      isTermsChecked: false,
      emailValue: this.props.email,
      codeValue: this.props.confirmationCode,
    }
    this.checkServerForAvailability = debounce(this.checkServerForAvailability, 666)
  }

  componentDidMount() {
    addPageVisibilityObserver(this)
    this.checkForInviteCode(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { availability, confirmationCodeRequestStatus } = nextProps

    if (nextProps.email !== this.props.email) {
      this.checkForInviteCode(nextProps)
    }

    if (availability) {
      if (availability.has('email')) {
        this.validateEmailResponse(availability)
      }

      if (availability.has('invitationCode')) {
        this.validateInvitationCodeResponse(availability)
      }
    }

    if (confirmationCodeRequestStatus) {
      this.validateConfirmationCode(confirmationCodeRequestStatus)
    }
  }

  componentWillUnmount() {
    removePageVisibilityObserver(this)
  }

  onBeforeUnload() {
    const { dispatch } = this.props
    const { emailFormStatus } = this.state
    if (emailFormStatus !== STATUS.SUBMITTED) {
      dispatch(trackEvent('modal-registration-request-abandonment'))
    }
  }

  onChangeEmailControl = ({ email }) => {
    this.setState({ emailValue: email })

    const { emailState, emailFormStatus } = this.state
    const currentStatus = emailState.status
    const clientState = getEmailStateFromClient({
      value: email,
      currentStatus,
      formStatus: emailFormStatus,
    })
    if (clientState.status === STATUS.SUCCESS) {
      if (currentStatus !== STATUS.REQUEST) {
        this.setState({ emailState: { status: STATUS.REQUEST, message: 'checking...' } })
      }
      // This will end up landing on `validateEmailResponse` after fetching
      this.checkServerForAvailability({ email })
    } else if (currentStatus !== clientState.status) {
      this.setState({ emailState: clientState })
    }
  }

  onChangeCodeControl = ({ confirmation_code: confirmationCode }) => {
    const { confirmationCodeFormStatus } = this.state
    const codeValue = confirmationCode || ''
    if (codeValue.length === 6) {
      this.setState({ confirmationCodeFormStatus: STATUS.SUCCESS })
    } else if (confirmationCodeFormStatus === STATUS.SUCCESS) {
      this.setState({ confirmationCodeFormStatus: STATUS.FAILURE })
    }

    this.setState({ codeValue })
  }

  onChangeTermsControl = () => {
    const { isTermsChecked } = this.state
    this.setState({ isTermsChecked: !isTermsChecked })
  }

  onClickLogin = () => {
    const { dispatch } = this.props
    dispatch(trackEvent('clicked_signup_login'))
  }

  onClickResendCode = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const { emailValue } = this.state
    dispatch(sendEmailForConfirmation(emailValue))
  }

  onClickBack = (e) => {
    e.preventDefault()
    this.setState({ emailFormStatus: STATUS.SUCCESS })
  }

  onSubmitEmail = (e) => {
    e.preventDefault()
    const { emailState, emailValue, isTermsChecked } = this.state
    if (isTermsChecked && emailState.status === STATUS.SUCCESS) {
      this.setState({ emailState: { status: STATUS.REQUEST, message: 'checking...' } })
      this.checkServerForAvailability({ email: emailValue, is_signup: true })
    } else if (!isTermsChecked) {
      this.setState({ emailFormStatus: STATUS.FAILURE })
    }
  }

  onSubmitCode = (e) => {
    e.preventDefault()
    const { confirmationCodeFormStatus, codeValue, emailValue } = this.state
    if (confirmationCodeFormStatus === STATUS.SUCCESS) {
      this.setState({ confirmationCodeFormStatus: STATUS.REQUEST })
      this.props.dispatch(checkConfirmationCode({ email: emailValue, code: codeValue }))
    }
  }

  checkForInviteCode(props) {
    const { dispatch, email, invitationCode } = props
    if (invitationCode) {
      this.invitationCodeValue = invitationCode
    }
    if (invitationCode && !email) {
      dispatch(getInviteEmail(invitationCode))
    } else if (email) {
      this.setState({ emailValue: email })
      const emailInput = document.body.querySelector('.JoinEmailControl input')
      if (emailInput) {
        emailInput.value = email
      }
      requestAnimationFrame(() => {
        this.setState({ emailState: { status: STATUS.SUCCESS } })
      })
    }
  }

  checkServerForAvailability(vo) {
    this.props.dispatch(checkAvailability(vo))
  }

  validateConfirmationCode(status) {
    if (status === REQUEST_STATUS.SUCCESS) {
      this.setState({ confirmationCodeFormStatus: STATUS.SUBMITTED })
    }
  }

  validateEmailResponse(availability) {
    const { dispatch, inModal } = this.props
    const { emailState, emailValue } = this.state
    const currentStatus = emailState.status
    const newState = getEmailStateFromServer({ availability, currentStatus })
    if (newState.status === STATUS.SUCCESS && availability.getIn(['original', 'is_signup'])) {
      dispatch(resetAvailability())
      dispatch(sendEmailForConfirmation(emailValue))
      if (inModal) {
        dispatch(trackEvent('modal-registration-request-form-completion'))
      }
      this.setState({ emailFormStatus: STATUS.SUBMITTED })
    } else {
      this.setState({ emailState: newState })
    }
  }

  validateInvitationCodeResponse(availability) {
    const { invitationCodeState } = this.state
    const currentStatus = invitationCodeState.status
    const newState = getInvitationCodeStateFromServer({ availability, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ invitationCodeState: newState })
    }
  }

  renderSignupForm() {
    const { emailValue, codeValue } = this.state
    return (
      <JoinForm
        email={emailValue}
        confirmationCode={codeValue}
        inEditorial={this.props.inEditorial}
        invitationCode={this.invitationCodeValue}
      />
    )
  }

  renderEmailForm() {
    const { inEditorial, email } = this.props
    const { emailState, emailFormStatus, isTermsChecked } = this.state
    const { message: emailMessage, status } = emailState
    const isValid = isFormValid([emailState])
    const showEmailMessage = emailMessage && emailMessage.length &&
      (status === STATUS.FAILURE || status === STATUS.SUCCESS)
    const termsMessage = emailFormStatus === STATUS.FAILURE && !isTermsChecked
      ? 'You must first accept the Terms and Privacy Policy' : null
    const showTermMessage = termsMessage && termsMessage.length
    const termsCheckboxId = 'termsCheckbox'
    return (
      <div className={emailFormWrapperStyle}>
        <h1>
          Join The Creators Network.
        </h1>
        <h2>
          Be part of what&apos;s next in art, design, fashion, web culture & more.
        </h2>
        <h2>
          We have been having issues delivering to all Yahoo accounts, we
          recommend using a different email provider if at all possible.
        </h2>
        <form
          action={invite().path}
          className="AuthenticationForm"
          id="RegistrationRequestForm"
          method="POST"
          noValidate="novalidate"
          onSubmit={this.onSubmitEmail}
        >
          <EmailControl
            classList="isBoxControl JoinEmailControl"
            label="Email"
            onChange={this.onChangeEmailControl}
            onBlur={isAndroid() ? () => document.body.classList.remove('isCreditsHidden') : null}
            onFocus={isAndroid() ? () => document.body.classList.add('isCreditsHidden') : null}
            tabIndex="1"
            text={email}
          />
          <input
            checked={isTermsChecked}
            id={termsCheckboxId}
            onChange={this.onChangeTermsControl}
            type="checkbox"
          /> <label htmlFor={termsCheckboxId}>I have read and accept Ello’s <Link to="/wtf/policies/terms/" target="_blank">Terms</Link> and <Link to="/wtf/policies/privacy/" target="_blank">Privacy Policy</Link></label>
          {showEmailMessage &&
            <p className="HoppyStatusMessage hasContent">{emailMessage}</p>
          }
          {showTermMessage &&
            <p className="HoppyStatusMessage hasContent">{termsMessage}</p>
          }
          <FormButton className="FormButton isRounded isGreen" disabled={!isValid} tabIndex="2">
            Create account
          </FormButton>
        </form>
        {!inEditorial && <Link className={accountLinkStyle} onClick={this.onClickLogin} to="/enter">Already have an account?</Link>}
      </div>
    )
  }

  renderConfirmationCodeForm() {
    const { confirmationCodeFormStatus, emailValue } = this.state
    const { confirmationCode, confirmationCodeRequestStatus } = this.props
    const message = (confirmationCodeRequestStatus === REQUEST_STATUS.FAILURE) &&
      ERROR_MESSAGES.CONFIRMATION_CODE.INVALID
    const isValid = isFormValid([confirmationCodeFormStatus])
    const isRequesting = confirmationCodeFormStatus === STATUS.REQUEST

    return (
      <div className={emailFormWrapperStyle}>
        <h1>
          Join The Creators Network.
        </h1>
        <h2>
          <button onClick={this.onClickBack}><BackIcon /> Back</button>
        </h2>
        <h2>
          You will receive a confirmation code via email.
          Please click the link, or enter the code below.
        </h2>
        {message && <p>{message}</p>}
        <form
          className="AuthenticationForm"
          noValidate="novalidate"
          onSubmit={this.onSubmitCode}
        >
          <ConfirmationCodeControl
            classList="isBoxControl"
            label="Confirmation Code"
            onChange={this.onChangeCodeControl}
            tabIndex="1"
            text={confirmationCode}
          />
          {isRequesting && <p className="HoppyStatusMessage">checking...</p>}
          <FormButton className="FormButton isRounded isGreen" disabled={!isValid && !isRequesting} tabIndex="2">
            Verify Email
          </FormButton>
        </form>
        <button
          className={clickHereStyle}
          onClick={this.onClickResendCode}
        >
          Click here
        </button> to resend the confirmation code to {emailValue}.
      </div>
    )
  }

  render() {
    const { emailFormStatus, confirmationCodeFormStatus } = this.state
    if (confirmationCodeFormStatus === STATUS.SUBMITTED) {
      return this.renderSignupForm()
    } else if (emailFormStatus === STATUS.SUBMITTED) {
      return this.renderConfirmationCodeForm()
    }

    return this.renderEmailForm()

  }
}

export default connect(mapStateToProps)(RegistrationRequestForm)

