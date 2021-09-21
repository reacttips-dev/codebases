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

import { filter } from 'lodash'

import React, { Component, Fragment } from 'react'
import { FormattedMessage, injectIntl, WrappedComponentProps, defineMessages } from 'react-intl'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiIconTip,
  EuiLink,
  EuiLoadingSpinner,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiAlert, CuiHelpTipIcon, withErrorBoundary } from '../../../../cui'

import DeploymentVersionUpgradeModal from './DeploymentVersionUpgradeModal'
import PartialUpgradeTooltip from './PartialUpgradeTooltip'

import ClusterLockingGate from '../../../ClusterLockingGate'
import DocLink from '../../../DocLink'

import {
  getVersion,
  getRegionId,
  getLowestSliderVersion,
  hasMismatchingVersions,
  isSystemOwned,
} from '../../../../lib/stackDeployments'

import { satisfies } from '../../../../lib/semver'

import { StackVersionConfig } from '../../../../lib/api/v1/types'
import { AsyncRequestState, StackDeployment, Region, VersionNumber } from '../../../../types'

import './upgradableDeploymentVersion.scss'

const messages = defineMessages({
  ariaLabel: {
    id: `upgradable-deployment-version.aria`,
    defaultMessage: `More information`,
  },
})

export interface Props extends WrappedComponentProps {
  fetchVersionStack: (version: string, regionId: string) => void
  fetchVersionStacks: (regionId: string) => void
  fetchRegion: (regionId: string) => void
  region?: Region
  deployment: StackDeployment
  lowestVersion: VersionNumber
  versionStack?: StackVersionConfig
  availableVersions?: string[]
  esVersionRequest: AsyncRequestState
}

type State = {
  showUpgradeModal: boolean
}

class UpgradableDeploymentVersion extends Component<Props, State> {
  state: State = {
    showUpgradeModal: false,
  }

  componentDidMount() {
    const { deployment, fetchVersionStack } = this.props

    // If a deployment is partially upgraded, we pick the lowest
    // found version found in each resource to upgrade from.
    const lowestVersion = getLowestSliderVersion({ deployment })!
    const regionId = getRegionId({ deployment })!

    fetchVersionStack(lowestVersion, regionId)
  }

  render() {
    const { deployment, versionStack } = this.props
    const version = getVersion({ deployment })!

    if (version == null) {
      return null
    }

    const isVersionDeleted = versionStack != null ? versionStack.deleted : false

    return (
      <div>
        <EuiFormLabel>
          <EuiFlexGroup gutterSize='none' alignItems='center'>
            <EuiFlexItem grow={false}>
              <FormattedMessage
                id='upgradable-deployment-version.deployment-version'
                defaultMessage='Deployment version'
              />
            </EuiFlexItem>

            {isVersionDeleted && (
              <EuiFlexItem grow={false}>
                <span
                  data-test-id='upgradable-deployment-version-deleted'
                  style={{ verticalAlign: `text-bottom`, marginLeft: 4 }}
                >
                  <EuiIconTip
                    size='m'
                    aria-label='Version deleted'
                    content={
                      <FormattedMessage
                        id='upgradable-deployment-version.version-deleted'
                        defaultMessage='This Elastic Stack version has been deleted. Please upgrade to a new version.'
                      />
                    }
                    type='alert'
                    color='warning'
                  />
                </span>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiFormLabel>
        <EuiSpacer size='s' />

        {this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const { deployment, availableVersions, esVersionRequest } = this.props
    const version = getVersion({ deployment })!

    if (esVersionRequest.error) {
      return (
        <Fragment>
          <EuiSpacer size='s' />
          <CuiAlert type='error' data-test-id='es-version-request-error'>
            {esVersionRequest.error}
          </CuiAlert>
        </Fragment>
      )
    }

    if (availableVersions == null) {
      return (
        <Fragment>
          <EuiSpacer size='s' />
          <EuiLoadingSpinner />
        </Fragment>
      )
    }

    const upgradeAvailable = this.getAvailableVersions().length > 0

    return (
      <Fragment>
        <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
          <EuiFlexItem grow={false} data-test-id='deployment-version'>
            <EuiText size='s'>
              {
                // tslint:disable-next-line:jsx-use-translation-function
                `v${version}`
              }
            </EuiText>
          </EuiFlexItem>

          <ClusterLockingGate>{this.renderStartUpgradeButton(upgradeAvailable)}</ClusterLockingGate>
        </EuiFlexGroup>

        {this.renderUpgradeModal()}
      </Fragment>
    )
  }

  renderStartUpgradeButton(anySelectableVersions) {
    const {
      deployment,
      intl: { formatMessage },
    } = this.props
    const { showUpgradeModal } = this.state

    const isHidden = showUpgradeModal || !anySelectableVersions
    const isUpgradeIncomplete = hasMismatchingVersions({ deployment })

    return (
      <EuiFlexItem
        grow={false}
        className={isHidden ? `upgradableDeploymentVersion-hidden` : undefined}
        aria-hidden={isHidden}
      >
        <div className='docLink'>
          {isUpgradeIncomplete ? (
            <PartialUpgradeTooltip deployment={deployment} />
          ) : (
            <CuiHelpTipIcon aria-label={formatMessage(messages.ariaLabel)} color='primary'>
              <span data-test-id='upgrade-available'>
                <FormattedMessage
                  id='upgradable-deployment-version.upgrade-available'
                  defaultMessage='There is a newer version available. {learnMore}'
                  values={{
                    learnMore: (
                      <DocLink link='upgradingDocLink'>
                        <FormattedMessage
                          id='upgradable-deployment-version.upgrade-available-link'
                          defaultMessage='Learn more'
                        />
                      </DocLink>
                    ),
                  }}
                />
              </span>
            </CuiHelpTipIcon>
          )}

          <EuiLink
            style={{ paddingLeft: `.3rem` }}
            onClick={() => this.showUpgrade()}
            data-test-id='upgradable-deployment-version-show-available'
          >
            <FormattedMessage
              id='upgradable-deployment-version.upgrade-link'
              defaultMessage='Upgrade'
            />
          </EuiLink>
        </div>
      </EuiFlexItem>
    )
  }

  renderUpgradeModal() {
    const { deployment, region } = this.props
    const { showUpgradeModal } = this.state

    if (!showUpgradeModal) {
      return null
    }

    return (
      <DeploymentVersionUpgradeModal
        deployment={deployment}
        isLoadingRegion={!region}
        onCancel={this.cancelShowUpgrade}
      />
    )
  }

  showUpgrade() {
    const { deployment, fetchRegion, fetchVersionStacks } = this.props

    const regionId = getRegionId({ deployment })!

    fetchRegion(regionId)
    fetchVersionStacks(regionId)

    this.setState({ showUpgradeModal: true })
  }

  cancelShowUpgrade = () => {
    this.setState({ showUpgradeModal: false })
  }

  getAvailableVersions = () => {
    const { deployment, availableVersions } = this.props

    if (!availableVersions) {
      return []
    }

    // temporary fix, still waiting for the API to provide upgrade available for system owned deployment
    // see https://github.com/elastic/cloud/issues/31782
    return isSystemOwned({ deployment })
      ? filter(availableVersions, (version) => satisfies(version, `<7`))
      : availableVersions
  }
}

export default withErrorBoundary(injectIntl(UpgradableDeploymentVersion))
