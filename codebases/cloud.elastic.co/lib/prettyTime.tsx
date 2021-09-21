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

import moment from 'moment'
import { capitalize } from 'lodash'
import React, { FunctionComponent, ReactElement } from 'react'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'

type PrettyTimeUnit = 'ms' | 's' | 'm' | 'h'

type PrettyDurationProps = {
  milliseconds: number
  shouldCapitalize?: boolean
}

const messages = defineMessages({
  subMillisecondDuration: {
    id: `pretty-time.sub-second-duration`,
    defaultMessage: `{millisecondsText} {milliseconds, plural, one {millisecond} other {milliseconds}}`,
  },
  aroundOneSecond: {
    id: `pretty-time.around-a-second-duration`,
    defaultMessage: `around a second`,
  },
})

export default function prettyTime(input: number | null | undefined): string {
  if (input == null) {
    return ``
  }

  let value = input
  let unit: PrettyTimeUnit = `ms`
  let rest = 0
  let restUnit: PrettyTimeUnit | null = null

  if (value >= 1000) {
    value = value / 1000
    unit = `s`

    if (value >= 60) {
      rest = value % 60
      value = value / 60
      unit = `m`
      restUnit = `s`

      if (value >= 60) {
        rest = value % 60
        value = value / 60
        unit = `h`
        restUnit = `m`
      }
    }
  }

  const displayValue = `${Math.floor(value)}${unit}`
  let restDisplayValue = ``

  if (rest !== 0) {
    restDisplayValue = ` ${Math.floor(rest)}${restUnit}`
  }

  return `${displayValue}${restDisplayValue}`
}

const PrettyDurationImpl: FunctionComponent<PrettyDurationProps & WrappedComponentProps> = ({
  intl: { formatMessage },
  milliseconds,
  shouldCapitalize,
}) => {
  const durationText = getDurationText()
  const formattedText = shouldCapitalize ? capitalize(durationText) : durationText
  return <span>{formattedText}</span>

  function getDurationText() {
    if (milliseconds < 1000) {
      return formatMessage(messages.subMillisecondDuration, {
        millisecondsText: String(milliseconds),
        milliseconds,
      })
    }

    if (milliseconds < 2000) {
      return formatMessage(messages.aroundOneSecond)
    }

    return moment.duration(milliseconds).humanize()
  }
}

const PrettyDuration = injectIntl(PrettyDurationImpl)

export function prettyDuration({
  milliseconds,
  shouldCapitalize,
}: {
  milliseconds: number
  shouldCapitalize?: boolean
}): ReactElement {
  return <PrettyDuration milliseconds={milliseconds} shouldCapitalize={shouldCapitalize} />
}

export function getFileTimestamp() {
  return moment().format(`YYYY-MMM-DD--HH_mm_ss`)
}
