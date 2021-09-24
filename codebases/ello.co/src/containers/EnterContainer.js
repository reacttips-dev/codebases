import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { replace } from 'react-router-redux'
import debounce from 'lodash/debounce'
import set from 'lodash/set'
import { signIn } from '../actions/authentication'
import { loadProfile, requestPushSubscription } from '../actions/profile'
import FormButton from '../components/forms/FormButton'
import PasswordControl from '../components/forms/PasswordControl'
import TextControl from '../components/forms/TextControl'
import {
  isFormValid,
  getUserStateFromClient,
  getPasswordState,
} from '../components/forms/Validators'
import { MainView } from '../components/views/MainView'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { isAndroid, isElloAndroid } from '../lib/jello'
import { loginToken } from '../networking/api'
import {
  selectBuildVersion,
  selectBundleId,
  selectMarketingVersion,
  selectRegistrationId,
  selectWebOnboardingVersion,
} from '../selectors/profile'
import { css } from '../styles/jss'
import * as s from '../styles/jso'

const forgotPasswordLink = css({ marginTop: 15 }, s.fontSize14, s.colorWhite)

function renderStatus(state) {
  return () => {
    if (state.status === STATUS.FAILURE) {
      return <p className="HoppyStatusMessage hasContent">{state.message}</p>
    }
    return <p className="HoppyStatusMessage"><span /></p>
  }
}

function mapStateToProps(state) {
  const obj = {
    webOnboardingVersionSeen: selectWebOnboardingVersion(state),
  }
  if (isElloAndroid()) {
    obj.buildVersion = selectBuildVersion(state)
    obj.bundleId = selectBundleId(state)
    obj.marketingVersion = selectMarketingVersion(state)
    obj.registrationId = selectRegistrationId(state)
  }
  return obj
}

class EnterContainer extends PureComponent {

  static propTypes = {
    buildVersion: PropTypes.string,
    bundleId: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    marketingVersion: PropTypes.string,
    registrationId: PropTypes.string,
    webOnboardingVersionSeen: PropTypes.string,
  }

  componentWillMount() {
    this.state = {
      passwordState: { status: STATUS.INDETERMINATE, message: '' },
      showPasswordError: false,
      showUserError: false,
      userState: { status: STATUS.INDETERMINATE, message: '' },
      formStatus: STATUS.INDETERMINATE,
    }
    this.userValue = ''
    this.passwordValue = ''

    this.delayedShowUserError = debounce(this.delayedShowUserError, 1000)
    this.delayedShowPasswordError = debounce(this.delayedShowPasswordError, 1000)
  }

  componentWillReceiveProps(nextProps) {
    if (typeof this.props.webOnboardingVersionSeen === 'undefined' &&
        this.props.webOnboardingVersionSeen !== nextProps.webOnboardingVersionSeen) {
      const { dispatch } = this.props
      if (!nextProps.webOnboardingVersionSeen) {
        dispatch(replace({ pathname: '/onboarding' }))
      } else {
        dispatch(replace({ pathname: '/' }))
      }
    }
  }

  componentWillUnmount() {
    // Cancel lingering debounced methods
    this.delayedShowUserError.cancel()
    this.delayedShowPasswordError.cancel()
  }

  onChangeUserControl = ({ usernameOrEmail }) => {
    this.setState({ showUserError: false })
    this.delayedShowUserError()
    this.userValue = usernameOrEmail
    const { userState, formStatus } = this.state
    const currentStatus = userState.status
    const newState = getUserStateFromClient({ value: usernameOrEmail, currentStatus, formStatus })
    if (newState.status !== currentStatus) {
      this.setState({ userState: newState })
    }
  }

  onChangePasswordControl = ({ password }) => {
    this.setState({ showPasswordError: false })
    this.delayedShowPasswordError()
    this.passwordValue = password
    const { passwordState } = this.state
    const currentStatus = passwordState.status
    const newState = getPasswordState({ value: password, currentStatus })
    if (newState.status !== currentStatus) {
      this.setState({ passwordState: newState })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.setState({ formStatus: STATUS.SUBMITTED })

    const { dispatch, registrationId } = this.props
    const action = signIn(this.userValue, this.passwordValue)

    set(action, 'meta.successAction', () => {
      dispatch(loadProfile())
      // if we have a registrationId on login send the subscription
      // up again since this could be a new user that logged in
      if (registrationId) {
        const { buildVersion, bundleId, marketingVersion } = this.props
        dispatch(requestPushSubscription(registrationId, bundleId, marketingVersion, buildVersion))
      }
    })
    set(action, 'meta.failureAction', () => this.setState({
      failureMessage: 'Your username/email or password are incorrect',
    }))

    dispatch(action)
  }

  delayedShowUserError = () => {
    this.setState({ showUserError: true })
  }

  delayedShowPasswordError = () => {
    this.setState({ showPasswordError: true })
  }

  render() {
    const { userState, showUserError, passwordState, showPasswordError } = this.state
    const isValid = isFormValid([userState, passwordState])
    const droidBlur = isAndroid() ? () => document.body.classList.remove('isCreditsHidden') : null
    const droidFocus = isAndroid() ? () => document.body.classList.add('isCreditsHidden') : null
    return (
      <MainView className="Authentication">
        <div className="AuthenticationFormDialog">
          <h1>Welcome back.</h1>
          <form
            action={loginToken().path}
            className="AuthenticationForm"
            id="NewSessionForm"
            method="POST"
            noValidate="novalidate"
            onSubmit={this.onSubmit}
          >
            <TextControl
              classList="isBoxControl"
              id="usernameOrEmail"
              label="Username or Email"
              name="user[usernameOrEmail]"
              onBlur={droidBlur}
              onFocus={droidFocus}
              onChange={this.onChangeUserControl}
              placeholder="Enter your username or email"
              renderStatus={showUserError ? renderStatus(userState) : null}
              tabIndex="1"
              trimWhitespace
            />
            <PasswordControl
              classList="isBoxControl"
              label="Password"
              onBlur={droidBlur}
              onFocus={droidFocus}
              onChange={this.onChangePasswordControl}
              renderStatus={showPasswordError ? renderStatus(passwordState) : null}
              tabIndex="2"
            />
            {this.state.failureMessage ? <p>{this.state.failureMessage}</p> : null}
            <FormButton className="FormButton isRounded" disabled={!isValid} tabIndex="3">
              Log in
            </FormButton>
          </form>
          <Link className={forgotPasswordLink} to="/forgot-password">Forgot password?</Link>
        </div>
      </MainView>
    )
  }
}

export default connect(mapStateToProps)(EnterContainer)

