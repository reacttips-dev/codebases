/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { Moment } from 'moment'

import { getUTCDate, formatTimeRange } from './date'

import { SelectedDateRange, TimePeriod } from '../../../../../types'
import { DeploymentCosts, SaasUserTrial } from '../../../../../lib/api/v1/types'

export function getDeploymentName({
  deployment_id,
  deployment_name,
}: Partial<DeploymentCosts>): string {
  if (!deployment_name) {
    return deployment_id ? deployment_id.slice(0, 7) : ''
  }

  return deployment_name
}

export function getCurrentMonth(): string {
  return getUTCDate().format('MMMM YYYY')
}

export function getTimeRange({ timePeriod }: { timePeriod?: TimePeriod }): {
  from: Moment
  to: Moment
} {
  if (timePeriod) {
    if (timePeriod.to && timePeriod.from) {
      return {
        from: timePeriod.from,
        to: timePeriod.to,
      }
    }

    if (timePeriod.id === 'lastMonth') {
      return getMonthDateRange(getUTCDate().subtract(1, 'month'))
    }
  }

  return getMonthDateRange()
}

export function getMonthDateRange(date?: Moment): { from: Moment; to: Moment } {
  if (date) {
    return {
      from: date.clone().startOf('month'),
      to: date.endOf('month'),
    }
  }

  return {
    from: getUTCDate().startOf('month'),
    to: getUTCDate(),
  }
}

export function getDaysLeftInBillingCycle(): number {
  const numberOfDaysInMonth = getUTCDate().daysInMonth()
  const numberOfDaysPassed = getUTCDate().date()
  return numberOfDaysInMonth - numberOfDaysPassed
}

export function formatTimePeriod({ timePeriod }: { timePeriod?: TimePeriod }): string {
  const format = 'MMMM YYYY'

  if (timePeriod) {
    const { id, from, to } = timePeriod

    if (id === 'lastMonth') {
      return getUTCDate().subtract(1, 'months').format(format)
    }

    if (from && to) {
      if (from.isAfter(to)) {
        throw new Error('Invalid date range. From date is after To date')
      }

      return formatTimeRange(from, to)
    }
  }

  return getUTCDate().format(format)
}

export function hasSelectedDateRangeChanged({
  selectedDateRange,
  prevSelectedDateRange,
}: {
  selectedDateRange: SelectedDateRange
  prevSelectedDateRange: SelectedDateRange
}): boolean {
  const { selectedStartDate, selectedEndDate } = selectedDateRange
  const { selectedStartDate: prevSelectedStartDate, selectedEndDate: prevSelectedEndDate } =
    prevSelectedDateRange

  return !(
    selectedStartDate?.isSame(prevSelectedStartDate, 'day') &&
    selectedEndDate?.isSame(prevSelectedEndDate, 'day')
  )
}

export function trialNotStarted({
  inTrial,
  trials,
}: {
  inTrial?: boolean
  trials: SaasUserTrial[]
}): boolean {
  if (typeof inTrial === 'undefined') {
    return true
  }

  return inTrial && !trials.length
}
