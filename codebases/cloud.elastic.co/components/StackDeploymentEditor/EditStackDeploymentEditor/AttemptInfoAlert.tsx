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

import { EuiSpacer } from '@elastic/eui'

import { CuiAlert, AlertType } from '../../../cui'

type Props = {
  type: AlertType
}

const AttemptInfoAlert: FunctionComponent<Props> = ({ type, children }) => (
  <div>
    <EuiSpacer size='m' />

    <CuiAlert type={type}>{children}</CuiAlert>

    <EuiSpacer size='m' />
  </div>
)

export default AttemptInfoAlert
