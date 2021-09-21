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

import React, { PureComponent, Fragment } from 'react'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiCallOut, EuiButtonIcon } from '@elastic/eui'

import { CuiLink } from '../../../../cui'

import { accountBillingUrl } from '../../../../apps/userconsole/urls'

import { ProfileState, AsyncRequestState } from '../../../../types'

import './TrialStatusCallout.scss'

interface StatusProps {
  color: 'warning' | 'danger'
}

export type Props = {
  profile: NonNullable<ProfileState>
  fetchProfileRequest: AsyncRequestState
  onDismiss?: () => void
  deploymentActive: boolean
}

const messages = defineMessages({
  dismiss: {
    id: 'portal-deployments.trial-expiring-dismiss',
    defaultMessage: 'Dismiss',
  },
})

class TrialStatusCallout extends PureComponent<Props & WrappedComponentProps> {
  render() {
    const {
      intl: { formatMessage },
    } = this.props

    return (
      <Fragment>
        <div className='portal-deployments-trial-status-info'>
          <EuiButtonIcon
            className='portal-deployments-trial-status-info-close-button'
            color='text'
            iconType='cross'
            onClick={this.props.onDismiss}
            aria-label={formatMessage(messages.dismiss)}
          />
          <EuiCallOut {...this.getCalloutStatusProps()} className='portal-deployments-trial-status'>
            {this.getTrialCalloutMessage()}
          </EuiCallOut>
        </div>
      </Fragment>
    )
  }

  getCalloutStatusProps(): StatusProps {
    const { profile } = this.props
    const { trialDaysRemaining } = profile

    if (trialDaysRemaining === 0) {
      return {
        color: 'danger',
      }
    }

    return {
      color: 'warning',
    }
  }

  getTrialCalloutMessage() {
    const { profile, deploymentActive } = this.props
    const { trialDaysRemaining } = profile

    if (!trialDaysRemaining) {
      if (deploymentActive) {
        return (
          <FormattedMessage
            id='portal-deployments.trial-expired.deployment-active'
            defaultMessage='Your trial period expired and your deployment will be terminated. {subscribe} to continue using your Elasticsearch Service.'
            values={this.getTrialCalloutMessageValues()}
          />
        )
      }

      return (
        <FormattedMessage
          id='portal-deployments.trial-expired.deployment-terminated'
          defaultMessage='Your deployment is inactive. {subscribe} to continue using your Elasticsearch Service.'
          values={this.getTrialCalloutMessageValues()}
        />
      )
    }

    return (
      <FormattedMessage
        id='portal-deployments.trial-expiring-info'
        defaultMessage='Your trial is expiring soon. {subscribe} to continue using your Elasticsearch Service.'
        values={this.getTrialCalloutMessageValues()}
      />
    )
  }

  getTrialCalloutMessageValues() {
    return {
      subscribe: (
        <CuiLink to={accountBillingUrl()}>
          <FormattedMessage
            id='portal-deployments.trial-expiring-subscribe'
            defaultMessage='Provide your credit card'
          />
        </CuiLink>
      ),
    }
  }
}

export default injectIntl(TrialStatusCallout)
