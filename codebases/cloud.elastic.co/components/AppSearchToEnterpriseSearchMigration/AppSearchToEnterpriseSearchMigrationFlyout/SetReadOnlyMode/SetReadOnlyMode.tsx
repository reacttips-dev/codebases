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

import { EuiText, EuiSpacer, EuiLink } from '@elastic/eui'

import SpinButton from '../../../SpinButton'

import { AllProps } from './types'

const SetReadOnlyMode: React.FunctionComponent<AllProps> = ({
  deployment,
  readOnlyEnabled,
  setAppSearchReadOnlyMode,
  setAppSearchReadOnlyModeRequest,
  onSet,
}) => (
  <div>
    <EuiText>
      <p>
        <FormattedMessage
          id='appSearchToEnterpriseSearchMigration.readOnlyModeIntro'
          defaultMessage='Prevent data from being written to your App Search instance during the migration process by setting it to read-only mode.'
        />
      </p>
    </EuiText>
    <EuiSpacer />
    <SpinButton
      disabled={readOnlyEnabled}
      spin={setAppSearchReadOnlyModeRequest.inProgress}
      onClick={() => setAppSearchReadOnlyMode({ deployment, enabled: true }).then(() => onSet())}
    >
      <FormattedMessage
        id='appSearchToEnterpriseSearchMigration.setReadOnly'
        defaultMessage='Set read-only mode'
      />
    </SpinButton>
    {readOnlyEnabled && (
      <EuiText size='s'>
        <EuiSpacer size='s' />
        <EuiLink
          disabled={setAppSearchReadOnlyModeRequest.inProgress}
          onClick={() =>
            setAppSearchReadOnlyMode({ deployment, enabled: false }).then(() => onSet())
          }
        >
          <FormattedMessage
            id='appSearchToEnterpriseSearchMigration.revertReadOnly'
            defaultMessage='Revert back to read/write'
          />
        </EuiLink>
      </EuiText>
    )}
  </div>
)

export default SetReadOnlyMode
