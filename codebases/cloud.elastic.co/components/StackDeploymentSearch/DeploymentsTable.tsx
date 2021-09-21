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
import { FormattedMessage, defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'

import { EuiBadge, EuiFlexGroup, EuiFlexItem, EuiFormHelpText, EuiFlexGrid } from '@elastic/eui'

import { CuiLink, CuiTable, CuiTableColumn } from '../../cui'

import StackDeploymentHealthProblems from '../StackDeploymentHealthProblems'
import StackDeploymentStatus from '../StackDeploymentStatus'

import DeploymentRegion from './Deployment/DeploymentRegion'
import DeploymentProvider from './Deployment/DeploymentProvider'
import DeploymentStackIcons from './Deployment/DeploymentStackIcons'
import DeploymentConfigurations from './Deployment/DeploymentConfigurations'

import { deploymentUrl } from '../../lib/urlBuilder'

import { isDeploymentHealthy } from '../../lib/healthProblems/stackDeploymentHealth'

import {
  getDisplayId,
  getDisplayName,
  getRegionId,
  getPlatformId,
  getVersion,
  getFirstResourceType,
} from '../../lib/stackDeployments'

import { DeploymentSearchResponse } from '../../lib/api/v1/types'

import './deploymentsTable.scss'

type Props = WrappedComponentProps & {
  deployments: DeploymentSearchResponse[]
}

const messages = defineMessages({
  status: {
    id: `deployments-table.status-label`,
    defaultMessage: `Status`,
  },
  name: {
    id: `deployments-table.name-label`,
    defaultMessage: `Name`,
  },
  version: {
    id: `deployments-table.version-label`,
    defaultMessage: `Version`,
  },
  configuration: {
    id: `deployments-table.configuration-label`,
    defaultMessage: `Configuration`,
  },
  stack: {
    id: `deployments-table.stack-label`,
    defaultMessage: `Stack`,
  },
  region: {
    id: `deployments-table.region-label`,
    defaultMessage: `Region`,
  },
})

const DeploymentsTable: FunctionComponent<Props> = ({ intl, deployments }) => {
  const { formatMessage } = intl

  const nameColumn = {
    label: formatMessage(messages.name),
    render: (deployment: DeploymentSearchResponse) => {
      const { id } = deployment
      const displayName = getDisplayName({ deployment })
      const displayId = getDisplayId({ deployment })

      return (
        <div>
          <CuiLink to={deploymentUrl(id)}>{displayName}</CuiLink>

          {displayId !== displayName && <EuiFormHelpText>{displayId}</EuiFormHelpText>}
        </div>
      )
    },
    sortKey: [
      (deployment: DeploymentSearchResponse) => getDisplayName({ deployment }),
      (deployment: DeploymentSearchResponse) => getDisplayId({ deployment }),
    ],
    textOnly: false,
    width: `280px`,
  }

  const columns: Array<CuiTableColumn<DeploymentSearchResponse>> = [
    {
      mobile: {
        label: <FormattedMessage id='deployments-table.status' defaultMessage='Status' />,
      },
      render: (deployment: DeploymentSearchResponse) => (
        <StackDeploymentStatus deployment={deployment} />
      ),
      textOnly: false,
      width: `40px`,
    },

    nameColumn,

    {
      label: formatMessage(messages.version),
      sortKey: (deployment: DeploymentSearchResponse) => getVersion({ deployment }),
      render: (deployment: DeploymentSearchResponse) => {
        const version = getVersion({ deployment })

        if (version === null) {
          return null
        }

        return <EuiBadge>v{version}</EuiBadge>
      },
      textOnly: false,
      width: '100px',
    },

    {
      label: formatMessage(messages.configuration),
      render: (deployment: DeploymentSearchResponse) => (
        // need the 100% width below to ensure the flex grid uses the whole column. for some reason.
        <EuiFlexGrid gutterSize='m' columns={2} responsive={false} style={{ width: `100%` }}>
          <DeploymentConfigurations deployment={deployment} />
        </EuiFlexGrid>
      ),
      textOnly: false,
    },

    {
      label: formatMessage(messages.stack),
      render: (deployment: DeploymentSearchResponse) => (
        <DeploymentStackIcons deployment={deployment} />
      ),
      textOnly: false,
      width: `90px`,
    },

    {
      label: formatMessage(messages.region),
      render: (deployment: DeploymentSearchResponse) => (
        <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
          <EuiFlexItem grow={false}>
            <DeploymentProvider regionId={getRegionId({ deployment })} />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <DeploymentRegion regionId={getRegionId({ deployment })!} />
          </EuiFlexItem>
        </EuiFlexGroup>
      ),
      sortKey: [
        (deployment: DeploymentSearchResponse) => getPlatformId({ deployment }),
        (deployment: DeploymentSearchResponse) => getRegionId({ deployment }),
      ],
      textOnly: false,
      width: `250px`,
    },
  ]

  return (
    <CuiTable<DeploymentSearchResponse>
      rows={deployments}
      getRowId={(deployment) => deployment.id}
      getRowTestSubj={(deployment) => `${getFirstResourceType({ deployment })}-row`}
      hasExpandedDetailRow={(deployment) => !isDeploymentHealthy({ deployment })}
      renderDetailButton={false}
      renderDetailRow={DeploymentTableProblemsRow}
      rowClass={getDeploymentTableRowClasses}
      columns={columns}
    />
  )
}

function DeploymentTableProblemsRow(deployment: DeploymentSearchResponse) {
  return <StackDeploymentHealthProblems deployment={deployment} />
}

function getDeploymentTableRowClasses(deployment: DeploymentSearchResponse) {
  const healthy = isDeploymentHealthy({ deployment })

  if (healthy) {
    return
  }

  return `deploymentsTable-unhealthyRowDeployment`
}

export default injectIntl(DeploymentsTable)
