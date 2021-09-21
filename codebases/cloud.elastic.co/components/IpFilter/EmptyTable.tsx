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

import React, { ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui'
import { CuiPermissibleControl } from '../../cui/PermissibleControl'
import Permission from '../../lib/api/v1/permissions'

export default function EmptyTable({
  onAction,
  message,
  actions,
}: {
  onAction: () => void
  message: ReactNode
  actions: ReactNode
}) {
  return (
    <EuiEmptyPrompt
      data-test-id='ip-filter-rules-set.rules-set-zero'
      title={
        <h3>
          <FormattedMessage
            id='ip-filter-rules-set.no-ruleset-title'
            defaultMessage='No rule sets'
          />
        </h3>
      }
      titleSize='xs'
      body={message}
      actions={
        <CuiPermissibleControl permissions={Permission.createIpFilterRuleset}>
          <EuiButton className='ip-filter-add-rule-set' onClick={onAction}>
            {actions}
          </EuiButton>
        </CuiPermissibleControl>
      }
    />
  )
}
