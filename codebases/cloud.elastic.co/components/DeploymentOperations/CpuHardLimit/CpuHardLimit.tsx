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

import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFormHelpText, EuiSpacer } from '@elastic/eui'

import { CuiAlert, CuiPermissibleControl } from '../../../cui'

import SpinButton from '../../SpinButton'
import FormGroup from '../../FormGroup'

import { AsyncRequestState, ElasticsearchCluster } from '../../../types'
import Permission from '../../../lib/api/v1/permissions'

type Props = {
  canToggleCpuHardLimit: boolean
  cluster: ElasticsearchCluster
  setCpuHardLimit: (cluster: ElasticsearchCluster, enabled: boolean) => Promise<any>
  setCpuHardLimitRequest: AsyncRequestState
}

const CpuHardLimit: FunctionComponent<Props> = ({
  canToggleCpuHardLimit,
  cluster,
  setCpuHardLimit,
  setCpuHardLimitRequest,
}) => {
  if (!canToggleCpuHardLimit) {
    return null
  }

  const hasCpuHardLimit = cluster.cpuHardLimit

  return (
    <Fragment>
      <FormGroup
        label={
          <FormattedMessage
            id='cluster-operations-cpu-hard-limit.title'
            defaultMessage='CPU hard limit'
          />
        }
      >
        <EuiSpacer size='s' />

        <CuiPermissibleControl permissions={Permission.setEsClusterMetadataRaw}>
          <SpinButton
            color='primary'
            onClick={() => setCpuHardLimit(cluster, !hasCpuHardLimit)}
            spin={setCpuHardLimitRequest.inProgress}
            requiresSudo={true}
          >
            {hasCpuHardLimit ? (
              <FormattedMessage
                id='cluster-operations-cpu-hard-limit.turn-off'
                defaultMessage='Turn off'
              />
            ) : (
              <FormattedMessage
                id='cluster-operations-cpu-hard-limit.turn-on'
                defaultMessage='Turn on'
              />
            )}
          </SpinButton>
        </CuiPermissibleControl>

        <EuiFormHelpText>
          <FormattedMessage
            id='cluster-operations-cpu-hard-limit.description'
            defaultMessage='Turns on a hard limit for CPU resources to reduce resource contention between clusters or turns it off to provide additional resources.'
          />
        </EuiFormHelpText>

        {setCpuHardLimitRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{setCpuHardLimitRequest.error}</CuiAlert>
          </Fragment>
        )}
      </FormGroup>

      <EuiSpacer />
    </Fragment>
  )
}

export default CpuHardLimit
