import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { AnalyticCard } from 'tribe-components'

import { BaseReportProps } from './@types/index'

const NewPosts: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME

  const { report: newPostsReport } = getAnalytics({
    slug: ReportSlug.NEWPOSTS,
    timeFrame: timeFrame?.value,
    spaceId,
  })

  return (
    <AnalyticCard
      colSpan={2}
      title={newPostsReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={newPostsReport?.tooltip}
      value={newPostsReport?.value}
      previousValue={newPostsReport?.previousValue}
      hidePreviousValue={isAllTime}
    />
  )
}

export default memo(NewPosts, isEqual)
