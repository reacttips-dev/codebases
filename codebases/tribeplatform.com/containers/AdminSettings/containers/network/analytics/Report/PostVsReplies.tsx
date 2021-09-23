import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportTimeFrame, ReportSlug } from 'tribe-api/interfaces'
import { Chart } from 'tribe-components'
import { useTranslation } from 'tribe-translation'

import { formatChartData } from 'utils/chart'

import { BaseReportProps } from './@types/index'

const PostVsReplies: FC<BaseReportProps> = ({
  getAnalytics,
  spaceId = '',
  timeFrame,
}) => {
  const { t } = useTranslation()
  const isAllTime = timeFrame?.value === ReportTimeFrame.ALLTIME

  const { report: postsVsRepliesReport } = getAnalytics({
    slug: ReportSlug.POSTSVSREPLIES,
    timeFrame: timeFrame?.value,
    spaceId,
  })
  const formattedPostsVsRepliesReport = formatChartData(
    postsVsRepliesReport?.data,
  )

  return (
    <Chart
      title={postsVsRepliesReport?.title}
      subtitle={timeFrame?.label}
      moreInfo={postsVsRepliesReport?.tooltip}
      value={postsVsRepliesReport?.value}
      previousValue={postsVsRepliesReport?.previousValue}
      data={formattedPostsVsRepliesReport}
      hidePreviousValue={isAllTime}
      lines={[
        {
          color: '#EBB056',
          name: t('analytics:posts', 'Posts'),
          dataKey: 'posts',
        },
        {
          color: '#6ACDED',
          name: t('analytics:replies', 'Replies'),
          dataKey: 'replies',
        },
      ]}
    />
  )
}

export default memo(PostVsReplies, isEqual)
