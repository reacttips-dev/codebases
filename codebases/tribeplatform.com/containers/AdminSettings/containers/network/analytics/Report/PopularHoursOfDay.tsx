import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { Chart } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { formatChartData } from 'utils/chart'

import { BaseReportProps } from './@types/index'

const PopularHoursOfDay: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { t } = useTranslation()
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME

  const { report: popularHoursOfDayReport } = getAnalytics({
    slug: ReportSlug.POPULARHOURSOFDAY,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const formattedPopularHoursOfDayReport = formatChartData(
    popularHoursOfDayReport?.data,
  )

  return (
    <Chart
      title={popularHoursOfDayReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={popularHoursOfDayReport?.tooltip}
      value={popularHoursOfDayReport?.value}
      previousValue={popularHoursOfDayReport?.previousValue}
      data={formattedPopularHoursOfDayReport}
      hideValue
      hidePreviousValue={isAllTime}
      lines={[
        {
          color: '#EBB056',
          name: t('analytics:activeUsers', 'Active users'),
          dataKey: 'activeUsers',
        },
      ]}
    />
  )
}

export default memo(PopularHoursOfDay, isEqual)
