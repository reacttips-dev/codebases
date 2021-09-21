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

const StopRoutingRequestsModal: FunctionComponent<Props> = ({ close, onConfirm, type }) => (
  <LogicSudoGate onCancel={close}>
    <EuiOverlayMask>
      <EuiConfirmModal
        title={
          <FormattedMessage
            id='stop-routing-requests.title'
            defaultMessage='Stop {type} routing'
            values={{ type }}
          />
        }
        onCancel={close}
        onConfirm={onConfirm}
        cancelButtonText={
          <FormattedMessage id='stop-routing-requests.cancel' defaultMessage='Cancel' />
        }
        confirmButtonText={
          <FormattedMessage id='stop-routing-requests.confirm' defaultMessage='Stop routing' />
        }
        defaultFocusedButton='confirm'
      >
        <FormattedMessage
          id='stop-routing-requests'
          defaultMessage='When you stop routing requests to the {type}, any existing requests finish processing but new requests get rerouted to other {type}s in the cluster. This puts the {type} into maintenance mode.'
          values={{ type }}
        />
      </EuiConfirmModal>
    </EuiOverlayMask>
  </LogicSudoGate>
)

export default StopRoutingRequestsModal
