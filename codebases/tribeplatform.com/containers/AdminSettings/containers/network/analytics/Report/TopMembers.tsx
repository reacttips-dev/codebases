import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportSlug } from 'tribe-api/interfaces'
import { AnalyticTable } from 'tribe-components'

import { formatTableData } from 'utils/chart'

import { topMembersColumns } from '../analyticTableConfig'
import { BaseReportProps } from './@types/index'

const TopMembers: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { report: topMembersReport } = getAnalytics({
    slug: ReportSlug.TOPMEMBERS,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const formattedTopMembersReport = formatTableData(topMembersReport?.data)

  return (
    <AnalyticTable
      colSpan={6}
      title={topMembersReport?.title}
      subtitle={topMembersReport?.tooltip}
      data={formattedTopMembersReport}
      columns={topMembersColumns}
    />
  )
}

export default memo(TopMembers, isEqual)
