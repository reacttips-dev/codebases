import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { Chart } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { formatChartData } from 'utils/chart'

import { BaseReportProps } from './@types/index'

const TotalVisitors: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { t } = useTranslation()
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME
  const { report: totalVisitorsReport } = getAnalytics({
    slug: ReportSlug.TOTALVISITORS,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const totalVisitorsChartData = formatChartData(totalVisitorsReport?.data)

  return (
    <Chart
      title={totalVisitorsReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={totalVisitorsReport?.tooltip}
      value={totalVisitorsReport?.value}
      previousValue={totalVisitorsReport?.previousValue}
      data={totalVisitorsChartData}
      hidePreviousValue={isAllTime}
      lines={[
        {
          color: '#EBB056',
          name: t('analytics:loggedIn', 'Logged in'),
          dataKey: 'loggedIn',
        },
        {
          color: '#6ACDED',
          name: t('analytics:notLoggedIn', 'Not logged in'),
          dataKey: 'notLoggedIn',
        },
      ]}
    />
  )
}

export default memo(TotalVisitors, isEqual)
