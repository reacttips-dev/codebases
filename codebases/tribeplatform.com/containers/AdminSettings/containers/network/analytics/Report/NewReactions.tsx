import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { AnalyticCard } from 'tribe-components'

import { BaseReportProps } from './@types/index'

const NewReactions: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME

  const { report: newReactionsReport } = getAnalytics({
    slug: ReportSlug.NEWREACTIONS,
    timeFrame: timeFrame?.value,
    spaceId,
  })

  return (
    <AnalyticCard
      colSpan={2}
      title={newReactionsReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={newReactionsReport?.tooltip}
      value={newReactionsReport?.value}
      previousValue={newReactionsReport?.previousValue}
      hidePreviousValue={isAllTime}
    />
  )
}

export default memo(NewReactions, isEqual)
