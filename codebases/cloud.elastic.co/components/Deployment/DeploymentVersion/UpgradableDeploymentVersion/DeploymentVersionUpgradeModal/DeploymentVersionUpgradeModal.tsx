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

import { filter, find, isEmpty, map, mapValues, groupBy, xor, isNull } from 'lodash'

import React, { Component, ReactNode, Fragment } from 'react'
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiCode,
  EuiErrorBoundary,
  EuiFlexGroup,
  EuiFlexItem,
  EuiListGroup,
  EuiListGroupItem,
  EuiLoadingContent,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
} from '@elastic/eui'

import { CuiAlert, withErrorBoundary } from '../../../../../cui'

import ReviewYamlSettings, {
  hasSecurityRealmSettingOverrides,
  needsYamlSettingsReview,
} from './ReviewYamlSettings'

import VerifyPlugins from './VerifyPlugins'

import SpinButton from '../../../../SpinButton'
import ExternalLink from '../../../../ExternalLink'
import LogicSudoGate from '../../../../LogicSudoGate'
import DocLink from '../../../../DocLink'

import StackDeploymentUpdateDryRunWarnings from '../../../../StackDeploymentUpdateDryRunWarnings'
import StackDeploymentUpdateDryRunWarningCheck from '../../../../StackDeploymentUpdateDryRunWarningCheck'

import EsVersion from '../../../../DeploymentConfigure/EsVersion'

import Deprecations, {
  getDeprecationLevel,
  hasAnyCriticalMessages,
} from '../../../../DeploymentConfigure/Deprecations'

import { gte, gt, lt, satisfies, rcompare } from '../../../../../lib/semver'

import { getIncompatibleCustomPlugins } from '../../../../../lib/plugins'

import {
  getReadOnlyMessage,
  getSliderPrettyName,
  isSliderEnabledInStackDeployment,
} from '../../../../../lib/sliders'

import {
  createUpdateRequestFromGetResponse,
  getEsPlan,
  getFirstEsClusterFromGet,
  getFirstSliderClusterFromGet,
  getHighestSliderVersion,
  getLowestSliderVersion,
  getRegionId,
  getSliderInstancesTypeRequiringUpgrade,
  getSliderVersion,
  getUpdateRequestWithPluginsAndTransforms,
  getUpsertVersion,
  getVersion,
  hasMismatchingVersions,
  isMajorVersionChange,
  isStopped,
  isSystemOwned,
  setDeploymentVersion,
  showFleetWarningOnUpgrade,
  validateUpdateRequest,
} from '../../../../../lib/stackDeployments'

import {
  checkForIncompatibilities,
  isSliderDeprecated,
} from '../../../../../lib/deployments/upgrades'

import { kibanaUrl } from '../../../../../lib/urlBuilder'

import { formatAsSentence } from '../../../../../lib/string'

import { replaceIn } from '../../../../../lib/immutability-helpers'

import { MUST_UPGRADE_TO_5_6_FIRST } from '../../../../../constants/errors'

import { getConfigForKey } from '../../../../../store'

import lightTheme from '../../../../../lib/theme/light'

import {
  AsyncRequestState,
  DeprecationsResponse,
  UnavailableVersionUpgrades,
  VersionNumber,
  StackDeployment,
  SliderInstanceType,
} from '../../../../../types'

import {
  Extension,
  StackVersionConfig,
  DeploymentUpdateRequest,
  DeploymentTemplateInfoV2,
  KibanaResourceInfo,
} from '../../../../../lib/api/v1/types'

export interface Props extends WrappedComponentProps {
  deployment: StackDeployment
  deploymentTemplate: DeploymentTemplateInfoV2
  availableVersions?: string[]
  extensions: Extension[] | null
  fetchDeprecationsAssistantRequest: AsyncRequestState
  fetchDeprecationsRequest: AsyncRequestState
  fetchExtensions: () => void
  updateStackDeploymentRequest: AsyncRequestState
  versionStacks?: StackVersionConfig[] | null
  upgradeAssistant: (args: {
    version: string
    previousVersion: string
    clusterId: string
    regionId: string
  }) => void
  updateDeployment: (args: {
    deploymentId: string
    deployment: DeploymentUpdateRequest
    redirect?: boolean
    dryRun?: boolean
  }) => Promise<void>
  resetUpdateDeployment: (deploymentId: string) => void
  fetchDeployment: (args: { deploymentId: string }) => void
  fetchDeprecations: (args: { regionId: string; clusterId: string; version: VersionNumber }) => void
  getDeprecations: (version: VersionNumber) => DeprecationsResponse | undefined
  isLoadingRegion?: boolean
  startAppSearchToEnterpriseSearchMigration: (args: { deployment: StackDeployment }) => void
  onCancel: () => void
}

type State = {
  editorState: {
    deploymentUnderEdit: StackDeployment
    deployment: DeploymentUpdateRequest
  }
  showYamlModal: boolean
  disableUpgradeButton: boolean | null
  selectedPluginUrls: string[]
}

const { euiBreakpoints } = lightTheme

class DeploymentVersionUpgradeModalClass extends Component<Props, State> {
  state: State = {
    editorState: this.getInitialEditorState(),
    showYamlModal: false,
    disableUpgradeButton: null,
    selectedPluginUrls: [],
  }

  componentDidMount() {
    const { fetchExtensions } = this.props
    const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

    // ECE doesn't support extensions, and SaaS adminconsoles doesn't get user-scoped extensions
    if (isUserConsole) {
      fetchExtensions()
    }
  }

  componentWillUnmount = () => {
    const { resetUpdateDeployment } = this.props
    const {
      editorState: { deploymentUnderEdit },
    } = this.state

    resetUpdateDeployment(deploymentUnderEdit.id)
  }

  render() {
    const { onCancel } = this.props
    const {
      editorState: { deploymentUnderEdit },
    } = this.state

    return (
      <Fragment>
        <LogicSudoGate onCancel={onCancel}>
          <EuiOverlayMask>
            <EuiModal onClose={onCancel} style={{ width: euiBreakpoints.m }}>
              <EuiModalHeader>
                <EuiModalHeaderTitle>
                  <FormattedMessage
                    id='upgradable-deployment-version.upgrade-modal-title'
                    defaultMessage='Upgrade deployment'
                  />
                </EuiModalHeaderTitle>
              </EuiModalHeader>

              <EuiModalBody>
                <EuiErrorBoundary>{this.renderUpgradeModalBody()}</EuiErrorBoundary>
              </EuiModalBody>

              <EuiModalFooter>
                <EuiFlexGroup gutterSize='s' justifyContent='flexEnd' responsive={false}>
                  <EuiFlexItem grow={false}>
                    <EuiButtonEmpty data-test-id='cancelUpgrade-btn' onClick={onCancel}>
                      <FormattedMessage
                        id='upgradable-deployment-version.cancel-upgrade'
                        defaultMessage='Cancel'
                      />
                    </EuiButtonEmpty>
                  </EuiFlexItem>
                  <StackDeploymentUpdateDryRunWarningCheck
                    deploymentId={deploymentUnderEdit.id}
                    ignoreSecurityRealmWarnings={true}
                  >
                    {({ dryRunCheckPassed }) => this.renderUpgradeButton({ dryRunCheckPassed })}
                  </StackDeploymentUpdateDryRunWarningCheck>
                </EuiFlexGroup>
              </EuiModalFooter>
            </EuiModal>
          </EuiOverlayMask>
        </LogicSudoGate>

        {this.renderReviewYamlSettingsModal()}
      </Fragment>
    )
  }

  renderUpgradeModalBody() {
    const { getDeprecations, updateStackDeploymentRequest, intl } = this.props
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    if (this.isFetchingDependencies()) {
      return <EuiLoadingContent />
    }

    const pendingVersion = getUpsertVersion({ deployment })!

    const deprecations = getDeprecations(pendingVersion)

    const availableVersions = this.getAvailableVersions()
    const unavailableVersionUpgrades = this.getUnavailableVersionUpgrades(availableVersions)

    const deprecationsLevel = getDeprecationLevel(deprecations)
    const deprecationNotices = this.renderDeprecationNotices()

    const lowestVersion = getLowestSliderVersion({ deployment: deploymentUnderEdit })

    return (
      <Fragment>
        <EsVersion
          lastVersion={lowestVersion}
          availableVersions={availableVersions}
          unavailableVersionUpgrades={unavailableVersionUpgrades}
          version={pendingVersion}
          onUpdate={(newVersion, previousVersion) =>
            this.updateVersion(newVersion, previousVersion)
          }
          checkVersionDisabled={(version) =>
            checkForIncompatibilities({ deployment: deploymentUnderEdit, version, intl })
          }
        />

        {this.renderFleetAdditionWarning()}
        {this.renderSelfServiceUpgradeErrors()}
        {this.renderFetchDeprecationErrors()}
        {this.renderFetchDeprecationAssistantErrors()}
        {this.renderVersionErrors()}
        {deprecationsLevel === `error` && deprecationNotices}
        {this.renderMajorUpgradeWarnings()}
        {this.renderDryRunValidationWarnings()}
        {deprecationsLevel === `warning` && deprecationNotices}
        {this.renderIncompatiblePluginWarnings()}
        {this.renderIncompatibilityNotices()}
        {this.renderMajorVersionChangeNotices()}
        {deprecationsLevel === `info` && deprecationNotices}

        {updateStackDeploymentRequest.error && (
          <Fragment>
            <EuiSpacer size='m' />
            <CuiAlert type='error'>{updateStackDeploymentRequest.error}</CuiAlert>
          </Fragment>
        )}
      </Fragment>
    )
  }

  renderVersionErrors() {
    const {
      editorState: { deployment },
    } = this.state

    if (!this.isUpgradeAvailable()) {
      return null
    }

    const error = this.getVersionError()

    if (error == null) {
      return null
    }

    const pendingVersion = getUpsertVersion({ deployment })!
    const message = getVersionErrorMessage(error, pendingVersion)

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <CuiAlert type='error' className='deploymentConfigure-versionError'>
          <p>{message}</p>

          <p>
            <FormattedMessage
              id='deployment-configure-es-version.recommend-upgrade-stack-guide'
              defaultMessage='We highly recommend reading the {upgradeStackGuide} before continuing.'
              values={{
                upgradeStackGuide: (
                  <DocLink link='upgradingDocLink'>
                    <FormattedMessage
                      id='deployment-configure-es-version.stack-upgrade-guide'
                      defaultMessage='stack upgrade guide'
                    />
                  </DocLink>
                ),
              }}
            />
          </p>
        </CuiAlert>
      </Fragment>
    )
  }

  renderFleetAdditionWarning() {
    const { deploymentTemplate } = this.props
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    const version = getVersion({ deployment: deploymentUnderEdit })
    const pendingVersion = getUpsertVersion({ deployment })

    const show = showFleetWarningOnUpgrade({
      deployment: deploymentUnderEdit,
      deploymentTemplate,
      fromVersion: version,
      toVersion: pendingVersion,
    })

    if (!show) {
      return null
    }

    const title = (
      <FormattedMessage
        id='fleet-addition.title'
        defaultMessage="We're adding Fleet to your APM instance"
      />
    )

    const body = (
      <Fragment>
        <FormattedMessage
          id='fleet-addition.body'
          defaultMessage='<p>Fleet helps you manage all your Elastic Agents, get their status, make updates, and add integrations with just a few clicks.</p><p><strong>If your APM instance uses over 300MB of memory as shown in the Stack Monitoring app, we recommend increasing the size before upgrading.</strong> If needed, just edit your deployment and add capacity to APM & Fleet. <learnMoreLink>Learn more about the APM & Fleet upgrade.</learnMoreLink></p>'
          values={{
            p: (content) => <p>{content}</p>,
            strong: (content) => <strong>{content}</strong>,
            learnMoreLink: (content) => <DocLink link='fleetOverview'>{content}</DocLink>,
          }}
        />
      </Fragment>
    )

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <EuiCallOut title={title}>{body}</EuiCallOut>
      </Fragment>
    )
  }

  renderSelfServiceUpgradeErrors() {
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    const plan = getEsPlan({ deployment })!
    const version = getVersion({ deployment: deploymentUnderEdit })
    const pendingVersion = getUpsertVersion({ deployment })

    const majorVersionChange = isMajorVersionChange(version, pendingVersion)

    const securityRealmOverrides =
      version &&
      gte(version, `6.7.0`) &&
      majorVersionChange &&
      hasSecurityRealmSettingOverrides({ plan })

    if (securityRealmOverrides) {
      return (
        <Fragment>
          <EuiSpacer size='m' />

          <CuiAlert className='overrideYamlError' type='error'>
            <FormattedMessage
              id='upgradable-deployment-version.confirm-to-perform-major-version-upgrade-override'
              defaultMessage='The existing settings do not allow for a self-service upgrade. Contact support for assistance to complete the upgrade.'
            />
          </CuiAlert>
        </Fragment>
      )
    }

    return null
  }

  renderFetchDeprecationErrors() {
    const { fetchDeprecationsRequest } = this.props

    if (fetchDeprecationsRequest == null) {
      return null
    }

    if (fetchDeprecationsRequest.error) {
      return (
        <Fragment>
          <EuiSpacer size='m' />

          <CuiAlert type='error' details={fetchDeprecationsRequest.error}>
            <FormattedMessage
              id='deployment-configure-es-version.failed-to-fetch-deprecations'
              defaultMessage='Failed to fetch deprecation information from cluster'
            />
          </CuiAlert>
        </Fragment>
      )
    }

    if (fetchDeprecationsRequest.inProgress) {
      return (
        <Fragment>
          <EuiSpacer size='m' />

          <EuiCallOut>
            <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
              <EuiFlexItem grow={false}>
                <FormattedMessage
                  id='cluster-snapshot-details.loading-deprecation-information'
                  defaultMessage='Fetching deprecation information …'
                />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiLoadingSpinner size='m' />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiCallOut>
        </Fragment>
      )
    }

    return null
  }

  renderFetchDeprecationAssistantErrors() {
    const { fetchDeprecationsAssistantRequest } = this.props

    if (fetchDeprecationsAssistantRequest && fetchDeprecationsAssistantRequest.error) {
      return (
        <Fragment>
          <EuiSpacer size='m' />

          <CuiAlert type='error' details={fetchDeprecationsAssistantRequest.error}>
            <FormattedMessage
              id='deployment-configure-es-version.failed-to-fetch-deprecation-assitant'
              defaultMessage='Failed to fetch deprecation assistant information from cluster'
            />
          </CuiAlert>
        </Fragment>
      )
    }

    return null
  }

  renderIncompatiblePluginWarnings() {
    const { extensions } = this.props
    const {
      editorState: { deployment, deploymentUnderEdit },
      selectedPluginUrls,
    } = this.state

    const plan = getEsPlan({ deployment })!
    const version = getVersion({ deployment: deploymentUnderEdit })
    const pendingVersion = getUpsertVersion({ deployment })
    const unsafeUserBundles = getIncompatibleCustomPlugins(version, pendingVersion, plan)

    return (
      <VerifyPlugins
        plan={plan}
        selectedPluginUrls={selectedPluginUrls}
        togglePlugin={this.togglePlugin}
        unsafeBundles={unsafeUserBundles}
        extensions={extensions || []}
        setDisabledUpgradeButton={this.setDisabledUpgradeButton}
      />
    )
  }

  renderMajorVersionChangeNotices() {
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    const pendingVersion = getUpsertVersion({ deployment })!
    const error = this.getVersionError()
    const version = getVersion({ deployment: deploymentUnderEdit })

    if (!version || !isMajorVersionChange(version, pendingVersion)) {
      return null
    }

    // If there are any critical warnings, skip the alert. The <Deprecations> component
    // will tell the user that the upgrade can't proceed, making this warning pointless.
    if (this.hasCriticalDeprecationMessages()) {
      return null
    }

    // The error could be set as a string or an API error object, depending
    // on whether we set it manually or rely on the error response.
    if (error != null && !isEmpty(error)) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <EuiCallOut
          title={
            <Fragment>
              <FormattedMessage
                data-test-id='major-version-upgrade'
                id='deployment-configure-es-version.major-upgrade-notice'
                defaultMessage='You will be performing a {majorUpgrade}.'
                values={{
                  majorUpgrade: (
                    <strong>
                      <FormattedMessage
                        id='deployment-configure-es-version.major-version-upgrade'
                        defaultMessage='major version upgrade'
                      />
                    </strong>
                  ),
                }}
              />

              {lt(pendingVersion, `7.0.0`) && (
                <FormattedMessage
                  id='deployment-configure-es-version.major-upgrade-restart'
                  defaultMessage='The cluster performs a full restart during the upgrade process.'
                />
              )}
            </Fragment>
          }
        >
          <p>
            <FormattedMessage
              id='deployment-configure-es-version.recommend-upgrade-guide'
              defaultMessage='We highly recommend {upgradeGuide} before upgrading a production cluster.'
              values={{
                upgradeGuide: (
                  <DocLink link='crossClusterRestoreDocLink'>
                    <FormattedMessage
                      id='deployment-configure-es-version.upgrading-a-cloned-cluster'
                      defaultMessage='testing the upgrade process with a cloned cluster'
                    />
                  </DocLink>
                ),
              }}
            />
          </p>
        </EuiCallOut>
      </Fragment>
    )
  }

  renderDeprecationNotices() {
    const { getDeprecations } = this.props
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    const pendingVersion = getUpsertVersion({ deployment })!
    const deprecations = getDeprecations(pendingVersion)

    const kibanaRoute = kibanaUrl(deploymentUnderEdit.id)
    const hasKibana = isSliderEnabledInStackDeployment(deploymentUnderEdit, `kibana`)

    // these notices can be 'error', 'warning', or 'info'
    return (
      <Deprecations
        deprecations={deprecations}
        hasKibana={hasKibana}
        kibanaRoute={kibanaRoute}
        deployment={deploymentUnderEdit}
      />
    )
  }

  renderIncompatibilityNotices() {
    const {
      intl: { formatMessage },
    } = this.props
    const {
      editorState: { deploymentUnderEdit, deployment },
    } = this.state

    const pendingVersion = getUpsertVersion({ deployment })

    // The read only API the migration wizard uses first became available in 7.6.0
    if (this.isAppSearchDeprecated() && pendingVersion && gte(pendingVersion, `7.6.0`)) {
      const { startAppSearchToEnterpriseSearchMigration, onCancel } = this.props
      return (
        <Fragment>
          <EuiSpacer size='m' />

          <CuiAlert type='info' data-test-id='upgradable-deployment-version-appsearch-limit'>
            <FormattedMessage
              id='upgradable-deployment-version.appsearch-limit'
              defaultMessage='App Search will become Enterprise Search. To upgrade to Elastic Stack 7.7.0 and above, deployments using App Search instances must be migrated.'
            />
            <EuiSpacer size='s' />
            <EuiButton
              onClick={() => {
                startAppSearchToEnterpriseSearchMigration({ deployment: deploymentUnderEdit })
                onCancel()
              }}
            >
              <FormattedMessage
                id='upgradable-deployment-version.appsearch-start-migration'
                defaultMessage='Start migration'
              />
            </EuiButton>
          </CuiAlert>
        </Fragment>
      )
    }

    const resourceUsageWarning = this.renderResourceUsageWarnings()

    if (resourceUsageWarning) {
      return resourceUsageWarning
    }

    const readOnlyMessage = getReadOnlyMessage({ deployment: deploymentUnderEdit })

    if (readOnlyMessage) {
      return (
        <Fragment>
          <EuiSpacer size='m' />

          <CuiAlert type='info' data-test-id='upgradable-deployment-version-readonly-mode'>
            {readOnlyMessage}
          </CuiAlert>
        </Fragment>
      )
    }

    if (hasMismatchingVersions({ deployment: deploymentUnderEdit })) {
      const highestExistingVersion = getHighestSliderVersion({ deployment: deploymentUnderEdit })
      const mismatchingSliderNames = getSliderInstancesTypeRequiringUpgrade({
        deployment: deploymentUnderEdit,
      }).map((sliderInstanceType) => {
        const version = getSliderVersion({ deployment: deploymentUnderEdit, sliderInstanceType })
        return formatMessage(getSliderPrettyName({ sliderInstanceType, version }))
      })
      const formattedSliderNames = formatAsSentence(mismatchingSliderNames)

      return (
        <Fragment>
          <EuiSpacer size='m' />

          <EuiCallOut
            color='primary'
            iconType='questionInCircle'
            data-test-id='upgradable-deployment-version-version-mismatch'
            title={
              <FormattedMessage
                id='deployment-upgrades.incompatible-version-mismatch-title'
                defaultMessage='Upgrade {formattedSliderNames} to {highestExistingVersion}'
                values={{
                  highestExistingVersion,
                  formattedSliderNames,
                }}
              />
            }
          >
            <FormattedMessage
              id='deployment-upgrades.incompatible-version-mismatch-description'
              defaultMessage='{formattedSliderNames} {sliderCount, plural, one {needs} other {need}} to be at {highestExistingVersion} before upgrading your deployment to a newer version.'
              values={{
                highestExistingVersion,
                formattedSliderNames,
                sliderCount: mismatchingSliderNames.length,
              }}
            />
          </EuiCallOut>
        </Fragment>
      )
    }

    return null
  }

  renderDryRunValidationWarnings() {
    const {
      editorState: { deploymentUnderEdit },
    } = this.state

    if (!this.isUpgradeAvailable()) {
      return null
    }

    const deploymentUpdateRequest = this.getUpdateRequest()

    return (
      <StackDeploymentUpdateDryRunWarnings
        deploymentId={deploymentUnderEdit.id}
        deployment={deploymentUpdateRequest}
        spacerBefore={true}
        ignoreSecurityRealmWarnings={true}
      />
    )
  }

  renderResourceUsageWarnings() {
    const {
      editorState: { deploymentUnderEdit, deployment },
    } = this.state
    const sliderInstanceType: SliderInstanceType = `enterprise_search`
    const versionThreshold = `7.12.0`

    const hasEnterpriseSearch = isSliderEnabledInStackDeployment(
      deploymentUnderEdit,
      sliderInstanceType,
    )

    if (!hasEnterpriseSearch) {
      return null
    }

    const currentVersion = getVersion({ deployment: deploymentUnderEdit })

    if (isNull(currentVersion) || gte(currentVersion, versionThreshold)) {
      return null
    }

    const pendingVersion = getUpsertVersion({ deployment })

    if (isNull(pendingVersion) || lt(pendingVersion, versionThreshold)) {
      return null
    }

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <EuiCallOut
          color='warning'
          data-test-subj='ent-search-storage-usage-increase'
          title={
            <FormattedMessage
              id='ent-search-storage-usage-increase.title'
              defaultMessage='This upgrade requires a migration'
            />
          }
        >
          <EuiListGroup maxWidth={false} style={{ margin: 0, padding: 0 }}>
            <EuiListGroupItem
              size='s'
              wrapText={true}
              label={
                <FormattedMessage
                  id='ent-search-storage-usage-increase.body'
                  defaultMessage='This version of {sliderPrettyName} brings an updated and optimized data structure, and temporarily requires additional storage capacity during the upgrade phase. Once completed, certain indices can be purged, resulting in a smaller, more efficient deployment. Proceeding will set {sliderPrettyName} into read-only mode for the duration of the upgrade process. {docLink}'
                  values={{
                    sliderPrettyName: (
                      <FormattedMessage
                        {...getSliderPrettyName({ sliderInstanceType, version: currentVersion })}
                      />
                    ),
                    docLink: (
                      <DocLink link='entSearchStorageIncrease'>
                        <FormattedMessage
                          id='ent-search-storage-usage-increase.learnmore'
                          defaultMessage='Learn more about the improvements, migration process and data removal steps'
                        />
                      </DocLink>
                    ),
                  }}
                />
              }
            />
          </EuiListGroup>
        </EuiCallOut>
      </Fragment>
    )
  }

  renderMajorUpgradeWarnings() {
    const {
      editorState: { deploymentUnderEdit },
    } = this.state

    const kibana = getFirstSliderClusterFromGet({
      deployment: deploymentUnderEdit,
      sliderInstanceType: `kibana`,
    })!
    const hasKibana = isSliderEnabledInStackDeployment(deploymentUnderEdit, `kibana`)
    const isKibanaStopped = hasKibana ? isStopped({ resource: kibana }) : false

    if (hasKibana && !isKibanaStopped) {
      return null
    }

    if (!hasKibana) {
      return (
        <Fragment>
          <EuiSpacer size='m' />

          <CuiAlert
            data-test-id='upgradable-deployment-version-warning-message-no-kibana'
            className='kibanaNotEnabled'
            type='info'
          >
            <FormattedMessage
              id='upgradable-deployment-version.upgrade-cluster.kibana-is-not-enabled'
              defaultMessage='Enable Kibana to benefit from the {upgradeAssistant}.'
              values={{
                upgradeAssistant: (
                  <DocLink link={`upgradeAssistantDocLink`}>
                    <FormattedMessage
                      id='upgradable-deployment-version.upgrade-cluster.upgrade-assistant'
                      defaultMessage='Upgrade Assistant'
                    />
                  </DocLink>
                ),
              }}
            />
          </CuiAlert>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <EuiSpacer size='m' />

        <CuiAlert
          data-test-id='upgradable-deployment-version-warning-message'
          className='kibanaMissingError'
          type='warning'
        >
          <FormattedMessage
            id='upgradable-deployment-version.upgrade-cluster.kibana-is-not-available'
            defaultMessage='Kibana is terminated. For major upgrades, restart Kibana to use the {upgradeAssistant} for settings and indices.'
            values={{
              upgradeAssistant: (
                <ExternalLink
                  className='learn-more-link'
                  href='https://www.elastic.co/guide/en/kibana/6.8/upgrade-assistant.html'
                >
                  <FormattedMessage
                    id='upgradable-deployment-version.upgrade-cluster.upgrade-assistant'
                    defaultMessage='Upgrade Assistant'
                  />
                </ExternalLink>
              ),
            }}
          />
        </CuiAlert>
      </Fragment>
    )
  }

  renderUpgradeButton({ dryRunCheckPassed }: { dryRunCheckPassed: boolean }) {
    const { updateStackDeploymentRequest } = this.props
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    const version = getVersion({ deployment: deploymentUnderEdit })
    const pendingVersion = getUpsertVersion({ deployment })
    const majorVersionChange = isMajorVersionChange(version, pendingVersion)
    const disabled = this.isUpgradeButtonDisabled({ dryRunCheckPassed })

    if (majorVersionChange) {
      const plan = getEsPlan({ deployment })!
      const needsReview = needsYamlSettingsReview({
        version,
        plan,
      })

      return (
        <EuiFlexItem grow={false}>
          <EuiButton
            data-test-id='upgradable-deployment-version-majorVersionBtn'
            fill={true}
            color='primary'
            disabled={disabled}
            onClick={this.onOpenYamlSettings}
          >
            {needsReview ? (
              <FormattedMessage
                id='upgradable-deployment-version.review-user-settings-before-upgrade-deployment'
                defaultMessage='Review user settings'
              />
            ) : (
              <FormattedMessage
                id='upgradable-deployment-version.upgrade-deployment'
                defaultMessage='Upgrade'
              />
            )}
          </EuiButton>
        </EuiFlexItem>
      )
    }

    return (
      <EuiFlexItem grow={false}>
        <SpinButton
          data-test-id='upgradable-deployment-version-majorVersionBtn'
          disabled={disabled}
          color='primary'
          fill={true}
          onClick={this.onSave}
          requiresSudo={true}
          spin={updateStackDeploymentRequest.inProgress}
        >
          <FormattedMessage
            id='upgradable-deployment-version.upgrade-deployment'
            defaultMessage='Upgrade'
          />
        </SpinButton>
      </EuiFlexItem>
    )
  }

  renderReviewYamlSettingsModal() {
    const { getDeprecations, fetchDeprecationsAssistantRequest, updateStackDeploymentRequest } =
      this.props

    const {
      editorState: { deployment, deploymentUnderEdit },
      showYamlModal,
    } = this.state

    const version = getVersion({ deployment: deploymentUnderEdit })
    const pendingVersion = getUpsertVersion({ deployment })!
    const majorVersionChange = isMajorVersionChange(version, pendingVersion)

    if (!showYamlModal) {
      return null
    }

    if (!majorVersionChange) {
      return null
    }

    const deprecations = getDeprecations(pendingVersion)
    const hasKibana = isSliderEnabledInStackDeployment(deploymentUnderEdit, `kibana`)
    // in case we don't have Kibana, just default to true here because we don't want to prevent users from upgrading
    const readyForUpgrade = hasKibana ? Boolean(deprecations?.readyForUpgrade) : true

    return (
      <ReviewYamlSettings
        fetchDeprecationsAssistantRequest={fetchDeprecationsAssistantRequest}
        saveClusterPlanStatus={updateStackDeploymentRequest}
        readyForUpgrade={readyForUpgrade}
        deploymentUpdateRequest={deployment}
        updatePlan={this.updateEsPlan}
        version={version!}
        onClose={this.onCloseYamlSettings}
        onSave={this.onSave}
      />
    )
  }

  getInitialEditorState(): State['editorState'] {
    const { deployment, deploymentTemplate } = this.props

    const editorState = {
      deploymentUnderEdit: deployment,
      deployment: createUpdateRequestFromGetResponse({
        deployment,
        deploymentTemplate,
      }),
    }

    if (hasMismatchingVersions({ deployment })) {
      const intendedVersion = getVersion({ deployment })
      // set the initial version to the esVersion
      // as all other versions will be disabled.
      setDeploymentVersion({
        deployment: editorState.deployment,
        intendedVersion,
      })
    }

    return editorState
  }

  getVersionError() {
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    const pendingVersion = getUpsertVersion({ deployment })
    const previousVersion = getVersion({ deployment: deploymentUnderEdit })

    // Needs to upgrade to 5.6.0 to use the deprecations
    if (
      isUpgradeAssistantNotSupported(previousVersion) &&
      isUpgradeAssistantRequired(pendingVersion) &&
      isMajorVersionChange(previousVersion, pendingVersion)
    ) {
      return MUST_UPGRADE_TO_5_6_FIRST
    }

    const { updateStackDeploymentRequest } = this.props

    return updateStackDeploymentRequest.error
  }

  isUpgradeButtonDisabled = ({ dryRunCheckPassed }: { dryRunCheckPassed: boolean }): boolean => {
    const { fetchDeprecationsAssistantRequest, updateStackDeploymentRequest } = this.props

    const {
      editorState: { deployment, deploymentUnderEdit },
      disableUpgradeButton,
    } = this.state

    const plan = getEsPlan({ deployment })!
    const version = getVersion({ deployment: deploymentUnderEdit })!
    const lowestVersion = getLowestSliderVersion({ deployment: deploymentUnderEdit })
    const pendingVersion = getUpsertVersion({ deployment })
    const majorVersionChange = isMajorVersionChange(version, pendingVersion)
    const loading = this.isFetchingDependencies()
    const validationErrors = validateUpdateRequest({
      deploymentUnderEdit,
      deployment,
    })

    if (loading) {
      return true
    }

    if (disableUpgradeButton) {
      return true
    }

    if (!version && !lowestVersion) {
      return true
    }

    if (lowestVersion === pendingVersion) {
      return true
    }

    if (this.isAppSearchDeprecated(pendingVersion)) {
      return true
    }

    if (!isEmpty(validationErrors)) {
      return true
    }

    if (majorVersionChange) {
      if (updateStackDeploymentRequest.inProgress) {
        return true
      }

      if (fetchDeprecationsAssistantRequest && fetchDeprecationsAssistantRequest.error) {
        return true
      }

      // if the user has 'xpack.security.authc.realms' `user_settings_override_yaml`
      // they can't update the settings themselves, don't show any dialog
      if (gte(version, `6.7.0`) && hasSecurityRealmSettingOverrides({ plan })) {
        return true
      }
    }

    if (!dryRunCheckPassed) {
      return true
    }

    if (this.hasCriticalDeprecationMessages()) {
      return true
    }

    return false
  }

  isFetchingDependencies() {
    const { isLoadingRegion, extensions, fetchDeprecationsAssistantRequest } = this.props
    const isUserConsole = getConfigForKey(`APP_NAME`) === `userconsole`

    if (isLoadingRegion) {
      return true
    }

    if (isUserConsole && !extensions) {
      return true
    }

    if (fetchDeprecationsAssistantRequest && fetchDeprecationsAssistantRequest.inProgress) {
      return true
    }

    return false
  }

  onCloseYamlSettings = () => this.setState({ showYamlModal: false })

  onOpenYamlSettings = () => this.setState({ showYamlModal: true })

  onSave = () => {
    const { fetchDeployment, updateDeployment } = this.props
    const {
      editorState: {
        deploymentUnderEdit: { id: deploymentId },
      },
    } = this.state

    const deployment = this.getUpdateRequest()

    updateDeployment({
      deploymentId,
      deployment,
      redirect: true,
      dryRun: false,
    }).then(() => {
      fetchDeployment({ deploymentId })
    })
  }

  updateEsPlan = (path: string | string[], value: any) => {
    const { editorState } = this.state

    const updatedEditorState = replaceIn(
      editorState,
      ['deployment', 'resources', 'elasticsearch', '0', 'plan', ...path],
      value,
    )

    this.setState({ editorState: updatedEditorState })
  }

  getUpdateRequest(): DeploymentUpdateRequest {
    const { extensions } = this.props
    const {
      editorState: { deployment, deploymentUnderEdit },
      selectedPluginUrls,
    } = this.state

    return getUpdateRequestWithPluginsAndTransforms({
      updateRequest: deployment,
      deploymentUnderEdit,
      extensions: extensions!,
      selectedPluginUrls,
    })
  }

  updateVersion(newVersion: string, previousVersion?: string | null) {
    const { upgradeAssistant, versionStacks } = this.props
    const {
      editorState: { deployment, deploymentUnderEdit },
      editorState,
    } = this.state

    const stackVersion = find(versionStacks, { version: newVersion })

    setDeploymentVersion({
      deployment,
      intendedVersion: newVersion,
      stackVersion,
    })

    this.setState({
      editorState,
    })

    if (!previousVersion || isUpgradeAssistantNotSupported(previousVersion)) {
      return
    }

    const regionId = getRegionId({ deployment: deploymentUnderEdit })!

    if (lt(previousVersion, `6.7.0`)) {
      // Use deprecations API
      const { id: clusterId } = getFirstEsClusterFromGet({
        deployment: deploymentUnderEdit,
      })!

      return this.fetchDeprecationsIfNeeded(newVersion, regionId, clusterId)
    }

    const hasKibana = isSliderEnabledInStackDeployment(deploymentUnderEdit, `kibana`)

    if (!hasKibana) {
      return
    }

    // Otherwise use the upgrade assistant
    const { id: clusterId } = getFirstSliderClusterFromGet<KibanaResourceInfo>({
      deployment: deploymentUnderEdit,
      sliderInstanceType: `kibana`,
    })!

    upgradeAssistant({
      version: newVersion,
      previousVersion,
      clusterId,
      regionId,
    })
  }

  hasCriticalDeprecationMessages(): boolean {
    const { getDeprecations } = this.props
    const {
      editorState: { deployment },
    } = this.state

    const pendingVersion = getUpsertVersion({ deployment })!
    const deprecations = getDeprecations(pendingVersion)

    return deprecations != null && hasAnyCriticalMessages(deprecations)
  }

  fetchDeprecationsIfNeeded(version: string, regionId: string, clusterId: string) {
    const { fetchDeprecations, getDeprecations } = this.props

    const deprecations = getDeprecations(version)

    if (!deprecations) {
      fetchDeprecations({
        version,
        regionId,
        clusterId,
      })
    }
  }

  setDisabledUpgradeButton = (value) => this.setState({ disableUpgradeButton: value })

  isAppSearchDeprecated(version?: string | null): boolean {
    const {
      editorState: { deploymentUnderEdit },
    } = this.state

    const availableVersions = version ? [version] : this.getAvailableVersions()

    return isSliderDeprecated(deploymentUnderEdit, `appsearch`, availableVersions)
  }

  getAvailableVersions = (): string[] => {
    const { availableVersions } = this.props
    const {
      editorState: { deploymentUnderEdit },
    } = this.state

    if (!availableVersions) {
      return []
    }

    // temporary fix, still waiting for the API to provide upgrade available for system owned deployment
    // see https://github.com/elastic/cloud/issues/31782
    return isSystemOwned({ deployment: deploymentUnderEdit })
      ? filter(availableVersions, (version) => satisfies(version, `<7`))
      : availableVersions
  }

  getUnavailableVersionUpgrades = (availableVersions: string[]): UnavailableVersionUpgrades => {
    const { versionStacks } = this.props
    const {
      editorState: { deploymentUnderEdit },
    } = this.state

    const version = getVersion({ deployment: deploymentUnderEdit })

    if (!version) {
      return {}
    }

    if (!versionStacks) {
      return {}
    }

    const unavailableVersionStacks: StackVersionConfig[] =
      versionStacks.filter(isUnavailableVersion)

    const upgradableVersions = unavailableVersionStacks.filter(isUpgradableFromGreaterVersion)
    const upgradableGroups = groupBy(upgradableVersions, `min_upgradable_from`)

    const unavailableVersionUpgrades = mapValues(upgradableGroups, (g) =>
      map(g, (versionStack) => versionStack.version!).sort(rcompare),
    )

    return unavailableVersionUpgrades

    function isUnavailableVersion(versionStack: StackVersionConfig): boolean {
      if (!versionStack.version) {
        return false
      }

      const available = availableVersions.includes(versionStack.version)

      if (available) {
        return false
      }

      const isLaterVersion = gt(versionStack.version, version!)

      return isLaterVersion
    }

    function isUpgradableFromGreaterVersion(versionStack: StackVersionConfig): boolean {
      const upgradableFrom = versionStack.min_upgradable_from

      // pre-release versions can't be upgraded into, thus no `min_upgradable_from`
      if (!upgradableFrom) {
        return false
      }

      const upgradableFromGreaterVersion = gt(upgradableFrom, version!)

      return upgradableFromGreaterVersion
    }
  }

  isUpgradeAvailable = (): boolean => {
    const {
      editorState: { deployment, deploymentUnderEdit },
    } = this.state

    // If a deployment is partially upgraded, we pick the lowest
    // found version found in each resource to upgrade from.
    const lowestVersion = getLowestSliderVersion({ deployment: deploymentUnderEdit })
    const pendingVersion = getUpsertVersion({ deployment })

    if (!pendingVersion || pendingVersion === lowestVersion) {
      return false
    }

    return true
  }

  togglePlugin = (url) => {
    const { selectedPluginUrls } = this.state
    this.setState({ selectedPluginUrls: xor(selectedPluginUrls, [url]) })
  }
}

export default withErrorBoundary(injectIntl(DeploymentVersionUpgradeModalClass))

function isUpgradeAssistantNotSupported(version: string | null) {
  return version && lt(version, `5.6.0`)
}

function isUpgradeAssistantRequired(pendingVersion: string | null) {
  return pendingVersion && gte(pendingVersion, `6.0.0`)
}

function getVersionErrorMessage(error: string | Error | undefined, version: string): ReactNode {
  if (error === MUST_UPGRADE_TO_5_6_FIRST) {
    return (
      <FormattedMessage
        data-test-id='must-upgrade-to-5-6'
        id='deployment-configure-es-version.must-upgrade-to-5-6'
        defaultMessage='You need to upgrade to 5.6 before you can upgrade to { version }'
        values={{ version }}
      />
    )
  }

  return (
    <FormattedMessage
      data-test-id='cannot-upgrade-gave-up'
      id='deployment-configure-es-version.something-is-wrong'
      defaultMessage='There is a problem upgrading to {version}: {error}'
      values={{
        version,
        error: <EuiCode>{String(error)}</EuiCode>,
      }}
    />
  )
}
