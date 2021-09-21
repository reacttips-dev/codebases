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
  EuiButton,
  EuiButtonEmpty,
  EuiLoadingContent,
  EuiSpacer,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui'

import { CuiAlert } from '../../../../cui'

import VacateNodesModal from '../../../Allocator/Vacate/VacateNodesModal'
import LogicSudoGate from '../../../LogicSudoGate'

import lightTheme from '../../../../lib/theme/light'

import {
  Allocator,
  AnyResourceInfo,
  AsyncRequestState,
  SliderInstanceType,
} from '../../../../types'

import { ClusterInstanceInfo } from '../../../../lib/api/v1/types'

type Props = {
  resource: AnyResourceInfo
  instance: ClusterInstanceInfo
  kind: SliderInstanceType
  allocator?: Allocator
  fetchAllocator: () => Promise<any>
  fetchAllocatorRequest: AsyncRequestState
  close: () => void
  onAfterVacate: () => void
}

const { euiBreakpoints } = lightTheme

class VacateNodeThroughAllocatorModal extends Component<Props> {
  componentDidMount() {
    const { allocator, fetchAllocator } = this.props

    if (!allocator) {
      fetchAllocator()
    }
  }

  render() {
    const { close } = this.props

    return <LogicSudoGate onCancel={close}>{this.renderContent()}</LogicSudoGate>
  }

  renderContent() {
    const { allocator, resource, kind, close, onAfterVacate } = this.props

    if (!allocator) {
      return this.renderLoadingOverlay()
    }

    const clusterId = resource.id
    const nodes = [{ kind, clusterId }]

    return (
      <VacateNodesModal
        allocator={allocator}
        nodes={nodes}
        close={close}
        onAfterVacate={onAfterVacate}
      />
    )
  }

  renderLoadingOverlay() {
    const { fetchAllocatorRequest, close } = this.props

    return (
      <EuiOverlayMask>
        <EuiModal onClose={close} style={{ width: euiBreakpoints.m }}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              <FormattedMessage
                id='vacate-single-node-modal.vacate-settings'
                defaultMessage='Move settings'
              />
            </EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            {fetchAllocatorRequest.inProgress && <EuiLoadingContent />}

            {fetchAllocatorRequest.error && (
              <Fragment>
                <EuiSpacer size='m' />
                <CuiAlert type='error'>{fetchAllocatorRequest.error}</CuiAlert>
              </Fragment>
            )}
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButtonEmpty onClick={close}>
              <FormattedMessage
                id='vacate-single-node-modal.cancel-vacate'
                defaultMessage='Cancel'
              />
            </EuiButtonEmpty>

            <EuiButton fill={true} disabled={true}>
              <FormattedMessage
                id='vacate-single-node-modal.move-nodes'
                defaultMessage='Move nodes'
              />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }
}

export default VacateNodeThroughAllocatorModal
