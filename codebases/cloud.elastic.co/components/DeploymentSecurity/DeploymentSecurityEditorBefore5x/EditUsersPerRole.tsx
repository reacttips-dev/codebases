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
import { FormattedMessage } from 'react-intl'

import { EuiText, EuiSpacer } from '@elastic/eui'

import { CuiCodeBlock, CuiCodeEditor } from '../../../cui'

type Props = {
  usersPerRole: string
  onChange: (nextRoles: string) => void
}

const EditUsersPerRole: FunctionComponent<Props> = ({ usersPerRole, onChange }) => (
  <div className='row'>
    <EuiText className='col-xs-12 col-sm-4'>
      <FormattedMessage
        id='deployment-security-edit-users-per-role.define-users-per-role'
        defaultMessage='Define which users each role has, mapping role to comma-separated user names, like this:'
      />

      <EuiSpacer size='s' />

      <CuiCodeBlock language='yaml' paddingSize='m'>
        {`role_name: user1, user2\nother_role: user1, user3`}
      </CuiCodeBlock>
    </EuiText>

    <div className='col-xs-12 col-sm-8'>
      <CuiCodeEditor language='yaml' value={usersPerRole} onChange={onChange} />
    </div>
  </div>
)

export default EditUsersPerRole
