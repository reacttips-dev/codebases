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
import { EuiIcon } from '@elastic/eui'
import cx from 'classnames'

import './beveledIcon.scss'

interface Props {
  baseColor?: 'warning' | 'danger' | 'success' | 'subdued'
  className?: string
  type: string
}

export const CuiBeveledIcon: FunctionComponent<Props> = ({ baseColor, className, type }) => (
  <div
    className={cx(`cuiBeveledIcon`, className, {
      cuiBeveledIcon_warning: baseColor === 'warning',
      cuiBeveledIcon_danger: baseColor === 'danger',
    })}
  >
    <EuiIcon type={type} size='m' />
  </div>
)
