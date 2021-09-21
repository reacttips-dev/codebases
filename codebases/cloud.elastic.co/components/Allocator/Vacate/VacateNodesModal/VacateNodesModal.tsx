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
import { FormattedMessage } from 'react-intl'

import {
  cloneDeep,
  compact,
  find,
  flatten,
  get,
  isEqual,
  noop,
  pick,
  set,
  uniqWith,
  values,
} from 'lodash'

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormHelpText,
  EuiFormLabel,
  EuiLink,
  EuiLoadingSpinner,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiSelect,
  EuiSpacer,
  EuiTextColor,
} from '@elastic/eui'

import { CuiAlert } from '../../../../cui'

import SpinButton from '../../../SpinButton'

import VacateOptions from '../VacateOptions'

import { getSupportedSliderInstanceTypes } from '../../../../lib/sliders'

import {
  VacateAllocatorOptions,
  VacateAllocatorValidateOptions,
} from '../../../../actions/allocators'

import lightTheme from '../../../../lib/theme/light'

import { Allocator, AllocatorInstance, AsyncRequestState, RegionId } from '../../../../types'

import {
  MoveClustersCommandResponse,
  MoveClustersRequest,
  MoveElasticsearchClusterConfiguration,
  MoveElasticsearchClusterDetails,
} from '../../../../lib/api/v1/types'

const { euiBreakpoints } = lightTheme
const indeterminate = `__indeterminate__`

type RequiredAllocatorInstanceProps = 'kind' | 'clusterId'
type SlimAllocatorInstance = { [T in RequiredAllocatorInstanceProps]: AllocatorInstance[T] }

export type Node = AllocatorInstance | SlimAllocatorInstance

type Props = {
  allocator: Allocator
  nodes: Node[]
  close: (params?: { clearSelection: boolean }) => void
  onAfterVacate?: (params: VacateAllocatorOptions) => void
  vacateAllocatorValidate: (params: VacateAllocatorValidateOptions) => void
  resetVacateAllocatorValidate: (regionId: RegionId, id: string) => void
  vacateAllocator: (params: VacateAllocatorOptions) => Promise<MoveClustersCommandResponse>
  vacateAllocatorRequest: AsyncRequestState
  vacateAllocatorValidateResult: MoveClustersCommandResponse | undefined
  vacateAllocatorValidateRequest: AsyncRequestState
}

type DefaultProps = {
  onAfterVacate: (params: VacateAllocatorOptions) => void
}

type State = {
  initialPlans: MoveClustersRequest | null
  plans: MoveClustersRequest | null
  selectedPlan: MoveElasticsearchClusterConfiguration | null
  showingSettings: boolean
}

class VacateNodesModal extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps = {
    onAfterVacate: noop,
  }

  state: State = {
    initialPlans: null,
    plans: null,
    selectedPlan: null,
    showingSettings: false,
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State): Partial<State> | null {
    if (prevState.initialPlans === null) {
      return getInitialPlans(nextProps)
    }

    return null
  }

  componentDidMount() {
    this.fetchDefaults()
  }

  componentWillUnmount() {
    const {
      allocator: { regionId, id },
      resetVacateAllocatorValidate,
    } = this.props

    resetVacateAllocatorValidate(regionId, id)
  }

  render() {
    const { close, vacateAllocatorRequest } = this.props

    const { initialPlans } = this.state

    return (
      <EuiOverlayMask>
        <EuiModal
          onClose={() => close({ clearSelection: false })}
          style={{ width: euiBreakpoints.m }}
        >
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='allocator-vacate.vacate-settings'
                defaultMessage='Move settings'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>{this.renderContent()}</EuiModalBody>

          <EuiModalFooter>
            {!this.hasPlanDefaults() && (
              <EuiLink color='warning' onClick={this.resetToPlanDefaults}>
                <FormattedMessage
                  id='allocator-vacate.reset-recommended-defaults'
                  defaultMessage='Reset to recommended defaults'
                />
              </EuiLink>
            )}

            <EuiButtonEmpty onClick={() => close({ clearSelection: false })}>
              <FormattedMessage id='allocator-vacate.cancel-vacate' defaultMessage='Cancel' />
            </EuiButtonEmpty>

            <SpinButton
              fill={true}
              spin={vacateAllocatorRequest.inProgress}
              disabled={initialPlans === null}
              data-test-id='move-node-confirm'
              onClick={this.vacate}
            >
              <FormattedMessage id='allocator-vacate.move-nodes' defaultMessage='Move nodes' />
            </SpinButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderContent() {
    const { vacateAllocatorValidateRequest, vacateAllocatorRequest, nodes } = this.props

    const { initialPlans } = this.state

    if (vacateAllocatorValidateRequest.error) {
      return <CuiAlert type='error'>{vacateAllocatorValidateRequest.error}</CuiAlert>
    }

    const clusters = getClusters(nodes)
    const clusterCount = clusters.length

    if (initialPlans === null) {
      return (
        <EuiFlexGroup gutterSize='s' alignItems='center'>
          <EuiFlexItem grow={false}>
            <EuiLoadingSpinner size='m' />
          </EuiFlexItem>

          <EuiFlexItem grow={false}>
            <FormattedMessage
              id='allocator-vacate.vacate-validating'
              defaultMessage='Please wait while we determine the most sensible defaults to move the selected { clusterCount, plural, one {cluster} other {clusters} } …'
              values={{
                clusterCount,
              }}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    }

    return (
      <Fragment>
        {this.renderEditor()}

        {vacateAllocatorRequest.error && (
          <CuiAlert type='error'>{vacateAllocatorRequest.error}</CuiAlert>
        )}
      </Fragment>
    )
  }

  renderEditor() {
    const allPlans = this.getAllPlans()
    const singlePlan = allPlans.length === 1

    const description = singlePlan ? (
      <FormattedMessage
        id='allocator-vacate.single-vacate-customization-description'
        defaultMessage='The default settings for moving nodes in the selected cluster are calculated based on their status and the cluster topology.'
      />
    ) : (
      <FormattedMessage
        id='allocator-vacate.multiple-vacate-customization-description'
        defaultMessage='The default settings for moving nodes in the selected clusters are calculated based on their status and cluster topologies.'
      />
    )

    return (
      <Fragment>
        {description}

        <EuiSpacer size='m' />

        {this.renderVacateOptions()}
      </Fragment>
    )
  }

  renderVacateOptions() {
    const {
      allocator: { regionId, id: allocatorId },
    } = this.props

    const { showingSettings, selectedPlan } = this.state

    const allPlans = this.getAllPlans()
    const manyPlans = allPlans.length > 1

    if (!showingSettings) {
      return (
        <Fragment>
          <EuiButton onClick={this.showSettings}>
            <FormattedMessage
              id='allocator-vacate.show-settings'
              defaultMessage='Customize settings …'
            />
          </EuiButton>

          {manyPlans && (
            <EuiFormHelpText>
              <EuiTextColor color='subdued'>
                <FormattedMessage
                  id='allocator-vacate.many-plans-warning-when-not-showing-options'
                  defaultMessage='Changes you make will impact every cluster.'
                />
              </EuiTextColor>
            </EuiFormHelpText>
          )}
        </Fragment>
      )
    }

    const getOption = selectedPlan ? this.getOptionForSelectedPlan : this.getOptionAcrossPlans

    const setOption = selectedPlan ? this.setOptionForSelectedPlan : this.setOptionAcrossPlans

    return (
      <Fragment>
        <EuiFlexGroup gutterSize='s' alignItems='flexEnd'>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={this.hideSettings}>
              <FormattedMessage
                id='allocator-vacate.hide-settings'
                defaultMessage='Hide settings'
              />
            </EuiButton>
          </EuiFlexItem>

          {selectedPlan && <EuiFlexItem grow={false}>{this.renderClusterDropdown()}</EuiFlexItem>}
        </EuiFlexGroup>

        {manyPlans && (
          <EuiFormHelpText>
            <EuiTextColor color='warning'>
              <FormattedMessage
                id='allocator-vacate.many-plans-warning-after-showing-options'
                defaultMessage='You are making changes to { currentTarget }. { changeTarget }'
                values={{
                  currentTarget: selectedPlan ? (
                    <FormattedMessage
                      id='allocator-vacate.impact-single-cluster'
                      defaultMessage='cluster { clusterId }'
                      values={{
                        clusterId: selectedPlan.cluster_ids[0],
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id='allocator-vacate.impact-every-cluster'
                      defaultMessage='every cluster'
                    />
                  ),
                  changeTarget: selectedPlan ? (
                    <EuiLink onClick={this.targetEveryCluster}>
                      <FormattedMessage
                        id='allocator-vacate.target-every-cluster'
                        defaultMessage='Make changes to every cluster?'
                      />
                    </EuiLink>
                  ) : (
                    <EuiLink onClick={this.targetSingleCluster}>
                      <FormattedMessage
                        id='allocator-vacate.target-single-cluster'
                        defaultMessage='Make changes to a single cluster?'
                      />
                    </EuiLink>
                  ),
                }}
              />
            </EuiTextColor>
          </EuiFormHelpText>
        )}

        <EuiSpacer size='m' />

        <VacateOptions
          regionId={regionId}
          allocatorId={allocatorId}
          getOption={getOption}
          setOption={setOption}
        />
      </Fragment>
    )
  }

  renderClusterDropdown() {
    const { selectedPlan } = this.state

    const allPlans = this.getAllPlans()
    const selectedPlanIndex = allPlans.indexOf(selectedPlan!)

    const clusterPlanOptions = [
      { text: ``, value: -1 },

      ...allPlans.map((plan, index) => ({
        text: plan.cluster_ids[0],
        value: index,
      })),
    ]

    return (
      <Fragment>
        <EuiFormLabel>
          <FormattedMessage
            id='allocator-vacate.cluster-dropdown'
            defaultMessage='Choose a cluster'
          />
        </EuiFormLabel>

        <EuiSelect
          options={clusterPlanOptions}
          onChange={(e) => {
            const index = e.target.value
            const selectedPlan = allPlans[index]
            this.setState({ selectedPlan })
          }}
          value={selectedPlanIndex}
        />
      </Fragment>
    )
  }

  fetchDefaults() {
    const { allocator, vacateAllocatorValidate } = this.props

    const { regionId, id: allocatorId } = allocator

    const allocatorDown = this.isAllocatorDown()

    vacateAllocatorValidate({
      regionId,
      allocatorId,
      allocatorDown,
    })
  }

  hasPlanDefaults = () => {
    const { plans, initialPlans } = this.state

    return isEqual(plans, initialPlans)
  }

  resetToPlanDefaults = () => {
    const { initialPlans, selectedPlan } = this.state
    const plans = cloneDeep(initialPlans)
    const allOldPlans = this.getAllPlans()
    const nextSelectedPlan = getSelectedPlan()

    this.setState({
      plans,
      selectedPlan: nextSelectedPlan,
    })

    function getSelectedPlan() {
      if (!selectedPlan) {
        return null
      }

      const allNewPlans = flatten(compact(values(plans)))
      const selectedPlanIndex = allOldPlans.indexOf(selectedPlan)
      const nextSelectedPlan = allNewPlans[selectedPlanIndex]

      return nextSelectedPlan
    }
  }

  showSettings = () => {
    this.setState({ showingSettings: true })
  }

  hideSettings = () => {
    this.setState({
      showingSettings: false,
      selectedPlan: null,
    })
  }

  targetSingleCluster = () => {
    const allPlans = this.getAllPlans()
    const [firstPlan] = allPlans

    this.setSelectedPlan(firstPlan)
  }

  targetEveryCluster = () => {
    this.setSelectedPlan(null)
  }

  setSelectedPlan = (plan) => {
    this.setState({ selectedPlan: plan })
  }

  getAllPlans() {
    const { plans } = this.state

    return flatten(compact(values(plans)))
  }

  getOptionAcrossPlans = (path) => {
    const allPlans = this.getAllPlans()
    const allSettings = allPlans.map((plan) => get(plan.plan_override, path))
    const [firstSetting] = allSettings
    const consistent = allSettings.every((value) => isEqual(value, firstSetting))

    if (consistent) {
      return firstSetting
    }

    return indeterminate
  }

  setOptionAcrossPlans = (path, value) => {
    const { plans } = this.state
    const allPlans = this.getAllPlans()

    allPlans.forEach((plan) => {
      set(plan.plan_override!, path, value)
    })

    this.setState({ plans })
  }

  getOptionForSelectedPlan = (path) => {
    const { selectedPlan } = this.state

    return get(selectedPlan!.plan_override, path)
  }

  setOptionForSelectedPlan = (path, value) => {
    const { selectedPlan } = this.state

    set(selectedPlan!.plan_override!, path, value)

    this.setState({ selectedPlan })
  }

  vacate = () => {
    const {
      allocator: { regionId, id: allocatorId },
      vacateAllocator,
      close,
      onAfterVacate,
    } = this.props

    const allocatorDown = this.isAllocatorDown()

    const { plans } = this.state

    const settings: VacateAllocatorOptions = {
      regionId,
      allocatorId,
      allocatorDown,
      payload: plans!,
    }

    return vacateAllocator(settings).then(() => {
      onAfterVacate(settings)
      return close({ clearSelection: true })
    })
  }

  isAllocatorDown() {
    const { allocator } = this.props
    const { connected } = allocator

    // down == disconnected from ZooKeeper, sufficient per @marclop
    const allocatorDown = !connected

    return allocatorDown
  }
}

export default VacateNodesModal

function getInitialPlans(props: Props): Partial<State> | null {
  const { vacateAllocatorValidateResult, nodes } = props

  if (!vacateAllocatorValidateResult) {
    return null
  }

  const { moves } = vacateAllocatorValidateResult

  const clusters = getClusters(nodes)
  const initialPlans = getSupportedSliderInstanceTypes().reduce(
    (accum, sliderInstanceType) => ({ ...accum, [`${sliderInstanceType}_clusters`]: [] }),
    {},
  )

  clusters.forEach(({ kind, clusterId }) => {
    const moveKey = `${kind}_clusters`
    const movesByKind = moves[moveKey]
    const moveForCluster = find(movesByKind, {
      cluster_id: clusterId,
    }) as MoveElasticsearchClusterDetails

    if (!moveForCluster) {
      return
    }

    const plan_override = moveForCluster.calculated_plan

    // so that the preferred allocators checkbox is off by default
    set(plan_override!, [`plan_configuration`, `preferred_allocators`], undefined)

    initialPlans[moveKey].push({
      cluster_ids: [clusterId],
      plan_override,
    })
  })

  const plans = cloneDeep(initialPlans)

  return {
    initialPlans,
    plans,
  }
}

function getClusters(nodes: Node[]) {
  return uniqWith(nodes, areInSameCluster)
}

function areInSameCluster(leftNode: Node, rightNode: Node) {
  return isEqual(pick(leftNode, [`kind`, `clusterId`]), pick(rightNode, [`kind`, `clusterId`]))
}
