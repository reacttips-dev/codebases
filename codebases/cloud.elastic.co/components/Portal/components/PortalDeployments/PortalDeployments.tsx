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

import classNames from 'classnames'

import React, { PureComponent, ReactNode } from 'react'

import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiBadge,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiIcon,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiTable, CuiLink, CuiTableColumn } from '../../../../cui'

import PortalDeploymentStatus from '../PortalDeploymentStatus'

import ExternalLink from '../../../ExternalLink'
import PrivacySensitiveContainer from '../../../PrivacySensitiveContainer'

import DeploymentProvider from '../../../StackDeploymentSearch/Deployment/DeploymentProvider'
import DeploymentRegion from '../../../StackDeploymentSearch/Deployment/DeploymentRegion'

import PartialUpgradeTooltip from '../../../Deployment/DeploymentVersion/UpgradableDeploymentVersion/PartialUpgradeTooltip'

import { sortDeploymentsByRamAndStatus } from '../../../../lib/stackDeployments/sorting'

import {
  getDeploymentResourceEndpoint,
  getDisplayId,
  getDisplayName,
  getFirstEsClusterFromGet,
  getRegionId,
  getResourceVersion,
  getVersion,
  hasMismatchingVersions,
  usesDedicatedEntSearchTemplate,
} from '../../../../lib/stackDeployments'

import { getSliderPrettyName, getSliderIconType } from '../../../../lib/sliders'

import { deploymentsUrl, deploymentUrl } from '../../../../lib/urlBuilder'
import history from '../../../../lib/history'

import { DeploymentSearchResponse } from '../../../../lib/api/v1/types'
import { AnyResourceInfo, SliderInstanceType, VersionNumber } from '../../../../types'

import './PortalDeployments.scss'

interface Props extends WrappedComponentProps {
  deployments: DeploymentSearchResponse[] | null
  fetchKibana: (props: { regionId; kibanaId }) => Promise<any>
}

interface State {
  kibanaLaunch: string[]
  kibanaLaunchError: {
    kibanaId: string
  }
}

const messages = defineMessages({
  name: {
    id: `portal-deployments-table.status-name`,
    defaultMessage: `Deployment name`,
  },
  status: {
    id: `deployments-table.status-label`,
    defaultMessage: `Status`,
  },
  version: {
    id: `deployments-table.version-label`,
    defaultMessage: `Version`,
  },
  quickLink: {
    id: `portal-deployments-table.application-link`,
    defaultMessage: `Quick link`,
  },
  region: {
    id: `portal-deployments-table.cloud-region`,
    defaultMessage: `Cloud region`,
  },
})

class PortalDeployments extends PureComponent<Props, State> {
  state: State = {
    kibanaLaunch: [],
    kibanaLaunchError: {
      kibanaId: '',
    },
  }

  render() {
    const { deployments } = this.props
    const showViewAllLink = deployments && deployments.length > 5

    return (
      <EuiFlexGroup alignItems='center' responsive={false} gutterSize='s' direction='column'>
        <EuiFlexItem>{this.renderTable()}</EuiFlexItem>

        <EuiFlexItem>
          {showViewAllLink ? (
            <EuiButtonEmpty
              onClick={() => history.push(deploymentsUrl())}
              size='s'
              data-test-id='portal-deployments-table-see-more-deployments-btn'
            >
              <EuiText size='s'>
                <FormattedMessage
                  id='portal-deployments-table.see-more-deployments'
                  defaultMessage='View all deployments'
                />
              </EuiText>
            </EuiButtonEmpty>
          ) : (
            <EuiSpacer size='xs' />
          )}
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderTable() {
    const {
      intl: { formatMessage },
      deployments,
    } = this.props
    const loadedButEmpty = deployments && !deployments.length

    const nameColumn: CuiTableColumn<DeploymentSearchResponse> = {
      label: formatMessage(messages.name),
      render: (deployment: DeploymentSearchResponse) => {
        const { id } = deployment
        const displayName = getDisplayName({ deployment })
        const displayId = getDisplayId({ deployment })

        return (
          <PrivacySensitiveContainer className='deployments-table-privacy-container'>
            <div className='deployments-table-deployment-name'>
              <CuiLink
                to={deploymentUrl(id)}
                className='deployments-table-deployment-name-link'
                title={displayName}
              >
                {displayName}
              </CuiLink>
            </div>
            {displayId !== displayName && <EuiFormHelpText>{displayId}</EuiFormHelpText>}
          </PrivacySensitiveContainer>
        )
      },
      sortKey: [`name`, `id`],
      width: `30%`,
      textOnly: false,
    }

    const columns: Array<CuiTableColumn<DeploymentSearchResponse>> = [
      nameColumn,
      {
        label: <FormattedMessage id='deployments-table.status' defaultMessage='Status' />,
        render: (deployment: DeploymentSearchResponse) => (
          <PortalDeploymentStatus deployment={deployment} />
        ),
        textOnly: false,
        width: `20%`,
      },
      {
        label: formatMessage(messages.version),
        render: (deployment: DeploymentSearchResponse) => {
          const esResource = getFirstEsClusterFromGet({ deployment })
          const version = esResource && getVersion({ deployment })

          return version ? (
            <EuiFlexGroup gutterSize='none'>
              <EuiFlexItem>
                <EuiBadge>{version}</EuiBadge>
              </EuiFlexItem>
              {hasMismatchingVersions({ deployment }) && (
                <EuiFlexItem>
                  <PartialUpgradeTooltip deployment={deployment} />
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
          ) : null
        },
        width: `75px`,
      },
      {
        label: formatMessage(messages.quickLink),
        render: this.renderQuickLinkColumn,
        width: `20%`,
        textOnly: false,
      },
      {
        label: formatMessage(messages.region),
        render: (deployment: DeploymentSearchResponse) => {
          const regionId = getRegionId({ deployment })

          return (
            <EuiFlexGroup
              gutterSize='none'
              responsive={false}
              alignItems='center'
              className='deployments-table-deployment-platform-region-cell'
            >
              <EuiFlexItem grow={false}>
                <DeploymentProvider regionId={regionId} />
              </EuiFlexItem>

              <EuiFlexItem className='deployments-table-deployment-region'>
                <DeploymentRegion regionId={regionId} />
              </EuiFlexItem>
            </EuiFlexGroup>
          )
        },
        width: `20%`,
        textOnly: false,
      },
    ]

    return (
      <CuiTable<DeploymentSearchResponse>
        getRowId={(deployment) => deployment.id}
        rows={deployments ? sortDeploymentsByRamAndStatus(deployments).slice(0, 5) : undefined}
        columns={columns}
        className={classNames('portal-deployment-list', {
          'portal-deployment-list-empty': loadedButEmpty,
        })}
        initialLoading={!deployments}
      />
    )
  }

  renderQuickLinkColumn = (deployment: DeploymentSearchResponse) => {
    if (usesDedicatedEntSearchTemplate({ deployment })) {
      const entSearchQuickLink = this.renderQuickLinkForResource({
        deployment,
        sliderInstanceType: 'enterprise_search',
      })

      if (entSearchQuickLink) {
        return entSearchQuickLink
      }
    }

    const kibanaQuickLink = this.renderQuickLinkForResource({
      deployment,
      sliderInstanceType: 'kibana',
    })

    if (kibanaQuickLink) {
      return kibanaQuickLink
    }

    return null
  }

  renderQuickLinkForResource({
    deployment,
    sliderInstanceType,
  }: {
    deployment: DeploymentSearchResponse
    sliderInstanceType: SliderInstanceType
  }): ReactNode {
    const { resources } = deployment

    if (!resources) {
      return null
    }

    const resource: AnyResourceInfo | undefined = resources?.[sliderInstanceType]?.[0]

    if (!resource) {
      return null
    }

    const resourceEndpoint = getDeploymentResourceEndpoint({
      deployment,
      sliderInstanceType,
    })

    if (!resourceEndpoint) {
      return null
    }

    const version = getResourceVersion({ resource })

    return this.renderResourceQuickLink({
      sliderInstanceType,
      resourceEndpoint,
      version,
    })
  }

  renderResourceQuickLink({
    sliderInstanceType,
    resourceEndpoint,
    version,
  }: {
    sliderInstanceType: SliderInstanceType
    resourceEndpoint: string
    version?: VersionNumber | null
  }) {
    return (
      <EuiFlexGroup
        gutterSize='none'
        responsive={false}
        alignItems='center'
        data-test-id='deployments-table-launch-application'
        className='deployments-table-launch-application'
      >
        <EuiFlexItem grow={false}>
          <EuiIcon type={getSliderIconType({ sliderInstanceType })} size='m' />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <EuiText size='s'>
            <ExternalLink
              showExternalLinkIcon={false}
              className='deployments-table-launch-application-link-button'
              href={resourceEndpoint}
            >
              <FormattedMessage {...getSliderPrettyName({ sliderInstanceType, version })} />
            </ExternalLink>
          </EuiText>
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }
}

export default injectIntl(PortalDeployments)
