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

import React, { FunctionComponent, ReactElement, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiBadge, EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui'

const defaultBadge = <FormattedMessage id='title-with-badge.default' defaultMessage='Optional' />

export const CuiTitleWithBadge: FunctionComponent<{
  children: ReactNode
  badge?: string | ReactElement<typeof FormattedMessage>
}> = ({ children, badge = defaultBadge }) => (
  <EuiFlexGroup responsive={false} alignItems='center' className='titleWithBadge'>
    <EuiFlexItem grow={false}>
      <EuiTitle size='xs'>
        <h3>{children}</h3>
      </EuiTitle>
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiBadge color='secondary'>{badge}</EuiBadge>
    </EuiFlexItem>
  </EuiFlexGroup>
)
