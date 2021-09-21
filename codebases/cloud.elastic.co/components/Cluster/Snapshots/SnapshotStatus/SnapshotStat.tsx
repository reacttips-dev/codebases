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

import React, { FunctionComponent, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiStat } from '@elastic/eui'

import { CuiTimeAgo } from '../../../../cui'

import './snapshotStat.scss'

type Props = {
  label: ReactNode
  children: ReactNode
  color?: 'default' | 'primary' | 'secondary' | 'accent' | 'danger' | 'subdued'
}

const SnapshotStat: FunctionComponent<Props> = ({ label, children, color }) => (
  <EuiStat
    className='snapshotStat'
    description={label}
    title={children}
    titleColor={color}
    titleSize='m'
  />
)

export const DateStat = ({ date }: { date: string | null }) =>
  date ? (
    <CuiTimeAgo date={date} longTime={true} />
  ) : (
    <FormattedMessage id='deployment-snapshot-stat.never' defaultMessage='Never' />
  )

export default SnapshotStat
