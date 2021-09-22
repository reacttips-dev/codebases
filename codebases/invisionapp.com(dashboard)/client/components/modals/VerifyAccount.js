import React from 'react'
import { browserHistory } from 'react-router'
import styled, { keyframes, css } from 'styled-components'
import { connect } from 'react-redux'
import { Text, Link } from '@invisionapp/helios'
import VerificationForm from '../forms/VerificationForm'
import ModalContent from '../Modal/ModalContent'
import Wrapper from './components/Wrapper'
import { trackPeopleTransferPO, trackPeopleTransferPOFailed } from '../../helpers/analytics'

const FADE_TIMEOUT = 5000
const EMPTY_VIEW = 'emptyView'
const ERROR_VIEW = 'errorView'
const RESEND_CODE_VIEW = 'resendCodeView'
const RESEND_CODE_SUCCESS_VIEW = 'resendCodeSuccessView'
const RESEND_CODE_ERROR_VIEW = 'resendCodeErrorView'

class VerifyAccount extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      view: RESEND_CODE_VIEW
    }
    this.errorMessageTimeout = null
    this.resendMessageTimeout = null
  }

  componentDidMount() {
    if (this.props.shouldDisplay && this.props.shouldDisplay(this.props.data)) {
      this.props.clearValidation()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // show error
    if (this.props.team?.transferError === false && nextProps.team?.transferError === true) {
      this.setState({ view: ERROR_VIEW })

      // and reset transferError after FADE_TIMEOUT ms
      if (this.errorMessageTimeout) {
        clearTimeout(this.errorMessageTimeout)
      }
      this.errorMessageTimeout = setTimeout(
        () => this.setState({ view: RESEND_CODE_VIEW }),
        FADE_TIMEOUT
      )
      return
    }

    if (nextProps.user.isSendingCode) {
      return
    }
    // isSendingCode === false
    if (nextProps.user.codeSent) {
      this.setState({ view: RESEND_CODE_SUCCESS_VIEW })
    } else {
      this.setState({ view: RESEND_CODE_ERROR_VIEW })
      trackPeopleTransferPOFailed()
    }

    if (this.resendMessageTimeout) {
      clearTimeout(this.resendMessageTimeout)
    }
    this.resendMessageTimeout = setTimeout(
      () => this.setState({ view: RESEND_CODE_VIEW }),
      FADE_TIMEOUT
    )
  }

  handleResend = e => {
    e.preventDefault()
    this.props.sendCode()
  }

  handleValidate = (code, done) => {
    this.props.onValidate(code, done, this.props.data)
  }

  handleSuccess = () => {
    trackPeopleTransferPO()
    browserHistory.push(this.props.route.afterVerify)
    // Why reload?
    // Because we want to refresh the page
    window.location.reload()
  }

  handleChange = code => {
    // hide all footer messages when a user starts to insert the digits
    this.setState(() => ({ view: code.length === 0 ? RESEND_CODE_VIEW : EMPTY_VIEW }))
  }

  // Note: I tried to create a stateless functional component but the slide-up,
  // when opening the modal, wasn't working properly.
  renderResendCodeView = () => {
    const { view } = this.state

    return (
      <div>
        <FadingGroup isVisible={view === RESEND_CODE_VIEW}>
          <Text order="body" color="text-lighter" align="center">
            Make sure to keep this window open while you check your inbox.{' '}
            <ResendLink order="primary" onClick={this.handleResend}>
              Resend
            </ResendLink>
          </Text>
        </FadingGroup>

        <FadingGroup isVisible={view === RESEND_CODE_SUCCESS_VIEW}>
          <Text order="body" color="text-lighter" align="center">
            Your code has been resent! Check your spam folder if you still donʼt see it.
          </Text>
        </FadingGroup>

        <FadingGroup isVisible={view === RESEND_CODE_ERROR_VIEW}>
          <Text order="body" color="text-lighter" align="center">
            Something went wrong. Please try again.
          </Text>
        </FadingGroup>
      </div>
    )
  }

  renderErrorView = () => {
    const { view } = this.state
    return (
      <FadingGroup isVisible={view === ERROR_VIEW}>
        <Error order="body" color="warning" align="center">
          The code you entered is incorrect. Please try again.
        </Error>
      </FadingGroup>
    )
  }

  render() {
    const { route, user } = this.props

    return (
      <ModalContent
        isVisible
        backButton
        closePortal={() => browserHistory.push(route.closeTo)}
        onBack={() => browserHistory.push(route.backTo)}
      >
        <Wrapper>
          <TitleWrap>
            <Title order="title" size="smaller" color="text-darker" align="center">
              Verify your email address.
            </Title>
            <Text order="body" size="larger" color="text-lighter" align="center">
              We just emailed a six-digit code to <strong>{user.member.email}</strong>.
            </Text>
            <Text order="body" size="larger" color="text-lighter" align="center">
              Enter the code below to complete the transfer of ownership.
            </Text>
          </TitleWrap>

          {/* Need to have the root form element here (instead of inside <VerificationForm />) in order to animate it */}
          <Form>
            <VerificationForm
              autoFocus
              hideError={this.state.view !== ERROR_VIEW}
              validateCode={this.handleValidate}
              onSuccess={this.handleSuccess}
              onChange={this.handleChange}
            />
          </Form>

          <Footer>
            {this.renderErrorView()}
            {this.renderResendCodeView()}
          </Footer>
        </Wrapper>
      </ModalContent>
    )
  }
}

export const Form = styled.form`
  margin: ${({ theme }) => theme.spacing.l} 0;
  text-align: center;
`

const Title = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const TitleWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  text-align: center;
`

const Error = styled(Text)``

const ResendLink = styled(Link)`
  background-image: none;
`

const FadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const FadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`
const Footer = styled.div`
  position: relative;
`

export const FadingGroup = styled.div`
  position: absolute;
  width: 100%;
  animation: ${({ isVisible }) =>
      isVisible
        ? css`
            ${FadeIn}
          `
        : css`
            ${FadeOut}
          `}
    0.5s linear;
  transition: visibility 0.5s linear;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`

export default connect()(VerifyAccount)
