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

import { EuiCode, EuiFormHelpText } from '@elastic/eui'

import { CuiLink } from '../../../cui'

import { hostAllocatorUrl } from '../../../lib/urlBuilder'

import { ExplainedChange, ExplainedChangeType } from './types'
import { AllocatorMoveRequest } from '../../../lib/api/v1/types'

type AllocatorLink = {
  allocatorId: string
  node: ReactNode
}

export default function explainVacateAllocatorChanges({
  regionId,
  type,
  moveAllocators,
  isPastHistory,
}: {
  regionId: string
  isPastHistory: boolean
  type: ExplainedChangeType
  moveAllocators: AllocatorMoveRequest[]
}): ExplainedChange[] {
  return moveAllocators.map((move: AllocatorMoveRequest): ExplainedChange => {
    const source = renderAllocatorLink(move.from).node

    if (!Array.isArray(move.to) || isEmpty(move.to)) {
      return {
        id: `${type}-move-nodes-off-of-${move.from}`,
        type,
        message: (
          <Fragment>
            <FormattedMessage
              id='explain-changes.move-nodes-off-of-allocator'
              defaultMessage='Move nodes off of allocator {source} due to routine system maintenance'
              values={{ source }}
            />

            {isPastHistory ? null : (
              <EuiFormHelpText>
                <FormattedMessage
                  id='explain-changes.move-nodes-off-of-allocator-help-text'
                  defaultMessage='Having replicas and multiple availability zones helps minimize service interruption'
                />
              </EuiFormHelpText>
            )}
          </Fragment>
        ),
      }
    }

    return {
      id: `${type}-move-nodes-from-allocator-${move.from}-to-targets`,
      testParams: [...move.to],
      type,
      message: (
        <FormattedMessage
          id='explain-changes.move-nodes-from-allocator-to-targets'
          defaultMessage='Move nodes from allocator {source} to {targets}'
          values={{
            source,
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
