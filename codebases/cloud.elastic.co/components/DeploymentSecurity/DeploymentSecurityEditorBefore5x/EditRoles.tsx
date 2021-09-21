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

import { EuiCode, EuiText } from '@elastic/eui'

import { CuiCodeEditor } from '../../../cui'

import DocLink from '../../DocLink'

type Props = {
  roles: string
  onChange: (nextRoles: string) => void
}

const EditRoles: FunctionComponent<Props> = ({ roles, onChange }) => (
  <div className='row'>
    <EuiText className='col-xs-12 col-sm-4'>
      <p>
        <FormattedMessage
          id='deployment-security-edit-roles.this-is-the-editor-for-security-s'
          defaultMessage="This is the editor for Security's {rolesYaml}"
          values={{
            rolesYaml: <EuiCode>roles.yml</EuiCode>,
          }}
        />
      </p>
      <p>
        <FormattedMessage
          id='deployment-security-edit-roles.see-a-on'
          defaultMessage='See {docs} on {definingRoles}'
          values={{
            docs: (
              <DocLink link='shield'>
                <FormattedMessage
                  id='deployment-security-edit-roles.security-s-documentation'
                  defaultMessage="Security's documentation"
                />
              </DocLink>
            ),
            definingRoles: (
              <DocLink link='shieldDefiningRoles'>
                <FormattedMessage
                  id='deployment-security-edit-roles.defining-roles'
                  defaultMessage='Defining Roles'
                />
              </DocLink>
            ),
          }}
        />
      </p>
    </EuiText>

    <div className='col-xs-12 col-sm-8'>
      <CuiCodeEditor language='yaml' value={roles} onChange={onChange} />
    </div>
  </div>
)

export default EditRoles
