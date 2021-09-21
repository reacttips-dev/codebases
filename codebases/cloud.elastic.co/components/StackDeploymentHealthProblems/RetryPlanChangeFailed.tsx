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

import React, { Fragment, FunctionComponent } from 'react'

import { EuiFlexGroup, EuiFlexItem, EuiIcon } from '@elastic/eui'

import { parseError } from '../../cui'

type Props = {
  error: string | Error
}

const RetryPlanChangeFailed: FunctionComponent<Props> = ({ error }) => (
  <Fragment>
    <EuiFlexGroup gutterSize='s' alignItems='center'>
      <EuiFlexItem grow={false}>
        <EuiIcon type='alert' />
      </EuiFlexItem>
      <EuiFlexItem>{parseError(error)}</EuiFlexItem>
    </EuiFlexGroup>
  </Fragment>
)

export default RetryPlanChangeFailed
