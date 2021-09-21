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

import { isEmpty, map, every } from 'lodash'
import React, { FunctionComponent } from 'react'
import moment from 'moment'

import { Axis, BarSeries, Chart, DARK_THEME, LIGHT_THEME, Settings } from '@elastic/charts'

import { withErrorBoundary } from '../../../../cui'

import { getThemeColors } from '../../../../lib/theme'

type Props = {
  billingHistory: any
  theme: 'light' | 'dark'
}

const BillingHistoryChart: FunctionComponent<Props> = ({ billingHistory, theme }) => {
  if (isEmpty(billingHistory)) {
    return null // sanity — otherwise `@elastic/charts` blows up
  }

  // to not overload the chart, let's keep only the last 12
  const reversedHistory = billingHistory.slice(0, 12).reverse()

  if (every(reversedHistory, { total_amount_in_cents: 0 })) {
    // if we're just going to show 0's anyway, don't show anything at all
    return null
  }

  // Because the x-axis is ordinal, we need to define the domain. Which in this case is the months for which we have bills,
  // made into a nice string.
  const xDomain = map(reversedHistory, (item) => getDateValue(item.invoice_date))

  const data = map(reversedHistory, (item) => ({
    x: getDateValue(item.invoice_date), // the x axis data needs to match the domain values
    y: item.total_amount_in_cents / 100, // amounts are in cents, convert to dollars instead
  }))

  const themeToUse = theme === `light` ? LIGHT_THEME : DARK_THEME
  const { euiColorPrimary } = getThemeColors()

  return (
    <div>
      <Chart className='billingHistory-chart'>
        <Settings
          baseTheme={themeToUse}
          xDomain={xDomain}
          theme={{
            colors: {
              vizColors: [euiColorPrimary],
            },
          }}
        />

        <Axis id='time' position='bottom' />

        <Axis id='amount' position='left' tickFormat={(d) => `$${d}`} ticks={5} />

        <BarSeries
          id='Amount'
          xScaleType='ordinal'
          yScaleType='linear'
          xAccessor='x'
          yAccessors={['y']}
          data={data}
        />
      </Chart>
    </div>
  )
}

export default withErrorBoundary(BillingHistoryChart)

function getDateValue(invoiceDate) {
  const invoiceDateInTime = moment.utc(invoiceDate, 'YYYY-MM-DD')
  const invoiceYear = invoiceDateInTime.year()
  const currentYear = moment.utc().year()

  const year = currentYear === invoiceYear ? `` : `, ${invoiceYear}`
  const month = invoiceDateInTime.format(`MMMM`)

  return `${month}${year}`
}
