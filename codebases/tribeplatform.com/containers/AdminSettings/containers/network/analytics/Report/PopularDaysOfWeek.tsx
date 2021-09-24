import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { Chart } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { formatChartData } from 'utils/chart'

import { BaseReportProps } from './@types/index'

const PopularDaysOfWeek: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { t } = useTranslation()
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME

  const { report: popularDaysOfWeekReport } = getAnalytics({
    slug: ReportSlug.POPULARDAYSOFWEEK,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const formattedPopularDaysOfWeekReport = formatChartData(
    popularDaysOfWeekReport?.data,
  )

  return (
    <Chart
      title={popularDaysOfWeekReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={popularDaysOfWeekReport?.tooltip}
      value={popularDaysOfWeekReport?.value}
      previousValue={popularDaysOfWeekReport?.previousValue}
      data={formattedPopularDaysOfWeekReport}
      hideValue
      hidePreviousValue={isAllTime}
      lines={[
        {
          color: '#EBB056',
          name: t('analytics:mobile', 'Mobile'),
          dataKey: 'mobile',
        },
        {
          color: '#6ACDED',
          name: t('analytics:desktop', 'Desktop'),
          dataKey: 'desktop',
        },
      ]}
    />
  )
}

export default memo(PopularDaysOfWeek, isEqual)
