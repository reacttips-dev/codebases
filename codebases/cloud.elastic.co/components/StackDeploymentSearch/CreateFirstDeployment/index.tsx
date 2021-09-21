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
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import { EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import firstDeployment from '../../../files/first-deployment.svg'

import CreateDeploymentLink from '../CreateDeploymentLink'

import './createFirstDeployment.scss'

type Props = {
  createDisabled: boolean
  disabled?: boolean
  restartTrial: boolean
  intl: IntlShape
}

const messages = defineMessages({
  deploymentAlt: {
    id: `create-first-deployment.deployment-illustration`,
    defaultMessage: `An illustration of a deployment.`,
  },
})

const CreateFirstDeployment: FunctionComponent<Props> = ({
  createDisabled,
  disabled,
  restartTrial,
  intl: { formatMessage },
}) => (
  <div className='create-first-deployment'>
    <img src={firstDeployment} alt={formatMessage(messages.deploymentAlt)} width='424px' />

    <EuiSpacer size='m' />

    <EuiTitle>
      <h1>
        <FormattedMessage
          id='create-first-deployment.heading'
          defaultMessage='Create your first deployment'
        />
      </h1>
    </EuiTitle>

    <EuiText color='subdued'>
      <p>
        <FormattedMessage
          id='create-first-deployment.description'
          defaultMessage='Deployments help you manage the Elasticsearch cluster and other Elastic products, like a Kibana or APM instance, in one place. Spin up, scale, upgrade, and delete all from a deployment.'
        />
      </p>
    </EuiText>

    <EuiSpacer />
    <CreateDeploymentLink
      createDisabled={createDisabled}
      disabled={disabled}
      restartTrial={restartTrial}
    />
  </div>
)

export default injectIntl(CreateFirstDeployment)
