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

import moment, { MomentInput } from 'moment'
import { capitalize } from 'lodash'

import React, { FunctionComponent } from 'react'

import { EuiToolTip } from '@elastic/eui'

const longDay = `Do MMM, YYYY`
const longDayTime = `${longDay} HH:mm:ss ([UTC] Z)`

interface Props {
  date: MomentInput
  longTime?: boolean
  longFormat?: string
  shouldCapitalize?: boolean
  removeSuffix?: boolean
}

export const CuiTimeAgo: FunctionComponent<Props> = ({
  date,
  longTime = false,
  longFormat = null,
  shouldCapitalize = true,
  removeSuffix = false,
}) => {
  const when = moment(date)
  const relative = when.fromNow(removeSuffix)
  const capitalized = shouldCapitalize ? capitalize(relative) : relative

  const tooltipContent = when.format(longFormat || (longTime ? longDayTime : longDay))

  return (
    <span>
      <EuiToolTip position='right' content={tooltipContent}>
        <span>{capitalized}</span>
      </EuiToolTip>
    </span>
  )
}

export function formatDate(
  date,
  {
    longTime = false,
  }: {
    longTime?: boolean
  } = {},
) {
  return moment(date).format(longTime ? longDayTime : longDay)
}
