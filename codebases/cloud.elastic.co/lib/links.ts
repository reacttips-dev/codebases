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

import { get, has } from 'lodash'
import invariant from 'invariant'
import urlTemplate from 'url-template'
import { parse } from 'url'

import { RootConfig, RootHrefName, ElasticsearchCluster, Region } from '../types'

type ElasticsearchClusterHrefName = keyof ElasticsearchCluster['hrefs']
type RegionHrefName = keyof Region['hrefs']
type HrefName = RootHrefName | ElasticsearchClusterHrefName | RegionHrefName

type ObjectWithHrefs = RootConfig | ElasticsearchCluster | Region

const isHttps = window.location.protocol === `https:`

export function getLink(
  objectWithHrefs: RootConfig,
  name: RootHrefName,
  params?: { [key: string]: string | number },
): string
export function getLink(
  objectWithHrefs: Region,
  name: RegionHrefName,
  params?: { [key: string]: string | number },
): string
export function getLink(
  objectWithHrefs: ElasticsearchCluster,
  name: ElasticsearchClusterHrefName,
  params?: { [key: string]: string | number },
): string
export function getLink(
  objectWithHrefs: ObjectWithHrefs,
  name: HrefName,
  params?: { [key: string]: string | number },
): string {
  return dropHost(transformHref(getHref(objectWithHrefs, name, params)))
}

export function can(objectWithHrefs: RootConfig, name: RootHrefName): boolean
export function can(objectWithHrefs: Region, name: RegionHrefName): boolean
export function can(
  objectWithHrefs: ElasticsearchCluster,
  name: ElasticsearchClusterHrefName,
): boolean
export function can(objectWithHrefs: ObjectWithHrefs, name: HrefName): boolean {
  return has(objectWithHrefs, [`hrefs`, name])
}

// API returns absolute `links`, but we want to use the local proxy
// Local proxy sets the `host` header and forwards cookies
function dropHost(href: string) {
  const parsedUrl = parse(href)
  const { path, hash } = parsedUrl

  return `${path || ``}${hash || ``}`
}

function transformHref(href: string) {
  return isHttps && !href.startsWith(`https:`) ? href.replace(`http:`, `https:`) : href
}

function getHref(
  objectWithHrefs: ObjectWithHrefs,
  name: HrefName,
  params?: { [key: string]: string | number },
): string {
  const link = get(objectWithHrefs, [`hrefs`, name])

  invariant(
    link !== undefined,
    `Link to "${name}" not defined in: ${JSON.stringify(objectWithHrefs)}`,
  )

  // If params are defined we treat the href as an URI template (RFC 6570)
  if (params !== undefined) {
    return urlTemplate.parse(link).expand(params)
  }

  return link
}
