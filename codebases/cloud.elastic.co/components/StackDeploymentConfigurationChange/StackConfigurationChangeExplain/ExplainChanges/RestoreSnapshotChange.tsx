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

import { EuiCode } from '@elastic/eui'

import { CuiLink } from '../../../../cui'

import {
  clusterSnapshotUrl,
  resolveDeploymentUrlForEsCluster,
  deploymentUrl,
} from '../../../../lib/urlBuilder'

type Props = {
  regionId: string
  esClusterId?: string
  snapshotName: string
  restoreFromEsClusterId?: string
}

const RestoreSnapshotChange: FunctionComponent<Props> = ({
  regionId,
  esClusterId,
  snapshotName,
  restoreFromEsClusterId,
}) => {
  const restoreSnapshot = getRestoreSnapshotText()

  if (restoreFromEsClusterId) {
    return (
      <FormattedMessage
        id='explain-changes.restore-snapshot-from-source'
        defaultMessage='{ restoreSnapshot } from Elasticsearch cluster { restoreSource }'
        values={{
          restoreSnapshot,
          restoreSource: (
            <CuiLink
              to={resolveDeploymentUrlForEsCluster(deploymentUrl, regionId, restoreFromEsClusterId)}
            >
              <EuiCode>{restoreFromEsClusterId.slice(0, 6)}</EuiCode>
            </CuiLink>
          ),
        }}
      />
    )
  }

  return restoreSnapshot

  function getRestoreSnapshotText() {
    if (snapshotName === `__latest_success__`) {
      return (
        <FormattedMessage
          id='explain-changes.restore-last-successful-snapshot'
          defaultMessage='Restore last successful snapshot'
        />
      )
    }

    if (snapshotName) {
      const clusterId = restoreFromEsClusterId || esClusterId

      const snapshotPage = clusterId
        ? resolveDeploymentUrlForEsCluster(clusterSnapshotUrl, regionId, clusterId, snapshotName)
        : null

      return (
        <FormattedMessage
          id='explain-changes.restore-specific-snapshot'
          defaultMessage='Restore snapshot {snapshot}'
          values={{
            snapshot: snapshotPage ? (
              <CuiLink to={snapshotPage}>
                <EuiCode>{snapshotName}</EuiCode>
              </CuiLink>
            ) : (
              <EuiCode>{snapshotName}</EuiCode>
            ),
          }}
        />
      )
    }

    return (
      <FormattedMessage
        id='explain-changes.restore-an-snapshot'
        defaultMessage='Restore an snapshot'
      />
    )
  }
}

export default RestoreSnapshotChange
