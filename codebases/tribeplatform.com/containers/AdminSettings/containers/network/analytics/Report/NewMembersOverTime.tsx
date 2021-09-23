import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { Chart } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { formatChartData } from 'utils/chart'

import { BaseReportProps } from './@types/index'

const NewMembersOverTime: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { t } = useTranslation()
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME

  const { report: newMembersOverTimeReport } = getAnalytics({
    slug: ReportSlug.NEWMEMBERSOVERTIME,
    timeFrame: timeFrame?.value,
    spaceId,
  })

  const newMembersOverTimeReportChartData = formatChartData(
    newMembersOverTimeReport?.data,
  )

  return (
    <Chart
      title={newMembersOverTimeReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={newMembersOverTimeReport?.tooltip}
      value={newMembersOverTimeReport?.value}
      previousValue={newMembersOverTimeReport?.previousValue}
      data={newMembersOverTimeReportChartData}
      hidePreviousValue={isAllTime}
      lines={[
        {
          color: '#EBB056',
          name: t('analytics:newMembers', 'New members'),
          dataKey: 'newMembers',
        },
      ]}
    />
  )
}

export default memo(NewMembersOverTime, isEqual)
