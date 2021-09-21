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

import { difference, orderBy } from 'lodash'

import {
  CREATE_RESOURCE_COMMENT,
  DELETE_RESOURCE_COMMENT,
  FETCH_RESOURCE_COMMENTS,
  UPDATE_RESOURCE_COMMENT,
} from '../../constants/actions'

import { Comment, CommentsWithMetas, CommentWithMeta } from '../../lib/api/v1/types'
import { AsyncAction, ResourceComment } from '../../types'

type ResourceState = ResourceComment[] | null

export interface State {
  [key: string]: ResourceState
}

interface CommonMeta {
  regionId: string
  resourceType: string
  resourceId: string
}

interface UpdateMeta {
  originalComment: ResourceComment
}

interface Headers {
  'x-cloud-resource-version.raw': string | undefined
  'x-cloud-resource-created': Date | undefined
  'x-cloud-resource-last-modified': Date | undefined
}

interface FetchAction extends AsyncAction<typeof FETCH_RESOURCE_COMMENTS, CommentsWithMetas> {
  meta: CommonMeta
}

interface CreateAction extends AsyncAction<typeof CREATE_RESOURCE_COMMENT, Comment> {
  meta: CommonMeta & Headers
}

interface DeleteAction extends AsyncAction<typeof DELETE_RESOURCE_COMMENT> {
  meta: CommonMeta & UpdateMeta
}

interface UpdateAction extends AsyncAction<typeof UPDATE_RESOURCE_COMMENT, Comment> {
  meta: CommonMeta & UpdateMeta & Headers
}

type Action = FetchAction | CreateAction | DeleteAction | UpdateAction

export default function resourcesCommentsReducer(state: State = {}, action: Action): State {
  if (
    action.type === FETCH_RESOURCE_COMMENTS ||
    action.type === CREATE_RESOURCE_COMMENT ||
    action.type === DELETE_RESOURCE_COMMENT ||
    action.type === UPDATE_RESOURCE_COMMENT
  ) {
    const { regionId, resourceType, resourceId } = action.meta
    const descriptor = createDescriptor(regionId, resourceType, resourceId)

    return {
      ...state,
      [descriptor]: resourceCommentsReducer(state[descriptor], action),
    }
  }

  return state
}

export function getResourceComments(
  state: State,
  regionId: string,
  resourceType: string,
  resourceId: string,
) {
  return state[createDescriptor(regionId, resourceType, resourceId)]
}

function resourceCommentsReducer(state: ResourceState = null, action: Action): ResourceState {
  if (action.type === FETCH_RESOURCE_COMMENTS) {
    if (!action.error && action.payload) {
      const { values } = action.payload
      return sortComments(values.map(createComment))
    }
  }

  if (action.type === CREATE_RESOURCE_COMMENT) {
    if (!action.error && action.payload) {
      const comment = action.payload as Comment
      const headers = action.meta as Headers

      return sortComments([
        ...(state || []),
        createComment({
          comment,
          metadata: {
            created_time: (headers[`x-cloud-resource-created`] ?? new Date()).toISOString(),
            modified_time: (headers[`x-cloud-resource-last-modified`] ?? new Date()).toISOString(),
            version: headers[`x-cloud-resource-version.raw`] ?? ``,
          },
        }),
      ])
    }
  }

  if (action.type === UPDATE_RESOURCE_COMMENT) {
    if (!action.error && action.payload) {
      const comment = action.payload as Comment
      const { originalComment } = action.meta
      const headers = action.meta as Headers

      return sortComments([
        ...difference(state, [originalComment]),
        createComment({
          comment,
          metadata: {
            created_time: (
              headers[`x-cloud-resource-created`] ?? originalComment.created
            ).toISOString(),
            modified_time: (headers[`x-cloud-resource-last-modified`] ?? new Date()).toISOString(),
            version: headers[`x-cloud-resource-version.raw`] ?? originalComment.version,
          },
        }),
      ])
    }
  }

  if (action.type === DELETE_RESOURCE_COMMENT) {
    if (!action.error && action.payload) {
      const { originalComment } = action.meta
      return sortComments(difference(state, [originalComment]))
    }
  }

  return state
}

function sortComments(comments: ResourceComment[]) {
  return orderBy(comments, [`created`], [`desc`])
}

function createComment({ comment, metadata }: CommentWithMeta): ResourceComment {
  const { id, user_id, message } = comment
  const { created_time, modified_time, version } = metadata

  const created = new Date(created_time)
  const modified = new Date(modified_time)

  return {
    id,
    userId: user_id,
    message,
    created,
    modified,
    version,
  }
}

function createDescriptor(regionId: string, resourceType: string, resourceId: string) {
  return `${regionId}/${resourceType}/${resourceId}`
}
