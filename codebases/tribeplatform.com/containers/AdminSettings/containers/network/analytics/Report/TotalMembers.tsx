import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { AnalyticCard } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { BaseReportProps } from './@types/index'

const TotalMembers: FC<BaseReportProps> = ({ getAnalytics, spaceId = '' }) => {
  const { t } = useTranslation()
  const { report: totalMembersReport } = getAnalytics({
    slug: ReportSlug.TOTALMEMBERS,
    timeFrame: ReportTimeFrame.ALLTIME,
    spaceId,
  })

  return (
    <AnalyticCard
      colSpan={2}
      title={totalMembersReport?.title}
      subtitle={t('analytics:timeframe.allTime', 'All time')}
      moreInfo={totalMembersReport?.tooltip}
      value={totalMembersReport?.value}
      hidePreviousValue
    />
  )
}

export default memo(TotalMembers, isEqual)
