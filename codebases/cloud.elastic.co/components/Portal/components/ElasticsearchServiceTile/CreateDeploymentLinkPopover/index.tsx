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

import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { noop } from 'lodash'
import { EuiButtonEmpty, EuiPopover, EuiText } from '@elastic/eui'
import { CuiRouterLinkButtonEmpty, CuiLink } from '../../../../../cui'

import { createDeploymentUrl } from '../../../../../lib/urlBuilder'
import { accountBillingUrl } from '../../../../../apps/userconsole/urls'

interface Props {
  hasExpiredTrial: boolean
  hasNoDeployments: boolean
  inTrial: boolean
  unSubscribed: boolean
}

interface State {
  isOpen: boolean
  isPersistOpen: boolean
}

class CreateDeploymentLinkPopover extends PureComponent<Props, State> {
  mouseLeaveTimeout?: number = undefined

  state = {
    isOpen: false,
    isPersistOpen: false,
  }

  componentWillUnmount() {
    clearTimeout(this.mouseLeaveTimeout)
  }

  render() {
    const { unSubscribed } = this.props
    const canCreateDeployment = this.canCreateDeployment()

    return (
      <EuiPopover
        id='portal-deployments-create-deployment-link-popover'
        className='portal-deployments-create-deployment-link-button'
        onMouseEnter={canCreateDeployment || unSubscribed ? noop : this.onMouseOver}
        onMouseLeave={canCreateDeployment || unSubscribed ? noop : this.onMouseLeave}
        button={this.renderButtonLink()}
        isOpen={this.state.isOpen}
        closePopover={this.toggle}
        panelPaddingSize='m'
        anchorPosition='upCenter'
      >
        <EuiText style={{ maxWidth: '500px' }}>{this.renderPopoverContent()}</EuiText>
      </EuiPopover>
    )
  }

  renderPopoverContent() {
    const { inTrial } = this.props

    if (!inTrial) {
      return null
    }

    return (
      <FormattedMessage
        id='portal-deployments.create-deployment-limited-to-one'
        defaultMessage='Trials are limited to a one deployment at a time. {subscribe} to create additional deployments'
        values={{
          subscribe: (
            <CuiLink to={accountBillingUrl()}>
              <FormattedMessage
                id='portal-deployments.provide-cc-details'
                defaultMessage='Provide your credit card'
              />
            </CuiLink>
          ),
        }}
      />
    )
  }

  renderButtonLink() {
    const { unSubscribed } = this.props
    const canCreateDeployment = this.canCreateDeployment()

    if (canCreateDeployment) {
      return (
        <CuiRouterLinkButtonEmpty
          color='primary'
          to={createDeploymentUrl()}
          data-test-id='portal-deployments-create-deployment-link'
        >
          {this.renderButtonLinkText()}
        </CuiRouterLinkButtonEmpty>
      )
    }

    return (
      <EuiButtonEmpty
        color='primary'
        isDisabled={unSubscribed}
        onClick={this.toggle}
        data-test-id='portal-deployments-create-deployment-link'
      >
        {this.renderButtonLinkText()}
      </EuiButtonEmpty>
    )
  }

  renderButtonLinkText() {
    return (
      <EuiText size='s'>
        <FormattedMessage
          id='portal-deployments.create-deployment-link'
          defaultMessage='Create deployment'
        />
      </EuiText>
    )
  }

  canCreateDeployment() {
    const { hasExpiredTrial, hasNoDeployments, inTrial, unSubscribed } = this.props

    if (inTrial) {
      return !hasExpiredTrial && hasNoDeployments
    }

    return !unSubscribed
  }

  toggle = () => {
    this.setState((prevState: State) => {
      const isOpen = prevState.isOpen
      let isPersistOpen = !(!prevState.isPersistOpen && isOpen)

      if (prevState.isPersistOpen) {
        isPersistOpen = !isOpen
      }

      return {
        isPersistOpen,
        isOpen: isPersistOpen,
      }
    })
  }

  onMouseOver = () => {
    this.setState({ isOpen: true }, () => {
      clearTimeout(this.mouseLeaveTimeout)
    })
  }

  onMouseLeave = () => {
    if (!this.state.isPersistOpen) {
      this.mouseLeaveTimeout = window.setTimeout(() => {
        this.setState({ isOpen: false })
      }, 500)
    }
  }
}

export default CreateDeploymentLinkPopover
