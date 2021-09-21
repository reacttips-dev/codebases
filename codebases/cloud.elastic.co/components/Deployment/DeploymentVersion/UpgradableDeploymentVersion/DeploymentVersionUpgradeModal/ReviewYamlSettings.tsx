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

import React, { Component, ReactNode, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { get, flatMap, cloneDeep } from 'lodash'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiConfirmModal,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
  EuiText,
} from '@elastic/eui'

import { CuiAlert, CuiCodeBlock } from '../../../../../cui'

import ReviewYamlSettingsEditor from './ReviewYamlSettingsEditor'

import { categorizeTopologies } from '../../../../../lib/deployments/nodeTypes'
import { isEnabledConfiguration } from '../../../../../lib/deployments/conversion'
import { hasUserSetting, hasUserSettingJson } from '../../../../../lib/deployments/userSettings'
import { isValidYaml } from '../../../../../lib/yaml'
import { lt } from '../../../../../lib/semver'
import { getEsPlan } from '../../../../../lib/stackDeployments'

import { AsyncRequestState } from '../../../../../types'
import {
  DeploymentUpdateRequest,
  ElasticsearchClusterPlan,
  ElasticsearchClusterTopologyElement,
} from '../../../../../lib/api/v1/types'

export type Props = {
  deploymentUpdateRequest: DeploymentUpdateRequest
  onClose: () => void
  onSave: () => void
  readyForUpgrade: boolean
  updatePlan: (path: string | string[], value: any) => void
  fetchDeprecationsAssistantRequest: AsyncRequestState
  saveClusterPlanStatus: AsyncRequestState
  version: string
}

type State = {
  pendingPlanUponMount: ElasticsearchClusterPlan
}

const esUserSettingsPath = [`elasticsearch`, `user_settings_yaml`]
const esUserSettingsOverridePath = [`elasticsearch`, `user_settings_override_yaml`]
const esUserSettingsOverrideJsonPath = [`elasticsearch`, `user_settings_override_json`]

const esNodeTypes = [`master` as const, `data` as const]

export default class ReviewYamlSettings extends Component<Props, State> {
  state = {
    pendingPlanUponMount: cloneDeep(getEsPlan({ deployment: this.props.deploymentUpdateRequest })!),
  }

  render() {
    const {
      onClose,
      onSave,
      readyForUpgrade,
      version,
      fetchDeprecationsAssistantRequest,
      saveClusterPlanStatus,
      deploymentUpdateRequest,
    } = this.props

    const { pendingPlanUponMount } = this.state

    const currentPendingPlan = getEsPlan({ deployment: deploymentUpdateRequest })!

    if (fetchDeprecationsAssistantRequest && fetchDeprecationsAssistantRequest.inProgress) {
      return null
    }

    if (lt(version, `6.7.0`)) {
      return this.renderUpgradeConfirmationModal({ showRestartText: true })
    }

    if (!readyForUpgrade) {
      return null
    }

    /* The upgrade can't be self-serviced because users
     * can't change `user_settings_override_yaml` themselves.
     * We warn the user in `DeploymentVersionUpgradeModal#renderSelfServiceUpgradeErrors`
     */
    if (hasSecurityRealmSettingOverrides({ plan: currentPendingPlan })) {
      return null
    }

    // the deployment didn't have any security realm settings at all — no review necessary
    if (!hasSecurityRealmSettings({ plan: pendingPlanUponMount })) {
      return this.renderUpgradeConfirmationModal({ showRestartText: false })
    }

    const userSettingsReviewEditors = this.renderReviewYamlSettings()

    // if there are any 'xpack.security.authc.realms.*' the user should fix the settings
    return (
      <EuiOverlayMask>
        <EuiModal onClose={onClose} className='reviewYamlSettingsModal'>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='review-yaml-settings.title'
                defaultMessage='Update security realm settings'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <EuiText size='s'>
              <FormattedMessage
                id='review-yaml-settings.description'
                defaultMessage='The realm settings have changed in version 7.0. The {type} should now be a part of the configuration key.'
                values={{
                  type: <code>type</code>,
                }}
              />
            </EuiText>

            <EuiSpacer size='m' />

            <EuiText size='s'>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <div>
                    <FormattedMessage
                      id='review-yaml-settings.settings-were'
                      defaultMessage='For example, if your setting was:'
                    />

                    <EuiSpacer size='s' />

                    <CuiCodeBlock language='yaml'>
                      {`realms:
  my-ldap:
    type: ldap
    …`}
                    </CuiCodeBlock>
                  </div>
                </EuiFlexItem>

                <EuiFlexItem>
                  <div>
                    <FormattedMessage
                      id='review-yaml-settings.settings-should-be'
                      defaultMessage='You should change it to:'
                    />

                    <EuiSpacer size='s' />

                    <CuiCodeBlock language='yaml'>
                      {`realms:
  ldap:
    my-ldap:
      …
`}
                    </CuiCodeBlock>
                  </div>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiText>

            <EuiSpacer size='m' />

            {userSettingsReviewEditors}

            {saveClusterPlanStatus.error && (
              <Fragment>
                <EuiSpacer size='m' />

                <CuiAlert type='error'>{saveClusterPlanStatus.error}</CuiAlert>
              </Fragment>
            )}
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButton fill={true} onClick={onSave}>
              <FormattedMessage
                id='review-yaml-settings.button'
                defaultMessage='Update settings and confirm upgrade'
              />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderReviewYamlSettings(): ReactNode {
    return flatMap(esNodeTypes, this.renderYamlSettingsEditorOfType)
  }

  renderYamlSettingsEditorOfType = (nodeType: 'master' | 'data') => {
    const { deploymentUpdateRequest } = this.props

    const plan = getEsPlan({ deployment: deploymentUpdateRequest })!

    const topologiesByType = categorizeTopologies(plan.cluster_topology)

    const esNodes = topologiesByType[nodeType]
    const enabledEsNodes = esNodes.filter(isEnabledConfiguration)

    const settings = enabledEsNodes.map((esNode) =>
      this.renderYamlSettingsEditor(nodeType, esNode, plan.cluster_topology.indexOf(esNode)),
    )

    return settings
  }

  renderYamlSettingsEditor(
    nodeType: 'master' | 'data',
    esNode: ElasticsearchClusterTopologyElement,
    esNodeIndex: number,
  ): ReactNode {
    const { pendingPlanUponMount } = this.state

    const hadSecurityRealmSettings = hasSecurityRealmSettings({
      plan: pendingPlanUponMount,
      esNodeIndex,
    })

    // no settings worth reviewing for this one so we can skip it here
    if (!hadSecurityRealmSettings) {
      return null
    }

    const settingsString = get(esNode, esUserSettingsPath, null)

    // if the user has 'xpack.security.authc.realms' `user_settings_yaml`
    // show the dialog and explain how to update the settings
    return (
      <ReviewYamlSettingsEditor
        data-test-id={`yaml-editor-${nodeType}`}
        key={`yaml-${nodeType}-${esNodeIndex}`}
        id={esNode.instance_configuration_id!}
        index={String(esNodeIndex)}
        nodeType={nodeType}
        value={settingsString}
        onChange={(value) => this.onChange([String(esNodeIndex), ...esUserSettingsPath], value)}
      />
    )
  }

  renderUpgradeConfirmationModal({ showRestartText }: { showRestartText: boolean }) {
    const { onSave, onClose } = this.props

    return (
      <EuiOverlayMask>
        <EuiConfirmModal
          title={
            <FormattedMessage
              id='upgradable-deployment-version.confirm-to-perform-major-version-upgrade'
              defaultMessage='Upgrade this deployment?'
            />
          }
          cancelButtonText={
            <FormattedMessage
              id='upgradable-deployment-version.confirm-to-perform-major-version-upgrade-full-restart-cancel'
              defaultMessage='Cancel upgrade'
            />
          }
          confirmButtonText={
            <FormattedMessage
              id='upgradable-deployment-version.confirm-to-perform-major-version-upgrade-full-restart-confirm'
              defaultMessage='Confirm upgrade'
            />
          }
          onCancel={onClose}
          onConfirm={onSave}
        >
          {showRestartText && (
            <FormattedMessage
              id='upgradable-deployment-version.confirm-to-perform-major-version-upgrade-full-restart'
              defaultMessage='To upgrade to a major version, the deployment goes through a full restart and is not accessible during this time.'
            />
          )}
        </EuiConfirmModal>
      </EuiOverlayMask>
    )
  }

  onChange(path, value) {
    const { updatePlan } = this.props
    const updatePath = [`cluster_topology`, ...path]

    if (isValidYaml(value)) {
      updatePlan(updatePath, value)
    }
  }
}

export function hasSecurityRealmSettingOverrides({
  plan,
}: {
  plan: ElasticsearchClusterPlan
}): boolean {
  const yamlOverrides = hasSecurityRealmSettings({
    plan,
    settingsPath: esUserSettingsOverridePath,
  })

  const jsonOverrides = hasSecurityRealmSettings({
    plan,
    settingsPath: esUserSettingsOverrideJsonPath,
    settingIsYaml: false,
  })

  return yamlOverrides || jsonOverrides
}

function hasSecurityRealmSettings({
  plan,
  settingsPath = esUserSettingsPath,
  settingIsYaml = true,
  esNodeIndex = null,
}: {
  plan: ElasticsearchClusterPlan
  settingsPath?: string[]
  settingIsYaml?: boolean
  esNodeIndex?: number | null
}): boolean {
  const topologiesByType = categorizeTopologies(plan.cluster_topology)

  for (const nodeType of esNodeTypes) {
    for (const nodeConfiguration of topologiesByType[nodeType]) {
      if (esNodeIndex && esNodeIndex !== plan.cluster_topology.indexOf(nodeConfiguration)) {
        continue
      }

      if (!isEnabledConfiguration(nodeConfiguration)) {
        continue
      }

      const userSettings = get(nodeConfiguration, settingsPath, null)
      const hasSecuritySetting = settingIsYaml
        ? hasUserSetting(userSettings, 'xpack.security.authc.realms')
        : hasUserSettingJson(userSettings, 'xpack.security.authc.realms')

      if (hasSecuritySetting) {
        return true
      }
    }
  }

  return false
}

export function needsYamlSettingsReview({
  version,
  plan,
}: {
  version: string | null
  plan: ElasticsearchClusterPlan
}) {
  if (!version) {
    return false
  }

  if (lt(version, `6.7.0`)) {
    return false
  }

  /* The upgrade can't be self-serviced because users
   * can't change `user_settings_override_yaml` themselves.
   * We warn the user in `DeploymentVersionUpgradeModal#renderSelfServiceUpgradeErrors`
   */
  if (hasSecurityRealmSettingOverrides({ plan })) {
    return false
  }

  return hasSecurityRealmSettings({ plan })
}
