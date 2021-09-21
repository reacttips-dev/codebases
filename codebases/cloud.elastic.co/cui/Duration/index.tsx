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

import { EuiToolTip } from '@elastic/eui'

import prettyTime, { prettyDuration } from '../../lib/prettyTime'

interface Props {
  milliseconds: number
  shouldCapitalize?: boolean
  showTooltip?: boolean
}

export const CuiDuration: FunctionComponent<Props> = ({
  milliseconds,
  shouldCapitalize = true,
  showTooltip = true,
}) => {
  const durationText = prettyDuration({ milliseconds, shouldCapitalize })
  const content = <span>{durationText}</span>

  if (showTooltip === false || milliseconds < 1000) {
    return content
  }

  const tooltipContent = prettyTime(milliseconds)

  return (
    <EuiToolTip position='right' content={tooltipContent}>
      {content}
    </EuiToolTip>
  )
}
