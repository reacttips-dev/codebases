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
import { defineMessages, FormattedMessage, IntlShape, injectIntl } from 'react-intl'

import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import DangerButton from '../DangerButton'
import { CuiPermissibleControl } from '../../cui'

import Permission from '../../lib/api/v1/permissions'

import { RemoteResourceRef } from '../../lib/api/v1/types'

type Props = {
  intl: IntlShape
  remote: RemoteResourceRef
  onEdit: (remote: RemoteResourceRef) => void
  onRemove: (remote: RemoteResourceRef) => void
}

const messages = defineMessages({
  editRemote: {
    id: `remote-deployment-actions.edit-remote`,
    defaultMessage: `Edit remote deployment`,
  },
  removeRemote: {
    id: `remote-deployment-actions.remove-remote`,
    defaultMessage: `Remove remote deployment`,
  },
  removeRemoteConfirmTitle: {
    id: `remote-deployment-actions.remove-remote-confirm-title`,
    defaultMessage: `Remove remote deployment?`,
  },
  removeRemoteConfirmBody: {
    id: `remote-deployment-actions.remove-remote-confirm-body`,
    defaultMessage: `After the association ends, this deployment won't be able to search across {alias} anymore.`,
  },
  removeRemoteConfirmButtonText: {
    id: `remote-deployment-actions.remove-remote-confirm-button-text`,
    defaultMessage: `Remove`,
  },
})

const RemoteDeploymentActions: FunctionComponent<Props> = ({
  intl: { formatMessage },
  remote,
  onEdit,
  onRemove,
}) => (
  <EuiFlexGroup gutterSize='m' alignItems='center' responsive={false}>
    <EuiFlexItem grow={false}>
      <CuiPermissibleControl permissions={Permission.setDeploymentEsResourceRemoteClusters}>
        <EuiButtonIcon
          iconType='pencil'
          aria-label={formatMessage(messages.editRemote)}
          onClick={() => onEdit(remote)}
        />
      </CuiPermissibleControl>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <CuiPermissibleControl permissions={Permission.setDeploymentEsResourceRemoteClusters}>
        <DangerButton
          buttonType={EuiButtonIcon}
          buttonProps={{ color: `danger` }}
          isEmpty={true}
          iconType='cross'
          aria-label={formatMessage(messages.removeRemote)}
          modal={{
            title: formatMessage(messages.removeRemoteConfirmTitle),
            body: (
              <FormattedMessage
                {...messages.removeRemoteConfirmBody}
                values={{
                  alias: <strong>{remote.alias}</strong>,
                }}
              />
            ),
            confirmButtonText: formatMessage(messages.removeRemoteConfirmButtonText),
          }}
          onConfirm={() => onRemove(remote)}
        />
      </CuiPermissibleControl>
    </EuiFlexItem>
  </EuiFlexGroup>
)

export default injectIntl(RemoteDeploymentActions)
