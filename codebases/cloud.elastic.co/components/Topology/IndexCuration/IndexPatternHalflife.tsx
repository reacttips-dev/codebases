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

import React, { Component } from 'react'
import moment from 'moment'
import { defineMessages, FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl'

import { EuiFieldNumber, EuiFlexGroup, EuiFlexItem, EuiSelect } from '@elastic/eui'

import { ClusterCurationSpec } from '../../../lib/api/v1/types'
import { getIndexHalflifeFromSeconds, IndexHalflife } from '../../../lib/curation'

const messages = defineMessages({
  moveInHours: {
    id: `index-curation-settings.move-in-hours`,
    defaultMessage: `{amount, plural, one {Hour} other {Hours}}`,
  },
  moveInDays: {
    id: `index-curation-settings.move-in-days`,
    defaultMessage: `{amount, plural, one {Day} other {Days}}`,
  },
  moveInWeeks: {
    id: `index-curation-settings.move-in-weeks`,
    defaultMessage: `{amount, plural, one {Week} other {Weeks}}`,
  },
  moveInMonths: {
    id: `index-curation-settings.move-in-months`,
    defaultMessage: `{amount, plural, one {Month} other {Months}}`,
  },
})

interface Props extends WrappedComponentProps {
  indexPattern: ClusterCurationSpec
  onChange: (spec: Partial<ClusterCurationSpec>) => void
}

type State = IndexHalflife

class IndexPatternHalflife extends Component<Props, State> {
  state = getIndexHalflifeFromSeconds(this.props.indexPattern.trigger_interval_seconds)

  render() {
    const {
      intl: { formatMessage },
    } = this.props
    const { amount, type } = this.state

    return (
      <EuiFlexGroup alignItems='center' gutterSize='s'>
        <EuiFlexItem>
          <FormattedMessage
            id='index-curation-settings.move-indices-after-label'
            defaultMessage='After'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFieldNumber
            min={1}
            value={amount}
            onChange={(e) =>
              this.onChangeTrigger(parseInt((e.target as HTMLInputElement).value, 10), type)
            }
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiSelect
            style={{ width: `7rem` }}
            options={[
              {
                text: formatMessage(messages.moveInHours, { amount }),
                value: `hours`,
              },
              {
                text: formatMessage(messages.moveInDays, { amount }),
                value: `days`,
              },
              {
                text: formatMessage(messages.moveInWeeks, { amount }),
                value: `weeks`,
              },
              {
                text: formatMessage(messages.moveInMonths, { amount }),
                value: `months`,
              },
            ]}
            value={type}
            onChange={(e) => this.onChangeTrigger(amount, (e.target as HTMLSelectElement).value)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  onChangeTrigger(amount, type) {
    const { onChange } = this.props

    let sanitizedAmount = amount < 1 ? 1 : amount

    let trigger_interval_seconds

    // Ensure seconds doesn't overflow Java's Integer.MAX_VALUE. This is kinda ridiculous since the max value
    // turns out to be 828 months, or 3550 weeks, or 24855 days, or 596523 hours, but someone is bound to try it
    // out, and it causes an API error.
    const INTEGER_MAX_VALUE = 2147483647

    do {
      // moment does 30/31 days in a month, but we need to be consistent for this one
      trigger_interval_seconds =
        type === `months`
          ? sanitizedAmount * 30 * 24 * 60 * 60
          : moment.duration(sanitizedAmount, type).asSeconds()
    } while (trigger_interval_seconds > INTEGER_MAX_VALUE && sanitizedAmount--)

    onChange({ trigger_interval_seconds })
    this.setState({ amount: sanitizedAmount, type })
  }
}

export default injectIntl(IndexPatternHalflife)
