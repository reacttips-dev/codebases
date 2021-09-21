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

import React, { ReactNode, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiText, EuiTitle, IconType } from '@elastic/eui'

import './sectionHeader.scss'

type Props = {
  icon?: IconType
  title: ReactNode
  amount?: number
}

function SectionHeader({ icon, title, amount }: Props) {
  return (
    <Fragment>
      <EuiFlexGroup
        className='section-row'
        gutterSize='s'
        alignItems='center'
        wrap={true}
        responsive={false}
      >
        {icon && (
          <EuiFlexItem grow={false}>
            <EuiIcon type={icon} size='l' />
          </EuiFlexItem>
        )}

        <EuiFlexItem grow={false}>
          <EuiTitle size='s'>
            <div>
              {title}
              <AmountDescription amount={amount} />
            </div>
          </EuiTitle>
        </EuiFlexItem>
      </EuiFlexGroup>
    </Fragment>
  )
}

function AmountDescription({ amount }: { amount: number | null | undefined }) {
  if (amount == null) {
    return null
  }

  return (
    <EuiText className='configureDeployment-sectionTitle-instanceCount' color='subdued'>
      <FormattedMessage
        id='create-deployment-configure.number-of-instance-configurations'
        defaultMessage='{amount} {amount, plural, one {configuration} other {configurations} }'
        values={{ amount }}
      />
    </EuiText>
  )
}

export default SectionHeader
