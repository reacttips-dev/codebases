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
import { injectIntl, WrappedComponentProps } from 'react-intl'

import RatePanel from '../'
import { Info } from '../../../../../../types'

import { messages } from '../../messages'

interface Props extends WrappedComponentProps {
  deploymentName?: React.ReactChild
  info?: Info[]
  rate?: number
  showTip?: boolean
}

const CurrentHourlyRate: FunctionComponent<Props> = ({
  info,
  intl: { formatMessage },
  rate,
  showTip,
}) => (
  <RatePanel
    description={{
      text: formatMessage(messages.totalHourlyRate),
      tip: showTip
        ? {
            content: (
              <div style={{ width: '175px' }}>{formatMessage(messages.sumOfHourlyRates)}</div>
            ),
          }
        : undefined,
    }}
    info={info}
    rate={rate}
    dp={rate && rate > 0 ? 4 : 2}
  />
)

export default injectIntl(CurrentHourlyRate)
