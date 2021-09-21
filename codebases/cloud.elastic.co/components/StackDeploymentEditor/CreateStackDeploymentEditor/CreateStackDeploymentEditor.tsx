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

import React, { Component, Fragment } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'
import Sticky from 'react-sticky-el'
import cx from 'classnames'

import {
  EuiSplitPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiHorizontalRule,
  EuiPanel,
} from '@elastic/eui'

import SelectTemplate from './SelectTemplate'
import ConfigureDeploymentSteps from './ConfigureDeploymentSteps'
import BottomNavForSelectTemplate from './BottomNavForSelectTemplate'
import BottomNavForConfigureDeployment from './BottomNavForConfigureDeployment'
import BottomNavForConfigureIndexManagement from './BottomNavForConfigureIndexManagement'
import CreateStackDeploymentTitle from '../CreateStackDeploymentTitle'

import ConfigureIndexManagement from '../ConfigureIndexManagement'
import PricingRates from '../../../apps/userconsole/components/StackDeploymentPricing/PricingRates'
import {
  changeRestoreFromSnapshot,
  getDeploymentNameSetter,
  getDeploymentSettings,
  getDeploymentVersionSetter,
  getEsNodeConfigurations,
  getUpsertVersion,
  getRegionIdForCreate,
  setEsSettings,
  isAutoscalingEnabled,
} from '../../../lib/stackDeployments'

import { getNumberOfAvailableZones } from '../../../lib/deployments/availabilityZones'

import { getCurationConfigurationOptions } from '../../../lib/curation'
import { inTrial, inActiveTrial } from '../../../lib/trial'

import { CreateEditorComponentConsumerProps as ConsumerProps } from '../types'
import {
  ClusterSnapshot,
  ElasticsearchCluster,
  AsyncRequestState,
  ProfileState,
} from '../../../types'
import { StackVersionConfig } from '../../../lib/api/v1/types'

import './createStackDeploymentEditor.scss'

type StateProps = {
  showPrice: boolean
  stackVersions: StackVersionConfig[] | null
  createStackDeploymentRequest: AsyncRequestState
  trialMaxedOut: boolean
  profile: ProfileState
}

interface DispatchProps {}

type Props = StateProps & DispatchProps & ConsumerProps & WrappedComponentProps

type State = {
  page: 'selectTemplate' | 'configureDeployment' | 'indexManagement'
  skippedCuration: boolean
  restoreSnapshotSource: ElasticsearchCluster | null
}

class CreateStackDeploymentEditor extends Component<Props, State> {
  state: State = {
    page: `selectTemplate`,
    skippedCuration: false,
    restoreSnapshotSource: null,
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (this.state.page !== prevState.page) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return <div className='create-deployment-from-template'>{this.renderContent()}</div>
  }

  renderContent() {
    const title = (
      <CreateStackDeploymentTitle
        page={this.state.page}
        showTrialExperience={this.props.showTrialExperience}
      />
    )

    return (
      <Fragment>
        <EuiSplitPanel.Outer
          className={cx(
            'create-deployment-panel',
            this.state.page === `selectTemplate`
              ? `select-template-panel`
              : `configure-deployment-panel`,
          )}
        >
          <EuiSplitPanel.Inner className='create-deployment-panel-title'>
            {title}
            <EuiHorizontalRule margin='s' />
          </EuiSplitPanel.Inner>
          {this.renderPage()}
        </EuiSplitPanel.Outer>
        {this.state.page === `configureDeployment` && this.renderConfigureDeploymentFooter()}
      </Fragment>
    )
  }

  renderPage() {
    const {
      availableVersions,
      createStackDeploymentRequest,
      editorState,
      onChange,
      region,
      setDeploymentTemplate,
      setRegion,
      showPrice,
      showRegion,
      trialMaxedOut,
      whitelistedVersions,
      profile,
      globalDeploymentTemplates,
      setGlobalTemplate,
    } = this.props

    const { page, skippedCuration, restoreSnapshotSource } = this.state
    const { deploymentTemplate, regionId, deployment } = editorState
    const disableBottomNav = this.shouldDisableBottomNav()

    if (page === `selectTemplate`) {
      /* only show the `Customize deployment` button if one of the following is true
       *   a) the user isn't in a trial
       *   b) the user is in a trial but already created at least one deployment
       */
      const showConfigureButton = !inTrial({ profile }) || inActiveTrial({ profile })

      return (
        <Fragment>
          <EuiSplitPanel.Inner className='create-deployment-panel-body'>
            <SelectTemplate
              disabled={createStackDeploymentRequest.inProgress}
              editorState={editorState}
              globalDeploymentTemplates={globalDeploymentTemplates}
              setDeploymentName={getDeploymentNameSetter({ onChange })}
              setDeploymentTemplate={setDeploymentTemplate}
              setGlobalTemplate={setGlobalTemplate}
              availableVersions={availableVersions}
              whitelistedVersions={whitelistedVersions}
              setVersion={getDeploymentVersionSetter({ editorState, onChange })}
              setRegion={setRegion}
              showRegion={showRegion!}
              region={region}
              showPrice={showPrice}
              onChange={onChange}
              onChangeSnapshotSource={this.onChangeSnapshotSource}
              onChangeSnapshot={this.onChangeSnapshot}
              setEsSettings={this.updateEsSettings}
              restoreFromSnapshot={restoreSnapshotSource !== null}
              trialMaxedOut={trialMaxedOut}
            />

            <EuiSpacer size='l' />
          </EuiSplitPanel.Inner>
          <EuiSplitPanel.Inner className='create-deployment-footer'>
            <EuiFlexGroup style={{ justifyContent: `flex-end` }} justifyContent='spaceBetween'>
              {showPrice && regionId && showConfigureButton && (
                <EuiFlexItem style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                  <PricingRates
                    isAutoscalingEnabled={isAutoscalingEnabled({ deployment })}
                    regionId={regionId}
                    deployment={deployment}
                    deploymentTemplate={deploymentTemplate}
                  />
                </EuiFlexItem>
              )}
              <EuiFlexItem grow={false}>
                <BottomNavForSelectTemplate
                  disabled={disableBottomNav || createStackDeploymentRequest.inProgress}
                  editorState={editorState}
                  goToConfigureDeployment={this.goToConfigureDeployment}
                  createStackDeploymentRequest={createStackDeploymentRequest}
                  showConfigureButton={showConfigureButton}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiSplitPanel.Inner>
        </Fragment>
      )
    }

    if (page === `indexManagement`) {
      const { instance_configurations: instanceConfigurations = [] } = deploymentTemplate!

      const curationSettings = this.getCurationSettings()
      const curationConfigurationOptions = getCurationConfigurationOptions(curationSettings)

      return (
        <ConfigureIndexManagement
          instanceConfigurations={instanceConfigurations}
          editorState={editorState}
          onChange={onChange}
          curationConfigurationOptions={curationConfigurationOptions}
          bottomNavigationButtons={
            <BottomNavForConfigureIndexManagement
              disabled={disableBottomNav}
              editorState={editorState}
              goToConfigureDeployment={this.goToConfigureDeployment}
              createStackDeploymentRequest={createStackDeploymentRequest}
              skippedCuration={skippedCuration}
            />
          }
          canBeSkipped={true}
          skippedCuration={skippedCuration}
          onSkip={() => this.setState({ skippedCuration: true })}
          onSkipCancel={() => this.setState({ skippedCuration: false })}
        />
      )
    }

    if (page === `configureDeployment`) {
      const snapshotDetails =
        restoreSnapshotSource === null
          ? {}
          : {
              deploymentId: restoreSnapshotSource.id,
              deploymentName: getDeploymentName(restoreSnapshotSource),
              regionId: showRegion ? restoreSnapshotSource.regionId : null,
              snapshotDate: restoreSnapshotSource.snapshots.status.latestSuccessAt || ``,
            }

      return (
        <EuiSplitPanel.Inner style={{ padding: `0 60px` }}>
          {/*@ts-ignore: ??? */}
          <ConfigureDeploymentSteps
            editorState={editorState}
            onChange={onChange}
            firstStepNumber={this.getSelectTemplateStepCount() + 1}
            region={region}
            availableNumberOfZones={getNumberOfAvailableZones(region!)}
            snapshotDetails={snapshotDetails}
            showPrice={showPrice}
          />
        </EuiSplitPanel.Inner>
      )
    }

    throw new Error(`Unknown Create Deployment page: "${page}"`)
  }

  renderConfigureDeploymentFooter() {
    const { showPrice, editorState, createStackDeploymentRequest } = this.props
    const { deploymentTemplate, regionId, deployment } = editorState
    const disableBottomNav = this.shouldDisableBottomNav()

    return (
      <Sticky mode='bottom'>
        <EuiPanel className='configure-deployment-footer'>
          <EuiFlexGroup style={{ justifyContent: `flex-end` }} justifyContent='spaceBetween'>
            {showPrice && regionId && (
              <EuiFlexItem style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                <PricingRates
                  isAutoscalingEnabled={isAutoscalingEnabled({ deployment })}
                  regionId={regionId}
                  deployment={deployment}
                  deploymentTemplate={deploymentTemplate}
                />
              </EuiFlexItem>
            )}
            <EuiFlexItem grow={false}>
              <BottomNavForConfigureDeployment
                disabled={disableBottomNav}
                editorState={editorState}
                goToSelectTemplate={() => this.setState({ page: `selectTemplate` })}
                goToIndexCuration={() => this.setState({ page: `indexManagement` })}
                createStackDeploymentRequest={createStackDeploymentRequest}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </Sticky>
    )
  }

  onChangeSnapshotSource = (nextRestoreSnapshotSource?: ElasticsearchCluster | null) => {
    const { onChange } = this.props

    if (nextRestoreSnapshotSource == null) {
      this.setState({ restoreSnapshotSource: null })
      changeRestoreFromSnapshot({ onChange, source: null })
      return
    }

    this.setState({ restoreSnapshotSource: nextRestoreSnapshotSource })

    changeRestoreFromSnapshot({ onChange, source: nextRestoreSnapshotSource })
  }

  onChangeSnapshot = (nextSnapshot?: ClusterSnapshot | null) => {
    const { onChange } = this.props
    const { restoreSnapshotSource } = this.state
    changeRestoreFromSnapshot({
      onChange,
      source: restoreSnapshotSource,
      snapshotName: nextSnapshot ? nextSnapshot.snapshot : undefined,
    })
  }

  getCurationSettings() {
    const { editorState } = this.props
    const { deployment, deploymentTemplate } = editorState
    const { instance_configurations: instanceConfigurations } = deploymentTemplate!
    const dataNodeConfigurations = getEsNodeConfigurations({ deployment, nodeType: `data` })

    return {
      dataNodeConfigurations,
      instanceConfigurations: instanceConfigurations!,
    }
  }

  getEsSettings = () => {
    const { editorState } = this.props
    const { deployment } = editorState
    const deploymentSettings = getDeploymentSettings({ deployment })
    return deploymentSettings
  }

  updateEsSettings = (settings) => {
    const { onChange } = this.props
    setEsSettings({ onChange, settings })
  }

  shouldDisableBottomNav = (): boolean => {
    const { region, editorState, trialMaxedOut } = this.props
    const { deployment, regionId, _joltVersion } = editorState

    if (trialMaxedOut) {
      return true
    }

    if (
      deployment.settings?.observability &&
      !deployment.settings?.observability?.metrics &&
      !deployment.settings?.observability?.logging
    ) {
      return true
    }

    /*
     * A missing region — or a region mismatch — would indicate we haven't finished
     * fetching the currently selected region.
     */
    const actualRegionId = deployment && getRegionIdForCreate({ deployment })
    const missingRegion = !region || !regionId
    const regionMismatch = actualRegionId !== regionId

    if (missingRegion || regionMismatch) {
      return true
    }

    /*
     * `_joltVersion` is the currently selected version.
     * `actualVersion` comes from the deployment, based on the deployment template.
     * A mismatch means the template hasn't yet been fetched, and passed along
     * to the `editorState`.
     */
    const actualVersion = getUpsertVersion({ deployment, _fromJolt: false })
    const missingVersion = !_joltVersion || !actualVersion
    const versionMismatch = _joltVersion !== actualVersion

    if (missingVersion || versionMismatch) {
      return true
    }

    return false
  }

  goToConfigureDeployment = () => {
    this.setState({ page: `configureDeployment` })
  }

  getSelectTemplateStepCount() {
    const { showRegion } = this.props

    let count = 3 // name step, setup step, optimize step

    if (showRegion) {
      count += 2 // platform step, region step
    }

    return count // NOTE: pricing step doesn't count!
  }
}

export default injectIntl(CreateStackDeploymentEditor)

function getDeploymentName(cluster: ElasticsearchCluster) {
  const { name, displayId } = cluster

  return name ? `${name} (${displayId})` : displayId
}
