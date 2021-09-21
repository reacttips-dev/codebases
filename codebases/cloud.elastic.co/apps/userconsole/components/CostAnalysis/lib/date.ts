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

import moment, { Moment } from 'moment'

export function getUTCDate(date?: Date): Moment {
  return moment.utc(date)
}

export function formatTimeRange(from: Moment, to: Moment): string {
  const format = 'MMM D, YYYY'

  if (from.isSame(to, 'month')) {
    return `${from.format('MMMM')} ${from.format('D')} - ${to.format('D')}, ${from.format('YYYY')}`
  }

  return `${from.format(format)} - ${to.format(format)}`
}
