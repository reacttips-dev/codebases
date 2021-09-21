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
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import {
  EuiButtonEmpty,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
} from '@elastic/eui'

import { CuiButton } from '../../cui'

import messages from './messages'

import { AsyncRequestState } from '../../types'

interface Props extends WrappedComponentProps {
  onCancel: () => void
  onConfirm: () => void
  keys: any[]
  revokeApiKeysRequest: AsyncRequestState
}

const RevokeKeyModal: FunctionComponent<Props> = (props) => {
  const { onCancel, onConfirm, keys, revokeApiKeysRequest } = props

  const title =
    keys.length > 1 ? (
      <FormattedMessage
        id='revoke-keys-multiple'
        defaultMessage='Revoke {number} API keys?'
        values={{
          number: keys.length,
        }}
      />
    ) : (
      <FormattedMessage
        id='revoke-keys-singular'
        defaultMessage='Revoke {keyName}?'
        values={{
          keyName: keys[0] ? keys[0].description : ``,
        }}
      />
    )

  return (
    <EuiOverlayMask>
      <EuiModal onClose={onCancel}>
        <EuiModalHeader data-test-id='revokeKey-modal'>
          <EuiModalHeaderTitle>{title}</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiText>
            <FormattedMessage {...messages.revokeModalBody} />
          </EuiText>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={onCancel}>
            <FormattedMessage {...messages.revokeCancel} />
          </EuiButtonEmpty>

          <CuiButton
            onClick={onConfirm}
            spin={revokeApiKeysRequest && revokeApiKeysRequest.inProgress}
            color='danger'
            requiresSudo={true}
            fill={true}
          >
            <FormattedMessage {...messages.revokeConfirm} />
          </CuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  )
}

export default injectIntl(RevokeKeyModal)
