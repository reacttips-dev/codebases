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

const beginsWithHttp = /^https?:\/\//
const startsWithAlpha = /^[a-z]/
const endsWithMinusOrPeriod = /[-.]$/

export default function validateDomain(input) {
  if (typeof input !== 'string') {
    return false
  }

  try {
    const domain = beginsWithHttp.test(input) ? input : `http://${input}`
    const parts = new URL(domain)
    const { hostname } = parts

    if (typeof hostname !== 'string') {
      return false
    }

    const isTopLevelDomain = !hostname.includes('.')

    if (isTopLevelDomain) {
      return false
    }

    const domains = hostname.split('.')

    for (const domain of domains) {
      if (endsWithMinusOrPeriod.test(domain)) {
        return false
      }
    }

    return startsWithAlpha.test(hostname)
  } catch (err) {
    return false
  }
}
