import React, { FC, memo } from 'react'

import isEqual from 'react-fast-compare'

import { ReportSlug } from 'tribe-api/interfaces'

import { BaseReportProps } from './@types/index'
import ActiveMembers from './ActiveMembers'
import AverageDailyActiveMembers from './AverageDailyActiveMembers'
import Highlights from './Highlights'
import NewMembersOverTime from './NewMembersOverTime'
import NewPosts from './NewPosts'
import NewReactions from './NewReactions'
import NewReplies from './NewReplies'
import PopularDaysOfWeek from './PopularDaysOfWeek'
import PopularHoursOfDay from './PopularHoursOfDay'
import PostVsReplies from './PostVsReplies'
import TopMembers from './TopMembers'
import TopPosts from './TopPosts'
import TopSpaces from './TopSpaces'
import TotalMembers from './TotalMembers'
import TotalVisitors from './TotalVisitors'
import TrendingTopics from './TrendingTopics'

type ReportProps = BaseReportProps & {
  slug: ReportSlug
}

const Report: FC<ReportProps> = ({ slug, ...rest }) => {
  switch (slug) {
    case ReportSlug.ACTIVEMEMBERS:
      return <ActiveMembers {...rest} />
    case ReportSlug.AVERAGEDAILYACTIVEMEMBERS:
      return <AverageDailyActiveMembers {...rest} />
    case ReportSlug.HIGHLIGHTS:
      return <Highlights {...rest} />
    case ReportSlug.NEWMEMBERSOVERTIME:
      return <NewMembersOverTime {...rest} />
    case ReportSlug.NEWPOSTS:
      return <NewPosts {...rest} />
    case ReportSlug.NEWREACTIONS:
      return <NewReactions {...rest} />
    case ReportSlug.NEWREPLIES:
      return <NewReplies {...rest} />
    case ReportSlug.POPULARDAYSOFWEEK:
      return <PopularDaysOfWeek {...rest} />
    case ReportSlug.POPULARHOURSOFDAY:
      return <PopularHoursOfDay {...rest} />
    case ReportSlug.POSTSVSREPLIES:
      return <PostVsReplies {...rest} />
    case ReportSlug.TOPMEMBERS:
      return <TopMembers {...rest} />
    case ReportSlug.TOPPOSTS:
      return <TopPosts {...rest} />
    case ReportSlug.TOPSPACES:
      return <TopSpaces {...rest} />
    case ReportSlug.TOTALMEMBERS:
      return <TotalMembers {...rest} />
    case ReportSlug.TOTALVISITORS:
      return <TotalVisitors {...rest} />
    case ReportSlug.TRENDINGTAGS:
      return <TrendingTopics {...rest} />
    default:
      return null
  }
}

export default memo(Report, isEqual)
