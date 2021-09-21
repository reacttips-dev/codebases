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

import asyncRequest from '../asyncRequests'

import {
  CREATE_RESOURCE_COMMENT,
  DELETE_RESOURCE_COMMENT,
  FETCH_RESOURCE_COMMENTS,
  UPDATE_RESOURCE_COMMENT,
} from '../../constants/actions'

import {
  createCommentUrl,
  deleteCommentUrl,
  listCommentUrl,
  updateCommentUrl,
} from '../../lib/api/v1/urls'

import { ResourceComment, ResourceCommentType } from '../../types'

interface BaseParams {
  regionId: string
  resourceType: ResourceCommentType
  resourceId: string
}

interface CreateParams extends BaseParams {
  message: string
}

interface UpdateParams extends BaseParams {
  comment: ResourceComment
  message: string
}

interface DeleteParams extends BaseParams {
  comment: ResourceComment
}

export function fetchResourceComments({ regionId, resourceType, resourceId }: BaseParams) {
  const url = listCommentUrl({
    regionId,
    resourceType,
    resourceId,
  })

  return asyncRequest({
    type: FETCH_RESOURCE_COMMENTS,
    url,
    meta: { regionId, resourceType, resourceId },
    crumbs: [regionId, resourceType, resourceId],
  })
}

export function createResourceComment({
  regionId,
  resourceType,
  resourceId,
  message,
}: CreateParams) {
  const url = createCommentUrl({
    regionId,
    resourceType,
    resourceId,
  })

  return asyncRequest({
    type: CREATE_RESOURCE_COMMENT,
    method: `POST`,
    url,
    payload: {
      message,
    },
    meta: { regionId, resourceType, resourceId },
    crumbs: [regionId, resourceType, resourceId],
    includeHeaders: true,
  })
}

export function updateResourceComment({
  regionId,
  resourceType,
  resourceId,
  comment,
  message,
}: UpdateParams) {
  const { id: commentId, version } = comment

  const url = updateCommentUrl({
    regionId,
    resourceType,
    resourceId,
    commentId,
    version,
  })

  return asyncRequest({
    type: UPDATE_RESOURCE_COMMENT,
    method: `PUT`,
    url,
    payload: {
      message,
    },
    meta: { regionId, resourceType, resourceId, originalComment: comment },
    crumbs: [regionId, resourceType, resourceId, commentId],
    includeHeaders: true,
  })
}

export function deleteResourceComment({
  regionId,
  resourceType,
  resourceId,
  comment,
}: DeleteParams) {
  const { id: commentId, version } = comment

  const url = deleteCommentUrl({
    regionId,
    resourceType,
    resourceId,
    commentId,
    version,
  })

  return asyncRequest({
    type: DELETE_RESOURCE_COMMENT,
    method: `DELETE`,
    url,
    meta: { regionId, resourceType, resourceId, originalComment: comment },
    crumbs: [regionId, resourceType, resourceId, commentId],
  })
}
