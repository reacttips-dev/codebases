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

import React, { Fragment, FunctionComponent, ReactNode } from 'react'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTextAlign,
  EuiTitle,
} from '@elastic/eui'

interface Props {
  className?: string
  button?: ReactNode | null
  description?: ReactNode
  footer?: ReactNode
  title?: ReactNode
}

const BillingPanel: FunctionComponent<Props> = ({
  button,
  className = '',
  description,
  footer,
  title,
}) => (
  <EuiPanel className={`billing-panel ${className}`}>
    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiTitle size='xxxs'>
          <h2>{title}</h2>
        </EuiTitle>

        {description && (
          <Fragment>
            <EuiSpacer size='s' />

            <EuiText data-test-id='subscription-level' size='s'>
              <h3>{description}</h3>
            </EuiText>
          </Fragment>
        )}
      </EuiFlexItem>

      {button && (
        <EuiFlexItem>
          <EuiTextAlign textAlign='right'>{button}</EuiTextAlign>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>

    <EuiSpacer size='s' />

    <EuiText size='s'>{footer}</EuiText>
  </EuiPanel>
)

export default BillingPanel
