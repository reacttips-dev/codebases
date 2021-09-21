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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui'

import LocalStorageKey from '../../../../../constants/localStorageKeys'
import history from '../../../../../lib/history'
import { accountBillingUrl } from '../../../../../apps/userconsole/urls'

import trialExpiredIllustration from '../../../../../files/illustration-hour-glass-128-white-bg.svg'
import trialExpiredIllustrationDark from '../../../../../files/illustration-hour-glass-128-ink-bg.svg'

interface Props {
  disableButtons: boolean
  theme: 'dark' | 'light'
}

const gotoBillingDetails = () => {
  localStorage.setItem(LocalStorageKey.trialExperienceDismissed, 'true')
  history.push(accountBillingUrl())
}

const TrialExpiredPrompt: FunctionComponent<Props> = ({ disableButtons, theme }) => {
  const themes = {
    light: trialExpiredIllustration,
    dark: trialExpiredIllustrationDark,
  }

  return (
    <EuiEmptyPrompt
      className='no-deployment-state-prompt'
      iconType={themes[theme]}
      title={
        <h3>
          <FormattedMessage
            id='no-deployment-state.expired-trial'
            defaultMessage='Your trial is over'
          />
        </h3>
      }
      body={
        <p>
          <FormattedMessage
            id='no-deployment-state.expired-trial-info'
            defaultMessage='Your deployment has been terminated. Provide your credit card details to restore your deployment and continue using Elasticsearch Service.'
          />
        </p>
      }
      actions={[
        <EuiButton
          className='create-deployment-button'
          isDisabled={disableButtons}
          fill={true}
          onClick={gotoBillingDetails}
        >
          <FormattedMessage
            id='no-deployment-state.subscribe'
            defaultMessage='Provide billing details'
          />
        </EuiButton>,
      ]}
    />
  )
}

export default TrialExpiredPrompt
