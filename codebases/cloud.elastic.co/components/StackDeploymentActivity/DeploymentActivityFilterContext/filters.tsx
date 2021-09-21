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

import { uniqBy } from 'lodash'

import React from 'react'
import { defineMessages, WrappedComponentProps } from 'react-intl'

import { FieldValueOptionType, SearchFilterConfig } from '@elastic/eui'

import { excludeSchemalessFields } from '../../../cui'

import {
  StackConfigurationChangeSource,
  getSourceAttribution,
} from '../../StackDeploymentConfigurationChange'

import { getSchema } from './schema'

import { ResourceChangeAttempt } from '../../../types'

type Params = WrappedComponentProps & {
  planAttempts: ResourceChangeAttempt[]
}

const messages = defineMessages({
  successfulLabel: {
    id: `deployment-activity-filter-context.successful-label`,
    defaultMessage: `Successful`,
  },
  unsuccessfulLabel: {
    id: `deployment-activity-filter-context.unsuccessful-label`,
    defaultMessage: `Unsuccessful`,
  },
  pendingLabel: {
    id: `deployment-activity-filter-context.pending-label`,
    defaultMessage: `Pending`,
  },
  finishedLabel: {
    id: `deployment-activity-filter-context.finished-label`,
    defaultMessage: `Finished`,
  },
  systemLabel: {
    id: `deployment-activity-filter-context.system-label`,
    defaultMessage: `System`,
  },
  sourceLabel: {
    id: `deployment-activity-filter-context.source-label`,
    defaultMessage: `Source`,
  },
})

export function getFilters({ intl: { formatMessage }, planAttempts }: Params) {
  const planAttemptsWithSource = planAttempts.filter(getPlanAttemptSource)

  const sources: FieldValueOptionType[] = uniqBy<ResourceChangeAttempt>(
    planAttemptsWithSource,
    getPlanAttemptSource,
  )
    .sort()
    .map(({ planAttempt }) => getSourceAttribution({ planAttempt }))
    .filter(Boolean)
    .map((action) => ({
      value: action!,
      view: (
        <div className='deploymentActivityFilterContext-source'>
          <StackConfigurationChangeSource action={action!} />
        </div>
      ),
    }))

  const filters: SearchFilterConfig[] = [
    {
      type: `field_value_toggle_group`,
      field: `healthy_configuration`,
      items: [
        {
          name: formatMessage(messages.successfulLabel),
          value: `y`,
        },
        {
          name: formatMessage(messages.unsuccessfulLabel),
          value: `n`,
        },
      ],
    },
    {
      type: `field_value_toggle_group`,
      field: `pending`,
      items: [
        {
          name: formatMessage(messages.pendingLabel),
          value: `y`,
        },
        {
          name: formatMessage(messages.finishedLabel),
          value: `n`,
        },
      ],
    },
    {
      type: `field_value_toggle_group`,
      field: `system`,
      items: [
        {
          name: formatMessage(messages.systemLabel),
          value: `y`,
        },
      ],
    },
    {
      name: formatMessage(messages.sourceLabel),
      type: `field_value_selection`,
      filterWith: `includes`,
      field: `source`,
      multiSelect: `or`,
      options: sources,
    },
  ]

  const { schema } = getSchema()

  /* Remove fields that aren't in the schema declaration,
   * such as `system` in ECE
   */
  return excludeSchemalessFields({ filters, schema })
}

function getPlanAttemptSource({ planAttempt }: ResourceChangeAttempt) {
  return planAttempt.source && planAttempt.source.action
}
