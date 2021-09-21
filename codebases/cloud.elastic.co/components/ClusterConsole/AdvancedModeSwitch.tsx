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

import { EuiSwitch } from '@elastic/eui'

interface Props {
  checked: boolean
  onChange: (isChecked: boolean) => void
}

const AdvancedModeSwitch: FunctionComponent<Props> = ({ checked, onChange }) => (
  <EuiSwitch
    data-test-id='api-console-advanced-switch'
    checked={checked || false}
    onChange={() => onChange(!checked)}
    label={
      <FormattedMessage id='cluster-console-request.advanced-mode' defaultMessage='Advanced' />
    }
  />
)

export default AdvancedModeSwitch
