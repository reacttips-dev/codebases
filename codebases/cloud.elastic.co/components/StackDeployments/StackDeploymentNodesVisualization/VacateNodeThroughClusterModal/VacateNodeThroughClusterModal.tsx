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

import { get, set, isEqual, cloneDeep } from 'lodash'

import React, { FunctionComponent, Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSpacer,
} from '@elastic/eui'

import { CuiAlert, CuiButton } from '../../../../cui'

import VacateOptions from '../../../Allocator/Vacate/VacateOptions'
import LogicSudoGate from '../../../LogicSudoGate'

import { replaceIn } from '../../../../lib/immutability-helpers'

import lightTheme from '../../../../lib/theme/light'

import { AsyncRequestState } from '../../../../types'

import {
  ElasticsearchResourceInfo,
  ClusterInstanceInfo,
  TransientElasticsearchPlanConfiguration,
} from '../../../../lib/api/v1/types'

export type Props = {
  close: () => void
  instance: ClusterInstanceInfo
  onAfterVacate: () => void
  resource: ElasticsearchResourceInfo
  vacateEsCluster: (options: { payload?: TransientElasticsearchPlanConfiguration }) => Promise<any>
  vacateEsClusterRequest: AsyncRequestState
  vacateEsClusterValidate: (options: { instancesDown?: boolean }) => Promise<any>
  vacateEsClusterValidateRequest: AsyncRequestState
  vacateEsClusterValidateResult?: TransientElasticsearchPlanConfiguration
}

type State = {
  initialPlan: TransientElasticsearchPlanConfiguration | null
  plan: TransientElasticsearchPlanConfiguration | null
  showingSettings: boolean
}

const { euiBreakpoints } = lightTheme

const SudoGatedVacateNodeThroughClusterModal: FunctionComponent<Props> = (props) => (
  <LogicSudoGate onCancel={props.close}>
    <VacateNodeThroughClusterModal {...props} />
  </LogicSudoGate>
)

class VacateNodeThroughClusterModal extends Component<Props, State> {
  state: State = {
    initialPlan: null,
    plan: null,
    showingSettings: false,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    if (prevState.initialPlan === null) {
      return getInitialPlanState(nextProps)
    }

    return null
  }

  componentDidMount() {
    const { vacateEsClusterValidate, instance } = this.props

    vacateEsClusterValidate({ instancesDown: !instance.service_running })
  }

  render() {
    const { vacateEsClusterRequest, close } = this.props
    const { plan } = this.state

    return (
      <EuiOverlayMask>
        <EuiModal onClose={close} style={{ width: euiBreakpoints.m }}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='es-cluster-vacate-single-node-modal.vacate-settings'
                defaultMessage='Move settings'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <div data-test-id='vacate-cluster-modal-body'>{this.renderContent()}</div>
          </EuiModalBody>

          <EuiModalFooter>
            <div style={{ width: '100%' }}>
              <EuiFlexGroup gutterSize='s' alignItems='center' justifyContent='spaceBetween'>
                <EuiFlexItem grow={false}>
                  {!this.hasPlanDefaults() && (
                    <EuiLink color='warning' onClick={this.resetToPlanDefaults}>
                      <FormattedMessage
                        id='es-cluster-vacate-single-node-modal.reset-recommended-defaults'
                        defaultMessage='Reset to recommended defaults'
                      />
                    </EuiLink>
                  )}
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                  <div>
                    <EuiFlexGroup gutterSize='s' alignItems='center'>
                      <EuiFlexItem grow={false}>
                        <EuiButtonEmpty onClick={close}>
                          <FormattedMessage
                            id='es-cluster-vacate-single-node-modal.cancel-vacate'
                            defaultMessage='Cancel'
                          />
                        </EuiButtonEmpty>
                      </EuiFlexItem>

                      <EuiFlexItem grow={false}>
                        <CuiButton
                          data-test-id='move-nodes-button'
                          spin={vacateEsClusterRequest.inProgress}
                          fill={true}
                          disabled={plan === null}
                          onClick={this.moveNode}
                        >
                          <FormattedMessage
                            id='es-cluster-vacate-single-node-modal.move-nodes'
                            defaultMessage='Move nodes'
                          />
                        </CuiButton>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </div>
                </EuiFlexItem>
              </EuiFlexGroup>

              {vacateEsClusterRequest.error && (
                <Fragment>
                  <EuiSpacer size='m' />

                  <CuiAlert type='error'>{vacateEsClusterRequest.error}</CuiAlert>
                </Fragment>
              )}
            </div>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderContent() {
    const { vacateEsClusterValidateRequest } = this.props

    if (vacateEsClusterValidateRequest.error) {
      return (
        <div data-test-id='failed-vacate-cluster-validation'>
          <CuiAlert type='error'>{vacateEsClusterValidateRequest.error}</CuiAlert>
        </div>
      )
    }

    if (vacateEsClusterValidateRequest.inProgress) {
      return (
        <div data-test-id='vacate-cluster-validation-in-progress'>
          <EuiFlexGroup gutterSize='s' alignItems='center'>
            <EuiFlexItem grow={false}>
              <EuiLoadingSpinner size='m' />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <FormattedMessage
                id='es-cluster-vacate-single-node-modal.vacate-validating'
                defaultMessage='Please wait while we determine the most sensible defaults to move the selected node …'
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      )
    }

    return (
      <div data-test-id='vacate-cluster-content'>
        <FormattedMessage
          id='es-cluster-vacate-single-node-modal.single-vacate-customization-description'
          defaultMessage='The default settings for moving an Elasticsearch node are calculated based on its status and the cluster topology.'
        />

        <EuiSpacer size='m' />

        {this.renderVacateOptions()}
      </div>
    )
  }

  renderVacateOptions() {
    const { resource, instance } = this.props
    const { showingSettings } = this.state

    if (!showingSettings) {
      return (
        <div data-test-id='show-vacate-settings-button'>
          <EuiButton onClick={this.showSettings}>
            <FormattedMessage
              id='es-cluster-vacate-single-node-modal.show-settings'
              defaultMessage='Customize settings …'
            />
          </EuiButton>
        </div>
      )
    }

    return (
      <Fragment>
        <div data-test-id='hide-vacate-settings-button'>
          <EuiButton onClick={this.hideSettings}>
            <FormattedMessage
              id='es-cluster-vacate-single-node-modal.hide-settings'
              defaultMessage='Hide settings'
            />
          </EuiButton>
        </div>

        <EuiSpacer size='m' />

        <VacateOptions
          regionId={resource.region}
          allocatorId={instance.allocator_id!}
          getOption={this.getPlanSetting}
          setOption={this.setPlanSetting}
        />
      </Fragment>
    )
  }

  hasPlanDefaults = () => {
    const { plan, initialPlan } = this.state

    return isEqual(plan, initialPlan)
  }

  resetToPlanDefaults = () => {
    const { initialPlan } = this.state
    const plan = cloneDeep(initialPlan)

    this.setState({ plan })
  }

  showSettings = () => {
    this.setState({ showingSettings: true })
  }

  hideSettings = () => {
    this.setState({ showingSettings: false })
  }

  getPlanSetting = (path: string[]) => {
    const { plan } = this.state

    return get(plan!, path)
  }

  setPlanSetting = (path: string[], value) => {
    const { plan } = this.state
    const nextPlan = replaceIn(plan || {}, path, value)

    this.setState({ plan: nextPlan })
  }

  moveNode = () => {
    const { vacateEsCluster, onAfterVacate, close } = this.props
    const { plan } = this.state

    if (!plan) {
      return
    }

    vacateEsCluster({ payload: plan }).then(() => {
      onAfterVacate()
      return close()
    })
  }
}

export default SudoGatedVacateNodeThroughClusterModal

function getInitialPlanState(props: Props): Partial<State> | null {
  const { vacateEsClusterValidateResult } = props

  if (!vacateEsClusterValidateResult) {
    return null
  }

  const initialPlan = cloneDeep(vacateEsClusterValidateResult)

  // so that the preferred allocators checkbox is off by default
  set(initialPlan, [`plan_configuration`, `preferred_allocators`], undefined)

  return {
    initialPlan,
    plan: initialPlan,
  }
}
