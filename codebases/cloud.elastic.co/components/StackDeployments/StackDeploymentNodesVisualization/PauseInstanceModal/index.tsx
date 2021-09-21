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

import React, { FunctionComponent } from 'react'
import { EuiOverlayMask, EuiConfirmModal } from '@elastic/eui'
import { FormattedMessage } from 'react-intl'

import LogicSudoGate from '../../../LogicSudoGate'

interface Props {
  close: () => void
  onConfirm?: () => void
  type: string
}

const PauseInstanceModal: FunctionComponent<Props> = ({ close, onConfirm, type }) => (
  <LogicSudoGate onCancel={close}>
    <EuiOverlayMask>
      <EuiConfirmModal
        title={
          <FormattedMessage
            id='pause-instance-modal.title'
            defaultMessage='Pause {type}?'
            values={{ type }}
          />
        }
        onCancel={close}
        onConfirm={onConfirm}
        cancelButtonText={
          <FormattedMessage id='pause-instance-modal.cancel' defaultMessage='Cancel' />
        }
        confirmButtonText={
          <FormattedMessage id='pause-instance-modal.confirm' defaultMessage='Pause' />
        }
        defaultFocusedButton='confirm'
      >
        <FormattedMessage
          id='pause-instance-modal.content'
          defaultMessage='When you pause the cluster node, the node immediately halts all activity without completing existing requests. Pausing a node might be helpful if the node is unresponsive.'
        />
      </EuiConfirmModal>
    </EuiOverlayMask>
  </LogicSudoGate>
)

export default PauseInstanceModal
