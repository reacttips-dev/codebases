/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import React, { Component, ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { get } from 'lodash'

import LandingPageContainer from '../../../../../components/LandingPageContainer/NewLandingPageContainer'
import InvalidToken from './InvalidToken'

import VerificationFailed from './VerificationFailed'
import FetchingDetails from './FetchingDetails'
import AccountVerified from './AccountVerified'

import history from '../../../../../lib/history'

import { AsyncRequestState } from '../../../../../types'

import verifyEmailLight from '../../../../../files/illustration-check-email-light.svg'
import verifyEmailDark from '../../../../../files/illustration-check-email-dark.svg'
import lightLock from '../../../../../files/cloud-lock-white.svg'
import darkLock from '../../../../../files/cloud-lock-dark.svg'
import lightTraining from '../../../../../files/training-lightmode.svg'
import darkTraining from '../../../../../files/training-darkmode.svg'
import supportLight from '../../../../../files/welcome-support.svg'
import supportDark from '../../../../../files/welcome-support-darkmode.svg'
import communityLight from '../../../../../files/illustration-community.svg'
import communityDark from '../../../../../files/illustration-community-darkmode.svg'

import './passwordUpdateViaEmailLink.scss'

interface Props {
  activate: boolean
  email?: string
  activationHash?: string
  verificationHash?: string
  expires: number | null
  redirectTo?: string
  source?: string
  loginRequest: AsyncRequestState
  setInitialPasswordRequest: AsyncRequestState
  title?: ReactElement
  type?: 'login' | 'signup'
  verifyAccount: (email: string, expires: number, hash: string | undefined) => void
  verifyAccountRequest: AsyncRequestState
  requiresAccountVerification?: boolean
  withWelcomeImage?: boolean
}

enum ViewState {
  INIT = 'INIT',
  VERIFYING_ACCOUNT = 'VERIFYING_ACCOUNT',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  SET_PASSWORD = 'SET_PASSWORD',
  VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',
}

interface State {
  viewState: ViewState
}

class PasswordUpdateViaEmailLink extends Component<Props, State> {
  state: State = {
    viewState: ViewState.INIT,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    const {
      activate,
      email,
      expires,
      requiresAccountVerification,
      verificationHash,
      verifyAccount,
      verifyAccountRequest,
    } = nextProps

    const { viewState } = prevState

    if (!requiresAccountVerification) {
      return null
    }

    if (viewState === ViewState.INIT) {
      if (
        verifyAccountRequest.inProgress ||
        verifyAccountRequest.isDone ||
        verifyAccountRequest.error
      ) {
        return null
      }

      // If our parameters are absent then someone has accessed a bad URL
      // Redirect since there's nothing else to be done.
      if (!email || !expires) {
        history.replace(`/`)
        return null
      }

      if (verificationHash) {
        verifyAccount(email, expires, verificationHash)
        return { viewState: ViewState.VERIFYING_ACCOUNT }
      }

      // If our parameters are absent then someone has accessed a bad URL
      // Redirect since there's nothing else to be done.
      history.replace(`/`)
      return null
    }

    if (viewState === ViewState.VERIFYING_ACCOUNT) {
      if (verifyAccountRequest.error) {
        return { viewState: ViewState.VERIFICATION_FAILED }
      }

      if (!verifyAccountRequest.isDone) {
        return null
      }

      if (activate) {
        // set password for old registration
        return { viewState: ViewState.SET_PASSWORD }
      }

      return { viewState: ViewState.VERIFICATION_SUCCESS }
    }

    return null
  }

  render(): ReactNode {
    const { requiresAccountVerification } = this.props

    if (!requiresAccountVerification) {
      return this.renderForm()
    }

    return this.renderAccountVerificationContent()
  }

  renderAccountVerificationContent(): ReactNode | null {
    const { verifyAccountRequest } = this.props
    const { viewState } = this.state
    const image = this.getStaticImage()
    const title = this.renderTitle()

    switch (viewState) {
      case ViewState.INIT:
      case ViewState.VERIFYING_ACCOUNT:
        return <FetchingDetails title={title} {...image} />

      case ViewState.VERIFICATION_FAILED:
        return (
          <VerificationFailed
            title={title}
            verifyAccountRequest={verifyAccountRequest}
            {...image}
          />
        )

      case ViewState.SET_PASSWORD:
        return this.renderForm()

      case ViewState.VERIFICATION_SUCCESS:
        return <AccountVerified {...image} />

      default:
        return null
    }
  }

  renderTitle(): ReactElement {
    const { title } = this.props

    if (!title) {
      return (
        <FormattedMessage
          id='password-update-via-email.title'
          defaultMessage='Welcome to Elastic Cloud'
        />
      )
    }

    return title
  }

  renderForm(): ReactElement {
    const { children, type } = this.props
    const tokenInvalid = this.isInvalidToken()

    return (
      <LandingPageContainer
        type={type}
        title={this.renderTitle()}
        subtitle={tokenInvalid && <InvalidToken />}
        {...this.getStaticImage()}
      >
        {!tokenInvalid && children}
      </LandingPageContainer>
    )
  }

  isInvalidToken(): boolean {
    const { setInitialPasswordRequest } = this.props
    const error = setInitialPasswordRequest.error
    const errorCode = get(error, [`body`, `errors`, `0`, `code`])

    return errorCode === 'user.token_expired' || errorCode === 'user.token_already_used'
  }

  getStaticImage(): { image: string; darkImage: string } {
    const { viewState } = this.state
    const sourceContextImage = this.getSourceContextImage()

    return {
      image:
        viewState === ViewState.VERIFICATION_SUCCESS ? verifyEmailLight : sourceContextImage.image,
      darkImage:
        viewState === ViewState.VERIFICATION_SUCCESS
          ? verifyEmailDark
          : sourceContextImage.darkImage,
    }
  }

  getSourceContextImage(): { image: string; darkImage: string } {
    const { source, withWelcomeImage } = this.props

    if (withWelcomeImage) {
      if (source === `training`) {
        return {
          image: lightTraining,
          darkImage: darkTraining,
        }
      }

      if (source === `support`) {
        return {
          image: supportLight,
          darkImage: supportDark,
        }
      }

      if (source && source.startsWith('community')) {
        return {
          image: communityLight,
          darkImage: communityDark,
        }
      }
    }

    return {
      image: lightLock,
      darkImage: darkLock,
    }
  }
}

export default PasswordUpdateViaEmailLink
