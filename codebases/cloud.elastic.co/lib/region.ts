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
import countryCodeToFlagEmoji from 'country-code-to-flag-emoji'
import { Region } from './api/v1/types'

export function getRegionDisplayName({
  region,
  hideFlagEmoji,
}: {
  region: Region | undefined
  hideFlagEmoji?: boolean
}): string {
  if (!region) {
    return ``
  }

  const countryFlagEmoji = countryCodeToFlagEmoji(region.country)

  if (!countryFlagEmoji || hideFlagEmoji) {
    return region.name
  }

  return `${countryFlagEmoji}\u00A0\u00A0\u00A0${region.name}`
}
