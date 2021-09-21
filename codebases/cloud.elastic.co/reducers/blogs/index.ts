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

import { FETCH_BLOGS } from '../../constants/actions'
import { Post } from '../../lib/api/v1/types'
import { AsyncAction } from '../../types'

export type State = Post[]

type FetchBlogsAction = AsyncAction<typeof FETCH_BLOGS, Post[]>

export default function cloudStatusReducer(state: State = [], action: FetchBlogsAction): State {
  if (action.type === FETCH_BLOGS) {
    if (!action.error && action.payload) {
      return action.payload
    }
  }

  return state
}

export function getBlogs(state: State) {
  return state
}
