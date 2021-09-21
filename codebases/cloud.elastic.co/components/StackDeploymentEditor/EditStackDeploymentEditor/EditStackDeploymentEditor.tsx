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

import { cloneDeep } from 'lodash'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiCallOut, EuiLink, EuiSpacer } from '@elastic/eui'

import { CuiTimeAgo } from '../../../cui'

import EditClusterFormBased, {
  ConsumerProps as EditClusterFormBasedProps,
} from './EditClusterFormBased'

import { StackConfigurationChangeId } from '../../StackDeploymentConfigurationChange'

import {
  createUpdateRequestFromGetResponse,
  getPlanInfo,
  getPlanAttemptId,
  getVersion,
  hasHealthyResourcePlan,
  PlanState,
  enrichDeploymentFromTemplate,
} from '../../../lib/stackDeployments'

import { mergeDeep } from '../../../lib/immutability-helpers'
import { DeepPartial } from '../../../lib/ts-essentials'

import { Props as EditClusterFormProps } from './EditClusterForm'

import { WithStackDeploymentRouteParamsProps } from '../routing'
import { EditFlowConsumerProps } from '../types'

import {
  Region,
  AsyncRequestState,
  StackDeploymentUpdateRequest,
  PluginDescription,
} from '../../../types'

import { StackVersionConfig, InstanceConfiguration } from '../../../lib/api/v1/types'

type ContainerProps = {
  convertLegacyPlans: boolean
  instanceConfigurations: InstanceConfiguration[]
  esVersions?: StackVersionConfig[] | null
  esVersionsRequest: AsyncRequestState
  fetchNodeConfigurationsRequest: AsyncRequestState
  hideAdvancedEdit: boolean
  hideConfigChangeStrategy: boolean
  inTrial: boolean
  pluginDescriptions: PluginDescription[]
  region: Region
  fetchVersion: (version: string, region: Region) => void
  fetchNodeConfigurations: (regionId: string) => void
  resetUpdateDeployment: (regionId: string, stackDeploymentId: string) => void
}

type Props = EditClusterFormProps &
  EditClusterFormBasedProps &
  WithStackDeploymentRouteParamsProps &
  EditFlowConsumerProps &
  ContainerProps

type State = {
  planState: PlanState
  editorState: StackDeploymentUpdateRequest
}

class EditStackDeploymentEditor extends Component<Props, State> {
  state: State = {
    planState: `last_success`,
    editorState: this.getInitialEditorState(),
  }

  render() {
    const { editorState } = this.state
    const { deploymentTemplate, deploymentUnderEdit } = editorState
    const version = getVersion({ deployment: deploymentUnderEdit })!

    return (
      <Fragment>
        {this.renderRecentFailureWarning()}

        <EditClusterFormBased
          {...this.props}
          deploymentTemplate={deploymentTemplate!}
          version={version}
          editorState={editorState}
          onChange={this.onChange}
        />
      </Fragment>
    )
  }

  renderRecentFailureWarning() {
    const { editorState } = this.state
    const { deploymentUnderEdit } = editorState
    const [esResource] = deploymentUnderEdit.resources.elasticsearch

    const healthyEsPlan = hasHealthyResourcePlan({ resource: esResource })

    if (healthyEsPlan) {
      return null
    }

    const callOutProps = this.getRecentFailureWarningProps()

    if (callOutProps === null) {
      return null
    }

    return (
      <Fragment>
        <EuiCallOut {...callOutProps} />
        <EuiSpacer size='m' />
      </Fragment>
    )
  }

  getRecentFailureWarningProps() {
    const { editorState, planState } = this.state
    const { deploymentUnderEdit } = editorState
    const [esResource] = deploymentUnderEdit.resources.elasticsearch

    const lastSuccess = getPlanInfo({ resource: esResource, state: `last_success` })
    const lastAttempt = getPlanInfo({ resource: esResource, state: `last_attempt` })

    if (!lastSuccess || !lastAttempt) {
      // Pointless to render a warning if there aren't two plans to switch between
      return null
    }

    const basedOnLastSuccess = planState === `last_success`

    if (basedOnLastSuccess) {
      const lastSuccessId = getPlanAttemptId({ resource: esResource, planAttempt: lastSuccess })

      const lastSuccessTime = (
        <CuiTimeAgo
          date={lastSuccess.attempt_end_time || lastSuccess.attempt_start_time}
          longTime={true}
          shouldCapitalize={false}
        />
      )

      return {
        color: `primary` as const,
        iconType: `check`,
        title: (
          <FormattedMessage
            id='edit-stack-deployment-editor.changes-based-on-last-success'
            defaultMessage='You are making changes based on the last successful configuration change — {lastSuccessId} — applied {lastSuccessTime}. {switchToLastAttempt}'
            values={{
              lastSuccessId: (
                <StackConfigurationChangeId
                  color='hollow'
                  kind='elasticsearch'
                  id={lastSuccessId}
                />
              ),
              lastSuccessTime,
              switchToLastAttempt: (
                <EuiLink onClick={() => this.resetBasedOnLastAttempt(lastAttempt)}>
                  <FormattedMessage
                    id='edit-stack-deployment-editor.switch-to-last-attempt'
                    defaultMessage='Switch to the last unsuccessful attempt?'
                  />
                </EuiLink>
              ),
            }}
          />
        ),
      }
    }

    const lastAttemptId = getPlanAttemptId({ resource: esResource, planAttempt: lastAttempt })

    const lastAttemptTime = (
      <CuiTimeAgo
        date={lastAttempt.attempt_end_time || lastAttempt.attempt_start_time}
        longTime={true}
        shouldCapitalize={false}
      />
    )

    return {
      color: `danger` as const,
      iconType: `alert`,
      title: (
        <FormattedMessage
          id='edit-stack-deployment-editor.changes-based-on-last-attempt'
          defaultMessage='Careful! You are making changes based on the last attempted configuration change — {lastAttemptId} — attempted {lastAttemptTime}. {switchToLastSuccess}'
          values={{
            lastAttemptId: (
              <StackConfigurationChangeId color='hollow' kind='elasticsearch' id={lastAttemptId} />
            ),
            lastAttemptTime,
            switchToLastSuccess: (
              <EuiLink onClick={() => this.resetBasedOnLastSuccess()}>
                <FormattedMessage
                  id='edit-stack-deployment-editor.switch-to-last-success'
                  defaultMessage='Switch to the last successful change?'
                />
              </EuiLink>
            ),
          }}
        />
      ),
    }
  }

  resetBasedOnLastAttempt = (lastAttempt) => {
    const editorState = this.getInitialEditorState(lastAttempt.plan)

    this.setState({ planState: `last_attempt`, editorState })
  }

  resetBasedOnLastSuccess = () => {
    const editorState = this.getInitialEditorState()

    this.setState({ planState: `last_success`, editorState })
  }

  getInitialEditorState(basedOnAttempt?): StackDeploymentUpdateRequest {
    const {
      stackDeployment,
      deploymentTemplate,
      regionId,
      stackDeploymentId,
      planAttemptUnderRetry,
    } = this.props

    /*
     * One or many underlying legacy components mutate the template object,
     * which is obviously wrong, but I failed to identify what the offender is.
     * Using a new clone each time this tree is mounted prevents various breakage
     * of things that depend on the deployment template response objects from coming
     * from just what what the API gives us.
     */
    const copiedDeploymentTemplate = cloneDeep(deploymentTemplate)

    const deployment = createUpdateRequestFromGetResponse({
      deployment: stackDeployment,
      deploymentTemplate: copiedDeploymentTemplate,
      planAttemptUnderRetry: basedOnAttempt || planAttemptUnderRetry,
    })

    // add template metadata into deployment to co-locate it for DeploymentInfrastructure
    if (copiedDeploymentTemplate?.deployment_template) {
      enrichDeploymentFromTemplate({
        deployment,
        deploymentTemplate: copiedDeploymentTemplate.deployment_template,
      })
    }

    return {
      regionId,
      id: stackDeploymentId!,
      deploymentTemplate: copiedDeploymentTemplate,
      deploymentUnderEdit: stackDeployment,
      planAttemptUnderRetry: basedOnAttempt || planAttemptUnderRetry,
      deployment,
    }
  }

  onChange = (
    changes: DeepPartial<StackDeploymentUpdateRequest>,
    { shallow = false }: { shallow?: boolean } = {},
  ) => {
    if (shallow) {
      // NOTE: when doing shallow changes, ensure you actually send us whole objects!
      return this.onChangeShallow(changes as Partial<StackDeploymentUpdateRequest>)
    }

    return this.onChangeDeep(changes)
  }

  onChangeShallow = (changes: Partial<StackDeploymentUpdateRequest>) => {
    const { editorState } = this.state

    const nextState: StackDeploymentUpdateRequest = {
      ...editorState,
      ...changes,
    }

    this.setState({ editorState: nextState })
  }

  onChangeDeep = (changes: DeepPartial<StackDeploymentUpdateRequest>) => {
    const { editorState } = this.state
    const nextState = mergeDeep(editorState, changes)
    this.setState({ editorState: nextState })
  }
}

export default EditStackDeploymentEditor
