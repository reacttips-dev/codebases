import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { AnalyticCard } from 'tribe-components'

import { BaseReportProps } from './@types/index'

const ActiveMembers: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME

  const { report: activeMembersReport } = getAnalytics({
    slug: ReportSlug.ACTIVEMEMBERS,
    timeFrame: timeFrame?.value,
    spaceId,
  })

  return (
    <AnalyticCard
      colSpan={2}
      title={activeMembersReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={activeMembersReport?.tooltip}
      value={activeMembersReport?.value}
      previousValue={activeMembersReport?.previousValue}
      hidePreviousValue={isAllTime}
    />
  )
}

export default memo(ActiveMembers, isEqual)
