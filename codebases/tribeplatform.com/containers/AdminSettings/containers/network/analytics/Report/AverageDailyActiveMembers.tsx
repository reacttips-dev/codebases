import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportSlug } from 'tribe-api/interfaces'
import { AnalyticCard } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { BaseReportProps } from './@types/index'

const AverageDailyActiveMembers: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { t } = useTranslation()

  const { report: averageDailyActiveMembersReport } = getAnalytics({
    slug: ReportSlug.AVERAGEDAILYACTIVEMEMBERS,
    timeFrame: timeFrame?.value,
    spaceId,
  })

  return (
    <AnalyticCard
      colSpan={2}
      title={averageDailyActiveMembersReport?.title}
      subtitle={t('analytics:timeframe.realTime', 'Real Time')}
      moreInfo={averageDailyActiveMembersReport?.tooltip}
      value={averageDailyActiveMembersReport?.value}
      previousValue={averageDailyActiveMembersReport?.previousValue}
      hidePreviousValue
    />
  )
}

export default memo(AverageDailyActiveMembers, isEqual)
