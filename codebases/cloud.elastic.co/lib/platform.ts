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

import { IconType } from '@elastic/eui'

export type PlatformId = 'aws' | 'azure' | 'gcp' | 'ibm' | 'local'

export type PlatformInfo = {
  id: PlatformId
  iconType: IconType
  title: string
  shortTitle: string
  beta?: boolean
}

const platforms: PlatformInfo[] = [
  {
    id: `aws`,
    iconType: `logoAWS`,
    title: `Amazon Web Services`,
    shortTitle: `AWS`,
  },
  {
    id: `azure`,
    iconType: `logoAzure`,
    title: `Azure`,
    shortTitle: `Azure`,
  },
  {
    id: `gcp`,
    iconType: `logoGCP`,
    title: `Google Cloud`,
    shortTitle: `GCP`,
  },
  {
    id: `ibm`,
    iconType: `logoIBM`,
    title: `IBM Cloud`,
    shortTitle: `IBM`,
  },
  {
    id: `local`,
    iconType: `empty`,
    title: `Local`,
    shortTitle: `Local`,
  },
]

export function getPlatform(regionId?: string | null): PlatformId {
  const defaultPlatform = `aws`

  if (!regionId) {
    return defaultPlatform
  }

  const regionPrefix = regionId.split(`-`)[0]

  switch (regionPrefix) {
    case `azure`:
      return `azure`
    case `gcp`:
      return `gcp`
    case `ibm`:
      return `ibm`
    case `local`:
      return `local`
    default:
      return defaultPlatform
  }
}

export function getPlatformInfoById(platformId: PlatformId): PlatformInfo {
  return platforms.find(({ id }) => id === platformId) || platforms[0]
}

export function getPlatformNameByRegionId(regionId?: string | null): string {
  const platformId = getPlatform(regionId)
  const platform = getPlatformInfoById(platformId)
  return platform.title
}

export function getShortPlatformNameByRegionId(regionId?: string | null): string {
  const platformId = getPlatform(regionId)
  const platform = getPlatformInfoById(platformId)
  return platform.shortTitle
}
