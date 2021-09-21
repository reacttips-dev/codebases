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

import { isEmpty } from 'lodash'

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui'

import { CuiLink } from '../../../../cui'

import DocLink from '../../../../components/DocLink'

import { ExplainedChange } from '../../../../components/StackDeploymentConfigurationChange/StackConfigurationChangeExplain/types'

type Props = {
  allocatorsHref: string | null
  topologyChanges: ExplainedChange[]
  linkify?: boolean
}

const OutOfCapacityCulprits: FunctionComponent<Props> = ({
  allocatorsHref,
  topologyChanges,
  linkify,
}) => {
  const allocatorsText = (
    <FormattedMessage
      id='out-of-capacity-culprits.allocators-page-link'
      defaultMessage='Allocators page'
    />
  )

  const addCapacityText = (
    <FormattedMessage
      id='out-of-capacity-culprits.add-capacity-doc'
      defaultMessage='add more capacity'
    />
  )

  const moveNodesText = (
    <FormattedMessage
      id='out-of-capacity-culprits.move-nodes-doc'
      defaultMessage='move nodes around'
    />
  )

  return (
    <Fragment>
      <EuiText>
        <p>
          <FormattedMessage
            id='out-of-capacity-culprits.summary'
            defaultMessage='There is not enough capacity to complete your configuration change. The {allocatorSummary} indicates how much capacity is available.'
            values={{
              allocatorSummary:
                linkify && allocatorsHref ? (
                  <CuiLink to={allocatorsHref}>{allocatorsText}</CuiLink>
                ) : (
                  allocatorsText
                ),
            }}
          />
        </p>

        <p>
          <FormattedMessage
            id='out-of-capacity-culprits.solutions'
            defaultMessage='To resolve this situation either {addMoreCapacity} or {moveNodesAround}.'
            values={{
              addMoreCapacity: linkify ? (
                <DocLink link='addCapacityDocLink'>{addCapacityText}</DocLink>
              ) : (
                addCapacityText
              ),
              moveNodesAround: linkify ? (
                <DocLink link='moveNodesDocLink'>{moveNodesText}</DocLink>
              ) : (
                moveNodesText
              ),
            }}
          />
        </p>
      </EuiText>

      {isEmpty(topologyChanges) || (
        <Fragment>
          <EuiSpacer size='m' />

          <FormattedMessage
            id='out-of-capacity-culprits.culprit-list'
            defaultMessage='{changeCount, plural, one {The following change} other {One of the following changes}} is likely to be the culprit:'
            values={{ changeCount: topologyChanges.length }}
          />

          <EuiSpacer size='m' />

          <div>
            {topologyChanges.map((change) => (
              <EuiFlexGroup gutterSize='s' key={change.id}>
                <EuiFlexItem grow={false}>{change.message}</EuiFlexItem>
              </EuiFlexGroup>
            ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default OutOfCapacityCulprits
