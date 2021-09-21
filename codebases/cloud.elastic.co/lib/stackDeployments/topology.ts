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

import { groupBy, map, sortBy } from 'lodash'
import { defineMessages, IntlShape } from 'react-intl'

import { InstanceSummary } from '../../types'

const messages = defineMessages({
  describeTopologyElement: {
    id: `describe-topology.topology-element`,
    defaultMessage: `{nodeCount} x {name}`,
  },
})

export const describeTopology = ({
  instanceSummaries,
  formatMessage,
}: {
  instanceSummaries: InstanceSummary[]
  formatMessage: IntlShape['formatMessage']
}): string =>
  sortBy(
    map(groupBy(instanceSummaries, `instance.instance_configuration.name`), (instances, name) => ({
      name,
      nodeCount: instances.length,
    })),
    `name`,
  )
    .map((config) => formatMessage(messages.describeTopologyElement, config))
    .join(`, `)
