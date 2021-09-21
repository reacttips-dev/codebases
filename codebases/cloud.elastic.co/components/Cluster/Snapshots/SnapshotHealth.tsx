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

import React, { FunctionComponent, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiLoadingSpinner, EuiToolTip } from '@elastic/eui'

type SnapshotStateProps = {
  state: string
}

type SnapshotHealthColor = 'danger' | 'warning' | 'success' | 'subdued'

const SnapshotHealth: FunctionComponent<SnapshotStateProps> = ({ state }) => {
  const tooltipContent = getSnapshotHealthDescription({ state })

  return (
    <EuiFlexGroup gutterSize='s' alignItems='center' responsive={false}>
      <EuiFlexItem grow={false}>
        {state === `IN_PROGRESS` ? (
          <EuiLoadingSpinner size='m' />
        ) : (
          <EuiIcon type='dot' color={getSnapshotHealthColor({ state })} />
        )}
      </EuiFlexItem>

      <EuiFlexItem grow={false}>
        <SnapshotHealthText state={state} />
      </EuiFlexItem>

      {tooltipContent && (
        <EuiFlexItem grow={false}>
          <EuiToolTip content={tooltipContent}>
            <EuiIcon type='iInCircle' />
          </EuiToolTip>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>
  )
}

export const SnapshotHealthText: FunctionComponent<SnapshotStateProps> = ({ state }) => {
  if (state === `FAILED`) {
    return <FormattedMessage id='cluster-snapshots-list.failed' defaultMessage='Failed' />
  }

  if (state === `ABORTED`) {
    return <FormattedMessage id='cluster-snapshots-list.aborted' defaultMessage='Aborted' />
  }

  if (state === `SUCCESS`) {
    return <FormattedMessage id='cluster-snapshots-list.success' defaultMessage='Success' />
  }

  if (state === `PARTIAL`) {
    return <FormattedMessage id='cluster-snapshots-list.partial' defaultMessage='Partial' />
  }

  if (state === `IN_PROGRESS`) {
    return <FormattedMessage id='cluster-snapshots-list.progress' defaultMessage='In progress' />
  }

  return <span>{state}</span>
}

export function getSnapshotHealthColor({ state }: SnapshotStateProps): SnapshotHealthColor {
  if (state === `FAILED`) {
    return `danger`
  }

  if (state === `ABORTED`) {
    return `danger`
  }

  if (state === `PARTIAL`) {
    return `warning`
  }

  if (state === `SUCCESS`) {
    return `success`
  }

  if (state === `IN_PROGRESS`) {
    return `subdued`
  }

  return `subdued`
}

function getSnapshotHealthDescription({ state }: SnapshotStateProps): ReactNode {
  if (state === `PARTIAL`) {
    return (
      <FormattedMessage
        id='cluster-snapshots-list.partial-description'
        defaultMessage="The global cluster state was stored, but data from at least one shard wasn't stored successfully."
      />
    )
  }

  return null
}

export default SnapshotHealth
