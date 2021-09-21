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

import { get, orderBy } from 'lodash'

import { FETCH_FEED } from '../../constants/actions'

import { replaceIn } from '../../lib/immutability-helpers'

export interface State {
  [feed: string]: {
    [version: string]: Feeds
  }
}

type FeedsResponse = {
  items: Feeds
}

export type Feeds = Array<{
  title: { en: string }
  link_url: string
  hash: string
  [key: string]: string | { en: string }
}>

type FetchAction = {
  type: 'FETCH_FEED'
  error: Error | null
  payload: FeedsResponse | null
  meta: {
    feed: string
    version: string
  }
}

export default function feedsReducer(state: State = {}, action: FetchAction): State {
  if (action.type === FETCH_FEED) {
    if (action.payload && !action.error) {
      const { feed, version } = action.meta

      return replaceIn(state, [feed, version], action.payload.items)
    }
  }

  return state
}

export const getFeed = (state, feed, version) => get(state, [feed, version], [])

export const getOrderedFeed = (state, feed, version, cropAt) => {
  if (!state[feed]) {
    return []
  }

  const unorderedFeed = state[feed][version]

  if (!unorderedFeed) {
    return []
  }

  const orderedFeed = orderBy(unorderedFeed, ['publish_on'], ['asc'])

  if (!cropAt) {
    return orderedFeed
  }

  return orderedFeed.slice(0, cropAt)
}

export function getLang(obj, lang) {
  return obj[lang] ? obj[lang] : obj.en
}
