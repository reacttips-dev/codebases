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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import loadable from '@loadable/component'

import {
  EuiButton,
  EuiFormHelpText,
  EuiIcon,
  EuiLoadingContent,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui'

import { CuiAlert } from '../../cui/Alert'

import { AsyncRequestState } from '../../types'
import { AuthenticationInfo } from '../../lib/api/v1/types'

import lightTheme from '../../lib/theme/light'

import swordIcon from '../../files/sword.svg'

// We use lazy loading here to cut off circular dependencies
const EnableTwoFactorAuth = loadable(() => import(`./EnableTwoFactorAuth`), {
  fallback: <EuiLoadingContent />,
})

const EnableTwoFactorAuthOkta = loadable(() => import(`./EnableTwoFactorAuthOkta`), {
  fallback: <EuiLoadingContent />,
})

const Sudo = loadable(() => import(`./Sudo`), {
  fallback: <EuiLoadingContent />,
})

const { euiBreakpoints } = lightTheme

type StateProps = {
  authenticationInfo: AuthenticationInfo | null
  fetchAuthenticationInfoRequest: AsyncRequestState
}

type DispatchProps = {
  fetchAuthenticationInfo: () => void
}

type ConsumerProps = {
  onSudo?: (result: any) => void
  close: (success: boolean) => void
}

type Props = StateProps & DispatchProps & ConsumerProps

class UserSudoModal extends Component<Props> {
  componentDidMount() {
    const { fetchAuthenticationInfo } = this.props
    fetchAuthenticationInfo()
  }

  render() {
    const { close } = this.props

    return (
      <EuiOverlayMask>
        <EuiModal onClose={() => close(false)} style={{ width: euiBreakpoints.m }}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage id='user-sudo-modal.title' defaultMessage='Sudo power' />
              &nbsp;
              <EuiIcon type={swordIcon} size='l' />
              <EuiFormHelpText style={{ paddingTop: 0 }}>
                <FormattedMessage
                  id='user-sudo-modal.zelda-quote'
                  defaultMessage="It's dangerous to go alone! Take this."
                />
              </EuiFormHelpText>
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>{this.renderContent()}</EuiModalBody>

          <EuiModalFooter>
            <EuiButton onClick={() => close(false)}>
              <FormattedMessage id='user-sudo-modal.close' defaultMessage='Close' />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderContent() {
    const { authenticationInfo, fetchAuthenticationInfoRequest } = this.props

    if (fetchAuthenticationInfoRequest.error) {
      return <CuiAlert type='error'>{fetchAuthenticationInfoRequest.error}</CuiAlert>
    }

    if (!authenticationInfo) {
      return <EuiLoadingContent />
    }

    if (authenticationInfo.has_totp_device) {
      return <Sudo onSudo={this.onAfterSudo} authenticationInfo={authenticationInfo} />
    }

    if (authenticationInfo.totp_device_source === `okta`) {
      return (
        <EnableTwoFactorAuthOkta
          enableMfaHref={authenticationInfo.totp_device_source_enable_mfa_href!}
        />
      )
    }

    return <EnableTwoFactorAuth />
  }

  onAfterSudo = (result) => {
    const { onSudo, close } = this.props

    close(true)

    if (onSudo) {
      onSudo(result)
    }
  }
}

export default UserSudoModal
