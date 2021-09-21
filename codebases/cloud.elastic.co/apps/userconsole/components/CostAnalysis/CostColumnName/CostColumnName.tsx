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

import React, { FunctionComponent, ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

interface Props {
  children: ReactElement
  isPrepaidConsumptionUser: boolean
}

const CostColumnName: FunctionComponent<Props> = ({ children, isPrepaidConsumptionUser }) => {
  if (isPrepaidConsumptionUser) {
    return (
      <EuiFlexGroup gutterSize='xs' alignItems='center'>
        <EuiFlexItem grow={false}>{children}</EuiFlexItem>
        <EuiFlexItem grow={false}>
          (<FormattedMessage id='elastic-consumption-units' defaultMessage='ECU' />)
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  return children
}

export default CostColumnName
