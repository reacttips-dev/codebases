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

import { getDisplayName, getDisplayId } from '../../../lib/stackDeployments/selectors'

import { RefinedSearchResult } from '../../../types'

import { DeploymentSearchResponse } from '../../../lib/api/v1/types'

const searchResultTitleFields = {
  _default: `id`,
  runner: `runner_id`,
  allocator: `allocator_id`,
  deployment: `name`,
  elasticsearch: `cluster_name`,
  kibana: `cluster_name`,
  apm: `name`,
  appsearch: `name`,
}

export function getTitleField(searchResult: RefinedSearchResult): string {
  return searchResultTitleFields[searchResult.kind] || searchResultTitleFields._default
}

export function hasHighlightedTitle(searchResult: RefinedSearchResult): boolean {
  return Boolean(getHighlightedTitle(searchResult))
}

export function getTitleParts(searchResult: RefinedSearchResult) {
  const highlightedTitle = getHighlightedTitle(searchResult)
  const unhighlightedTitle = getUnhighlightedTitle(searchResult)
  const unwrappedSubtitle = getSubtitle(searchResult)
  const title = highlightedTitle || unhighlightedTitle
  const subtitle = unwrappedSubtitle ? `(${unwrappedSubtitle})` : null

  return { title, subtitle }
}

function getHighlightedTitle(searchResult: RefinedSearchResult): string | null {
  const { highlighting } = searchResult
  const titleField = getTitleField(searchResult)

  if (highlighting && highlighting[titleField]) {
    return highlighting[titleField].join(` `)
  }

  return null
}

function getUnhighlightedTitle(searchResult: RefinedSearchResult): string {
  const titleField = getTitleField(searchResult)

  if (searchResult.kind === `allocator` || searchResult.kind === `runner`) {
    return searchResult.id
  }

  if (searchResult.kind === `deployment`) {
    return getDisplayName({ deployment: searchResult.info as DeploymentSearchResponse })
  }

  const titleFieldValue = searchResult.info[titleField]

  if (typeof titleFieldValue === `string`) {
    return titleFieldValue
  }

  return searchResult.id.slice(0, 6)
}

function getSubtitle(searchResult: RefinedSearchResult): string | null {
  const unhighlightedTitle = getUnhighlightedTitle(searchResult)

  if (searchResult.kind === `allocator` || searchResult.kind === `runner`) {
    return searchResult.region
  }

  if (searchResult.kind === `deployment`) {
    return getDisplayId({ deployment: searchResult.info as DeploymentSearchResponse })
  }

  const shortId = searchResult.id.slice(0, 6)

  if (unhighlightedTitle.startsWith(shortId)) {
    return null
  }

  return shortId
}
