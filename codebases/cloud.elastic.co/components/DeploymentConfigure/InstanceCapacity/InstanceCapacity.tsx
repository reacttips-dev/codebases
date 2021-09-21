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

import React from 'react'

import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'
import { get, isNil } from 'lodash'

import { EuiFormHelpText, EuiSpacer, EuiTitle } from '@elastic/eui'

import { ElasticsearchClusterPlan } from '../../../lib/api/v1/types'
import DiscreteSizePicker from '../../DiscreteSizePicker'

import Field, { CompositeField, DiffLabel } from '../../Field'
import toNumber from '../../../lib/toNumber'
import prettySize from '../../../lib/prettySize'
import { planPaths } from '../../../config/clusterPaths'
import { instanceCapacities, premiumInstanceCapacities } from '../../../constants/capacities'
import ExternalLink from '../../ExternalLink'

import './instanceCapacity.scss'

const MIN_PRODUCTION_RECOMMENDATION = 4096

const messages = defineMessages({
  memoryStorageValues: {
    id: `deployment-configure-instance-capacity.memory-storage-values`,
    defaultMessage: `{ memory } memory / { storage } storage`,
  },
})

type Props = {
  intl: IntlShape
  plan: ElasticsearchClusterPlan
  updatePlan: (path: string | string[], value: any) => void
  lastSuccessfulPlan: ElasticsearchClusterPlan | null
  nodeConfiguration: { overrides: { diskToMemoryRatioPath: number } }
  userProfileLevel: string
  isFixed: boolean
}

const clusterSizeRecommendation = (
  <div className='cluster-size-recommendation'>
    <div className='cluster-size-recommendation-line' />
    <div className='cluster-size-recommendation-text'>
      <FormattedMessage
        id='deployment-configure-instance-capacity.recommended-for-production'
        defaultMessage='Recommended for production'
      />
    </div>
  </div>
)

function getOptions(nodeConfiguration, userProfileLevel, isFixed, instanceCapacity, formatMessage) {
  const diskToMemoryRatioPath = [`overrides`, `diskToMemoryRatio`]
  const diskToMemoryRatio = get(nodeConfiguration, diskToMemoryRatioPath)

  const allCapacityOptions =
    userProfileLevel === `premium` ? premiumInstanceCapacities : instanceCapacities

  const includeInstanceCapacity =
    instanceCapacity != null && !allCapacityOptions.includes(instanceCapacity)

  const capacityOptions = includeInstanceCapacity
    ? [instanceCapacity, ...allCapacityOptions]
    : allCapacityOptions

  const options = capacityOptions.map((capacity) => ({
    value: capacity.toString(),
    text: prettySize(capacity) + `\n` + prettySize(capacity * diskToMemoryRatio),
    mobileText: formatMessage(messages.memoryStorageValues, {
      memory: prettySize(capacity),
      storage: prettySize(capacity * diskToMemoryRatio),
    }),
    disabled: isFixed && capacity !== instanceCapacity,
    children: capacity !== MIN_PRODUCTION_RECOMMENDATION ? undefined : clusterSizeRecommendation,
  }))

  return options
}

function InstanceCapacity({
  intl,
  plan,
  updatePlan,
  lastSuccessfulPlan,
  nodeConfiguration,
  userProfileLevel,
  isFixed,
}: Props) {
  const instanceCapacity = get(plan, planPaths.instanceCapacity)
  const lastInstanceCapacity = get(lastSuccessfulPlan, planPaths.instanceCapacity)
  const highlight = lastInstanceCapacity && lastInstanceCapacity !== instanceCapacity

  const options = getOptions(
    nodeConfiguration,
    userProfileLevel,
    isFixed,
    instanceCapacity,
    intl.formatMessage,
  )

  return (
    <Field className='instanceCapacity'>
      <DiffLabel
        iconTitle={
          highlight
            ? `You selected ${prettySize(instanceCapacity)} node capacity. (It was ${prettySize(
                lastInstanceCapacity,
              )} before.)`
            : null
        }
      >
        <EuiTitle size='xs'>
          <h3>
            <FormattedMessage
              id='deployment-configure-instance-capacity.node-capacity'
              defaultMessage='Node capacity (Memory / Storage)'
            />
          </h3>
        </EuiTitle>
      </DiffLabel>

      <CompositeField>
        <EuiSpacer size='xs' />
        <DiscreteSizePicker
          mobileThreshold={1300}
          data-test-id='deploymentConfigure-instanceCapacity'
          value={isNil(instanceCapacity) ? `` : instanceCapacity.toString()}
          onChange={(newValue) => updatePlan(planPaths.instanceCapacity, toNumber(newValue))}
          options={options}
        />

        <EuiFormHelpText>
          <FormattedMessage
            id='deployment-configure-instance-capacity.choose-cluster-node-size'
            defaultMessage='Choose the size of memory and disk for each node in the deployment. Deployment size can be changed later without downtime. Need a larger deployment? {contactUs}'
            values={{
              contactUs: (
                <ExternalLink href='https://www.elastic.co/cloud/contact'>
                  <FormattedMessage
                    id='deployment-configure-instance-capacity.contact-us'
                    defaultMessage='Contact us.'
                  />
                </ExternalLink>
              ),
            }}
          />
        </EuiFormHelpText>
      </CompositeField>
    </Field>
  )
}

export default injectIntl(InstanceCapacity)
