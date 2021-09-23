import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportSlug } from 'tribe-api/interfaces'
import { AnalyticTable } from 'tribe-components'

import { formatTableData } from 'utils/chart'

import { topSpacesColumns } from '../analyticTableConfig'
import { BaseReportProps } from './@types/index'

const TopSpaces: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { report: topSpacesReport } = getAnalytics({
    slug: ReportSlug.TOPSPACES,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const formattedTopSpacesReport = formatTableData(topSpacesReport?.data)

  return (
    <AnalyticTable
      colSpan={6}
      title={topSpacesReport?.title}
      subtitle={topSpacesReport?.tooltip}
      data={formattedTopSpacesReport}
      columns={topSpacesColumns}
    />
  )
}

export default memo(TopSpaces, isEqual)
