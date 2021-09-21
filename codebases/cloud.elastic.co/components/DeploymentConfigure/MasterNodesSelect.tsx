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
import { defineMessages, injectIntl, FormattedMessage, IntlShape } from 'react-intl'

import { EuiSpacer, EuiSelect, EuiFormHelpText } from '@elastic/eui'

import { planPaths } from '../../config/clusterPaths'

import toNumber from '../../lib/toNumber'
import prettySize from '../../lib/prettySize'

import { masterOnlyCapacities } from '../../constants/capacities'

type MasterNodesSelectProps = {
  intl: IntlShape
  masterNodes?: number | null
  masterNodeCapacity?: number | null
  updatePlan: (path: string | string[], value: any) => void
}

const messages = defineMessages({
  memoryAmount: {
    id: `deployment-configure-master-only-nodes.memory-amount`,
    defaultMessage: `{ size } memory`,
  },
})

const MasterNodesSelect: FunctionComponent<MasterNodesSelectProps> = ({
  intl: { formatMessage },
  masterNodes,
  masterNodeCapacity,
  updatePlan,
}) => {
  if (!masterNodes || masterNodes < 1) {
    return null
  }

  const includeMasterNodeCapacity =
    masterNodeCapacity != null &&
    masterNodeCapacity !== 0 &&
    !masterOnlyCapacities.includes(masterNodeCapacity)

  const capacities = includeMasterNodeCapacity
    ? [masterNodeCapacity!, ...masterOnlyCapacities]
    : masterOnlyCapacities

  const options = capacities.map((capacity) => ({
    value: capacity,
    text: formatMessage(messages.memoryAmount, {
      size: prettySize(capacity),
    }),
  }))

  return (
    <div>
      <EuiSpacer size='m' />

      <EuiSelect
        value={masterNodeCapacity!}
        onChange={(e) => updatePlan(planPaths.masterNodeCapacity, toNumber(e.target.value))}
        options={options}
      />

      <EuiFormHelpText>
        <FormattedMessage
          id='deployment-configure-master-only-nodes.description-capacity'
          defaultMessage='Choose the size of each dedicated master-eligible node in the cluster'
        />
      </EuiFormHelpText>
    </div>
  )
}

export default injectIntl(MasterNodesSelect)
