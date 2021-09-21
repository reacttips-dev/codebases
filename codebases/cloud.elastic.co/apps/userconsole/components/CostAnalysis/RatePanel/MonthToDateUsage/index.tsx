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
import { EuiLoadingContent } from '@elastic/eui'

import RatePanel, { Rate } from '../'
import { Info } from '../../../../../../types'
import { messages } from '../../messages'

interface Props extends WrappedComponentProps {
  isLoading?: boolean
  rate?: number
  rates?: Rate[]
  info?: Info[]
}

const MonthToDateUsage: FunctionComponent<Props> = ({
  intl: { formatMessage },
  isLoading,
  info,
  rate,
  rates,
}) => {
  if (isLoading) {
    return <EuiLoadingContent lines={3} />
  }

  return (
    <RatePanel
      description={{
        text: formatMessage(messages.monthToDateUsage),
      }}
      info={info}
      rate={rate}
      rates={rates}
    />
  )
}

export default injectIntl(MonthToDateUsage)
