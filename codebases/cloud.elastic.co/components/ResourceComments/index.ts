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

import { connect } from 'react-redux'

import ResourceComments from './ResourceComments'

import {
  createResourceComment,
  deleteResourceComment,
  fetchResourceComments,
  updateResourceComment,
} from '../../actions/resourceComments'

import {
  createResourceCommentRequest,
  deleteResourceCommentRequest,
  fetchResourceCommentsRequest,
  getResourceComments,
  updateResourceCommentRequest,
} from '../../reducers'

import { isFeatureActivated } from '../../selectors'

import { SAD_getAuthTokenUsername } from '../../lib/auth'

import { AsyncRequestState, ResourceComment, ResourceCommentType, RegionId } from '../../types'
import Feature from '../../lib/feature'

type StateProps = {
  comments: ResourceComment[] | null
  createResourceCommentRequest: AsyncRequestState
  fetchResourceCommentsRequest: AsyncRequestState
  getDeleteResourceCommentRequest: (commentId: string) => AsyncRequestState
  getUpdateResourceCommentRequest: (commentId: string) => AsyncRequestState
  showResourceComments: boolean
  usernameFromToken: string | null
}

type DispatchProps = {
  fetchResourceComments: () => Promise<any>
  createResourceComment: (createParams: { message: string }) => Promise<any>
  updateResourceComment: (updateParams: {
    comment: ResourceComment
    message: string
  }) => Promise<any>
  deleteResourceComment: (deleteParams: { comment: ResourceComment }) => Promise<any>
}

type ConsumerProps = {
  regionId: RegionId
  resourceType: ResourceCommentType
  resourceId: string
}

const mapStateToProps = (
  state,
  { regionId, resourceType, resourceId }: ConsumerProps,
): StateProps => ({
  showResourceComments: isFeatureActivated(state, Feature.resourceComments),
  usernameFromToken: SAD_getAuthTokenUsername(),
  comments: getResourceComments(state, regionId, resourceType, resourceId),
  fetchResourceCommentsRequest: fetchResourceCommentsRequest(
    state,
    regionId,
    resourceType,
    resourceId,
  ),
  createResourceCommentRequest: createResourceCommentRequest(
    state,
    regionId,
    resourceType,
    resourceId,
  ),
  getUpdateResourceCommentRequest: (commentId) =>
    updateResourceCommentRequest(state, regionId, resourceType, resourceId, commentId),
  getDeleteResourceCommentRequest: (commentId) =>
    deleteResourceCommentRequest(state, regionId, resourceType, resourceId, commentId),
})

const mapDispatchToProps = (
  dispatch,
  { regionId, resourceType, resourceId }: ConsumerProps,
): DispatchProps => ({
  fetchResourceComments: () =>
    dispatch(fetchResourceComments({ regionId, resourceType, resourceId })),
  createResourceComment: ({ message }) =>
    dispatch(createResourceComment({ regionId, resourceType, resourceId, message })),
  updateResourceComment: ({ comment, message }) =>
    dispatch(updateResourceComment({ regionId, resourceType, resourceId, comment, message })),
  deleteResourceComment: ({ comment }) =>
    dispatch(deleteResourceComment({ regionId, resourceType, resourceId, comment })),
})

export default connect<StateProps, DispatchProps, ConsumerProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ResourceComments)
