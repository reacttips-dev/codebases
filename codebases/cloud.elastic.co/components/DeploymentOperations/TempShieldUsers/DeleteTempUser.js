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

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { get } from 'lodash'
import { CuiPermissibleControl } from '../../../cui/PermissibleControl'
import Permission from '../../../lib/api/v1/permissions'

import DangerButton from '../../DangerButton'

function DeleteTempUser({
  user,
  data,
  deleteTempShieldUser,
  cluster,
  createTempShieldUserInfo,
  deleteTempShieldUserInfo,
}) {
  const activeDeletedItem = get(deleteTempShieldUserInfo, [`meta`, `username`]) === user.username

  const spinning =
    (deleteTempShieldUserInfo.inProgress || deleteTempShieldUserInfo.isDone) &&
    get(deleteTempShieldUserInfo, [`meta`, `username`]) === user.username

  const disabled =
    createTempShieldUserInfo.inProgress ||
    createTempShieldUserInfo.isDone ||
    (!activeDeletedItem && (deleteTempShieldUserInfo.inProgress || deleteTempShieldUserInfo.isDone))

  return (
    <CuiPermissibleControl permissions={Permission.setEsClusterMetadataRaw}>
      <DangerButton
        data-test-id='confirm-to-delete-button'
        modal={{
          title: (
            <FormattedMessage
              id='cluster-manage-delete-temp-user.confirm-to-delete'
              defaultMessage='Confirm to delete'
            />
          ),
        }}
        size='s'
        onConfirm={() => deleteTempShieldUser(cluster, data, user)}
        disabled={disabled}
        isBusy={spinning}
        requiresSudo={true}
      >
        {activeDeletedItem && deleteTempShieldUserInfo.error != null ? (
          <FormattedMessage
            id='cluster-manage-delete-temp-user.delete-user-failed'
            defaultMessage='Delete failed, try again'
          />
        ) : (
          <FormattedMessage
            id='cluster-manage-delete-temp-user.delete-user'
            defaultMessage='Delete'
          />
        )}
      </DangerButton>
    </CuiPermissibleControl>
  )
}

export default DeleteTempUser
