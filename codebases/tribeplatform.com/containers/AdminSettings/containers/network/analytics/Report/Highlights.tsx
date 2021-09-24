import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportSlug } from 'tribe-api/interfaces'
import { AnalyticTable } from 'tribe-components'

import { formatSimpleTableData } from 'utils/chart'

import { highlightsColumns } from '../analyticTableConfig'
import { BaseReportProps } from './@types/index'

const Highlights: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { report: highlightsReport } = getAnalytics({
    slug: ReportSlug.HIGHLIGHTS,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const highlightsTableData = formatSimpleTableData(
    highlightsReport?.title,
    highlightsReport?.data,
  )

  return (
    <AnalyticTable
      colSpan={3}
      title={highlightsReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={highlightsReport?.tooltip}
      data={highlightsTableData}
      columns={highlightsColumns}
      showHeaders={false}
    />
  )
}

export default memo(Highlights, isEqual)
