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
import { head } from 'lodash'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormLabel,
  EuiLink,
  EuiSelect,
  EuiSelectOption,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'

import { CuiAlert, CuiButton, addToast } from '../../cui'

import HeapDumpsTable from './HeapDumpsTable'

import { getDeploymentTopologyInstances } from '../../lib/stackDeployments'
import { getSliderPrettyName } from '../../lib/sliders'

import { HeapDump } from '../../types/heapDump'
import {
  StackDeployment,
  AsyncRequestState,
  SliderInstanceType,
  InstanceSummary,
} from '../../types'

export interface Props {
  deployment: StackDeployment
  fetchHeapDumps: (deployment: StackDeployment) => void
  fetchHeapDumpsRequest: AsyncRequestState
  getHeapDumpDownloadUrl: (resourceKind: string, refId: string, instanceId: string) => string
  heapDumps?: HeapDump[]
  startHeapDumpCapture: (
    deployment: StackDeployment,
    resourceKind: SliderInstanceType,
    refId: string,
    instanceId: string,
  ) => Promise<void>
  startHeapDumpCaptureRequest: (refId: string, instanceId: string) => AsyncRequestState
  showSupportInstructions?: boolean
}

interface State {
  selectedSliderInstanceType: SliderInstanceType
  selectedInstance: InstanceSummary | undefined
}

export class ManageHeapDumps extends Component<Props, State> {
  state: State = this.getInitialState()

  getInitialState(): State {
    const sliderInstanceType = 'elasticsearch'

    const instances = getDeploymentTopologyInstances({
      deployment: this.props.deployment,
      sliderInstanceType,
    })

    return {
      selectedSliderInstanceType: sliderInstanceType,
      selectedInstance: head(instances),
    }
  }

  render() {
    return (
      <Fragment>
        {this.renderTopSection()}
        {this.renderTable()}
      </Fragment>
    )
  }

  renderTopSection() {
    const { showSupportInstructions } = this.props

    return (
      <EuiFlexGroup gutterSize='m' justifyContent='spaceBetween'>
        <EuiFlexItem>
          <EuiText>
            <strong>
              <FormattedMessage
                id='heapDumps.capture-subtitle'
                defaultMessage='Capture on-demand heap dumps'
              />
            </strong>

            <EuiSpacer size='s' />

            <FormattedMessage
              id='heapDumps.capture-description'
              defaultMessage='Capture an on-demand heap dump to see how your JVM memory is being used. For each instance, only one capture can exist at a time; a new capture overwrites the old. Note that the JVM is paused and unresponsive during a capture.'
            />

            {showSupportInstructions && (
              <FormattedMessage
                id='heapDumps.capture-description-support'
                data-test-id='heapDumps.supportInstructions'
                defaultMessage=" Consult with the deployment owner before proceeding and follow Elastic's {dataPolicy} when handling heap dumps."
                values={{
                  dataPolicy: (
                    <EuiLink
                      href='https://wiki.elastic.co/display/CC/Handling+Customer+Data'
                      target='_blank'
                    >
                      <FormattedMessage
                        id='heapDumps.capture-description-support-data-policy'
                        defaultMessage='data policy'
                      />
                    </EuiLink>
                  ),
                }}
              />
            )}
          </EuiText>
        </EuiFlexItem>

        <EuiFlexItem grow={false}>{this.renderStartCaptureSection()}</EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  renderStartCaptureSection() {
    const { startHeapDumpCaptureRequest } = this.props
    const { selectedSliderInstanceType, selectedInstance } = this.state

    const instances = getDeploymentTopologyInstances({
      deployment: this.props.deployment,
      sliderInstanceType: selectedSliderInstanceType,
    })

    if (instances.length === 0 || !selectedInstance) {
      return null
    }

    const options: EuiSelectOption[] = instances.map((instanceInfo) => ({
      text: instanceInfo.instance.instance_name,
      value: instanceInfo.instance.instance_name,
    }))

    const startInstanceHeapDumpCaptureRequest = startHeapDumpCaptureRequest(
      selectedInstance.resource.ref_id,
      selectedInstance.instance.instance_name,
    )

    return (
      <EuiFlexGroup gutterSize='m' style={{ width: '25rem' }} direction='column'>
        <EuiFlexItem grow={false}>
          <EuiFormLabel>
            <FormattedMessage id='heapDumps.capture-instance-label' defaultMessage='Instance' />
          </EuiFormLabel>

          <EuiSpacer size='xs' />

          <EuiSelect
            options={options}
            value={selectedInstance.instance.instance_name}
            onChange={(e) => {
              const newSelectedInstance = instances.find(
                (instanceInfo) =>
                  instanceInfo.instance.instance_name === (e.target.value as string),
              )

              this.setState({ selectedInstance: newSelectedInstance })
            }}
          />
        </EuiFlexItem>

        <EuiFlexItem grow={false}>
          <CuiButton
            color='primary'
            spin={startInstanceHeapDumpCaptureRequest.inProgress}
            onClick={() =>
              this.startCapture(
                selectedSliderInstanceType,
                selectedInstance.resource.ref_id,
                selectedInstance.instance.instance_name,
              )
            }
            requiresSudo={true}
            confirm={true}
            confirmModalProps={{
              title: (
                <FormattedMessage
                  id='heapDumps.start-capture-confirmation-title'
                  defaultMessage='Take a heap dump capture of {sliderName} {instanceId}?'
                  values={{
                    sliderName: (
                      <FormattedMessage
                        {...getSliderPrettyName({ sliderInstanceType: selectedSliderInstanceType })}
                      />
                    ),
                    instanceId: selectedInstance.instance.instance_name,
                  }}
                />
              ),
              confirm: (
                <FormattedMessage
                  id='heapDumps.start-capture-confirmation-button'
                  defaultMessage='Start capture'
                />
              ),
            }}
          >
            <FormattedMessage id='heapDumps.start-capture-button' defaultMessage='Start capture' />
          </CuiButton>
        </EuiFlexItem>

        {startInstanceHeapDumpCaptureRequest.error && (
          <EuiFlexItem grow={false}>
            <Fragment>
              <CuiAlert type='error'>{startInstanceHeapDumpCaptureRequest.error}</CuiAlert>
            </Fragment>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }

  renderTable() {
    const { deployment, heapDumps, fetchHeapDumps, getHeapDumpDownloadUrl } = this.props

    return (
      <Fragment>
        <EuiSpacer size='xxl' />

        <EuiTitle>
          <h2>
            <FormattedMessage id='heapDumps.tableTitle' defaultMessage='Heap dump captures' />
          </h2>
        </EuiTitle>

        <EuiSpacer size='m' />

        <HeapDumpsTable
          heapDumps={heapDumps}
          fetchHeapDumps={() => fetchHeapDumps(deployment)}
          getHeapDumpDownloadUrl={getHeapDumpDownloadUrl}
        />
      </Fragment>
    )
  }

  startCapture(resourceKind, refId, instanceId) {
    const { deployment, fetchHeapDumps, startHeapDumpCapture } = this.props

    startHeapDumpCapture(deployment, resourceKind, refId, instanceId)
      .then(() => fetchHeapDumps(deployment))
      .then(startHeapDumpCaptureSuccessToast, startHeapDumpCaptureFailToast)
  }
}

export default ManageHeapDumps

export const startHeapDumpCaptureSuccessToast = () =>
  addToast({
    id: 'startHeapDumpCaptureSuccess',
    family: 'heapDumps.start-capture.success',
    iconType: 'inspect',
    title: (
      <FormattedMessage id='heapDumps.start-capture.title' defaultMessage='Heap dump capture' />
    ),
    text: (
      <FormattedMessage
        id='heapDumps.start-capture.success-text'
        defaultMessage='Started capturing heap dump.'
      />
    ),
    color: 'success',
  })

export const startHeapDumpCaptureFailToast = () =>
  addToast({
    id: 'startHeapDumpCaptureFail',
    family: 'heapDumps.start-capture.fail',
    iconType: 'inspect',
    title: (
      <FormattedMessage id='heapDumps.start-capture.title' defaultMessage='Heap dump capture' />
    ),
    text: (
      <FormattedMessage
        id='heapDumps.start-capture.fail-text'
        defaultMessage='Heap dump capture failed to start.'
      />
    ),
    color: 'danger',
  })
