import React, { FC, useMemo, useState, memo } from 'react'

import { HStack, Text, Grid, Box } from '@chakra-ui/react'
import isEqual from 'react-fast-compare'

import {
  hasInputPermission,
  hasActionPermission,
  hasValuePermission,
} from 'tribe-api'
import { ReportSlug, ReportTimeFrame } from 'tribe-api/interfaces'
import { Divider, SelectTimeframe } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import { UseReport } from 'containers/AdminSettings/hooks/useReport'
import useGetNetwork from 'containers/Network/useGetNetwork'

import Report from './Report'

const NetworkAnalytics: FC<{
  getAnalytics: UseReport
  spaceId: string
}> = ({ getAnalytics, spaceId = '' }) => {
  const { network } = useGetNetwork()
  const { actionPermission: reportPermissions } = hasActionPermission(
    network?.authMemberProps?.permissions || [],
    'report',
  )

  const { values: timeframeValuePermissions } = hasInputPermission(
    reportPermissions?.inputPermissions || [],
    'timeFrame',
  )

  const { t } = useTranslation()
  const timeframeOptions = useMemo(
    () => [
      {
        label: t('analytics:timeframe.today', 'Today'),
        value: ReportTimeFrame.TODAY,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.TODAY,
        ),
      },
      {
        label: t('analytics:timeframe.yesterday', 'Yesterday'),
        value: ReportTimeFrame.YESTERDAY,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.YESTERDAY,
        ),
      },
      {
        label: t('analytics:timeframe.lastWeek', 'Last week'),
        value: ReportTimeFrame.LASTWEEK,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTWEEK,
        ),
      },
      {
        label: t('analytics:timeframe.lastSevenDays', 'Last 7 days'),
        value: ReportTimeFrame.LASTSEVENDAYS,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTSEVENDAYS,
        ),
      },
      {
        label: t('analytics:timeframe.lastMonth', 'Last month'),
        value: ReportTimeFrame.LASTMONTH,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTMONTH,
        ),
      },
      {
        label: t('analytics:timeframe.lastThirtyDays', 'Last 30 days'),
        value: ReportTimeFrame.LASTTHIRTYDAYS,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTTHIRTYDAYS,
        ),
      },
      {
        label: t('analytics:timeframe.lastNinetyDays', 'Last 90 days'),
        value: ReportTimeFrame.LASTNINETYDAYS,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTNINETYDAYS,
        ),
      },
      {
        label: t(
          'analytics:timeframe.lastCalendarQuarter',
          'Last calendar quarter',
        ),
        value: ReportTimeFrame.LASTCALENDARQUARTER,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTCALENDARQUARTER,
        ),
      },
      {
        label: t('analytics:timeframe.lastTwelveMonths', 'Last 12 months'),
        value: ReportTimeFrame.LASTTWELVEMONTH,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTTWELVEMONTH,
        ),
      },
      {
        label: t('analytics:timeframe.lastCalendarYear', 'Last calendar year'),
        value: ReportTimeFrame.LASTCALENDARYEAR,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.LASTCALENDARYEAR,
        ),
      },
      {
        label: t('analytics:timeframe.allTime', 'All time'),
        value: ReportTimeFrame.ALLTIME,
        permission: hasValuePermission(
          timeframeValuePermissions,
          ReportTimeFrame.ALLTIME,
        ),
      },
    ],
    [],
  )

  const [selectedTimeframe, setSelectedTimeframe] = useState(
    timeframeOptions[5],
  )
  const reportProps = {
    getAnalytics,
    timeFrame: selectedTimeframe,
    spaceId,
  }
  return (
    <>
      <HStack mb="30" justify="space-between" px={1}>
        <Text textStyle="bold/2xlarge">
          {!spaceId ? (
            <Trans
              i18nKey="admin:sidebar.analytics"
              defaults="Network Analytics"
            />
          ) : (
            <Trans
              i18nKey="admin:sidebar.spaceAnalytics"
              defaults="Space Analytics"
            />
          )}
        </Text>
        <Box>
          <SelectTimeframe
            options={timeframeOptions}
            value={selectedTimeframe}
            onChange={timeframe => setSelectedTimeframe(timeframe)}
          />
        </Box>
      </HStack>
      <Divider color="border.base" />
      <Grid
        mt="4"
        templateColumns={['repeat(1, 1fr)', 'repeat(6, 1fr)']}
        gap={5}
      >
        <Report slug={ReportSlug.TOTALVISITORS} {...reportProps} />
        <Report slug={ReportSlug.TOTALMEMBERS} {...reportProps} />
        <Report slug={ReportSlug.AVERAGEDAILYACTIVEMEMBERS} {...reportProps} />
        <Report slug={ReportSlug.ACTIVEMEMBERS} {...reportProps} />
        <Report slug={ReportSlug.NEWMEMBERSOVERTIME} {...reportProps} />
        <Report slug={ReportSlug.NEWPOSTS} {...reportProps} />
        <Report slug={ReportSlug.NEWREPLIES} {...reportProps} />
        <Report slug={ReportSlug.NEWREACTIONS} {...reportProps} />
        {!spaceId && <Report slug={ReportSlug.TOPSPACES} {...reportProps} />}
        <Report slug={ReportSlug.TOPPOSTS} {...reportProps} />
        <Report slug={ReportSlug.TOPMEMBERS} {...reportProps} />
        <Report slug={ReportSlug.POSTSVSREPLIES} {...reportProps} />
        <Report slug={ReportSlug.POPULARDAYSOFWEEK} {...reportProps} />
        <Report slug={ReportSlug.POPULARHOURSOFDAY} {...reportProps} />
        <Report slug={ReportSlug.HIGHLIGHTS} {...reportProps} />
        <Report slug={ReportSlug.TRENDINGTAGS} {...reportProps} />
      </Grid>
    </>
  )
}

export default memo(NetworkAnalytics, isEqual)
