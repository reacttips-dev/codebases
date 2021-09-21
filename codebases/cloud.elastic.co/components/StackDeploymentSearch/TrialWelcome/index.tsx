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

import { EuiHorizontalRule, EuiIcon, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import { ProfileState } from '../../../types'

import './trialWelcome.scss'

type Props = {
  profile: NonNullable<ProfileState>
}

const TrialWelcome: FunctionComponent<Props> = ({ profile }) => {
  const { trial_length } = profile

  return (
    <div>
      <div className='deployments-trialWelcome'>
        <EuiTitle size='l'>
          <h2>
            <EuiIcon type='logoElastic' size='xl' className='deployments-trialWelcomeLogo' />
            <FormattedMessage
              id='deployments-index.in-trial'
              defaultMessage='Welcome to your {days}-day trial!'
              values={{
                days: trial_length,
              }}
            />
          </h2>
        </EuiTitle>
        <EuiSpacer size='s' />

        <div className='deployments-trialDescription'>
          <EuiText>
            <p>
              <FormattedMessage
                id='deployments-index.trial-description-1'
                defaultMessage='Enjoy your free deployment with the latest Elasticsearch and Kibana versions, security features, machine learning, and much more. It’s all on us. If you enjoy the Elasticsearch Service, add a credit card and only pay for what you use.'
              />
            </p>
          </EuiText>
        </div>

        <EuiSpacer size='s' />
      </div>

      <EuiHorizontalRule />
    </div>
  )
}

export default TrialWelcome
