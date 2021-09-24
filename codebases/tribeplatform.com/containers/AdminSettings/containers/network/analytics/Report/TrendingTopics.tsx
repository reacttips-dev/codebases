import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportSlug } from 'tribe-api/interfaces'
import { AnalyticTable } from 'tribe-components'

import { formatTableData } from 'utils/chart'

import { trendingTopicsColumns } from '../analyticTableConfig'
import { BaseReportProps } from './@types/index'

const TrendingTopics: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { report: trendingTopicsReport } = getAnalytics({
    slug: ReportSlug.TRENDINGTAGS,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const formattedTrendingTopicsReport = formatTableData(
    trendingTopicsReport?.data,
  )

  return (
    <AnalyticTable
      colSpan={3}
      title={trendingTopicsReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={trendingTopicsReport?.tooltip}
      data={formattedTrendingTopicsReport}
      columns={trendingTopicsColumns}
      showHeaders={false}
    />
  )
}

export default memo(TrendingTopics, isEqual)
