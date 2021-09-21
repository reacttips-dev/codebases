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
import React, { ReactNode, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCode } from '@elastic/eui'

import { CuiLink } from '../../../cui'

import { hostAllocatorUrl } from '../../../lib/urlBuilder'

import { ExplainedChange, ExplainedChangeType } from './types'
import { InstanceMoveRequest } from '../../../lib/api/v1/types'

type AllocatorLink = {
  allocatorId: string
  node: ReactNode
}

export default function explainVacateInstancesChanges({
  regionId,
  type,
  moveInstances,
}: {
  regionId: string
  type: ExplainedChangeType
  moveInstances: InstanceMoveRequest[]
}): ExplainedChange[] {
  return moveInstances.map((move: InstanceMoveRequest): ExplainedChange => {
    const movingInstance = renderInstance(move.from)

    if (!Array.isArray(move.to) || isEmpty(move.to)) {
      return {
        id: `${type}-move-nodes-off-of-${move.from}`,
        type,
        message: (
          <FormattedMessage
            id='explain-changes.move-instance-to-any-allocator'
            defaultMessage='Move {movingInstance} to any other allocator'
            values={{ movingInstance }}
          />
        ),
      }
    }

    return {
      id: `${type}-move-nodes-from-allocator-${move.from}-to-targets`,
      testParams: [...move.to],
      type,
      message: (
        <FormattedMessage
          id='explain-changes.move-instance-to-specific-allocators'
          defaultMessage='Move {movingInstance} to {targetCount, plural, one {allocator} other {one of these allocators:}} {targets}'
          values={{
            movingInstance,
            targetCount: move.to.length,
            targets: (
              <span>
                {move.to.map(renderAllocatorLink).map((link: AllocatorLink, index: number) => (
                  <Fragment key={link.allocatorId}>
                    {index !== 0 && `, `}
                    {link.node}
                  </Fragment>
                ))}
              </span>
            ),
          }}
        />
      ),
    }
  })

  function renderInstance(instanceId: string) {
    return <EuiCode>{instanceId}</EuiCode>
  }

  function renderAllocatorLink(allocatorId: string): AllocatorLink {
    return {
      allocatorId,
      node: (
        <CuiLink to={hostAllocatorUrl(regionId, allocatorId)}>
          <EuiCode>{allocatorId}</EuiCode>
        </CuiLink>
      ),
    }
  }
}
