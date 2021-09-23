import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportSlug } from 'tribe-api/interfaces'
import { AnalyticTable } from 'tribe-components'

import { formatTableData } from 'utils/chart'

import { topPostsColumns } from '../analyticTableConfig'
import { BaseReportProps } from './@types/index'

const TopPosts: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { report: topPostsReport } = getAnalytics({
    slug: ReportSlug.TOPPOSTS,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const formattedTopPostsReport = formatTableData(topPostsReport?.data)

  return (
    <AnalyticTable
      colSpan={6}
      title={topPostsReport?.title}
      subtitle={topPostsReport?.tooltip}
      data={formattedTopPostsReport}
      columns={topPostsColumns}
    />
  )
}

export default memo(TopPosts, isEqual)
