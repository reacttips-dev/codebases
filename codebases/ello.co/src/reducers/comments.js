/* eslint-disable no-param-reassign */
import Immutable from 'immutable'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as jsonReducer from '../reducers/json'
import postMethods from './posts'

const methods = {}

methods.updateCommentsCount = (state, postId, delta) => {
  const commentCount = state.getIn([MAPPING_TYPES.POSTS, postId, 'commentsCount'])
  return jsonReducer.methods.mergeModel(
    state,
    MAPPING_TYPES.POSTS,
    {
      id: postId,
      commentsCount: Number(commentCount) + delta,
    },
  )
}

methods.addOrUpdateComment = (state, action) => {
  const { hasAutoWatchEnabled, model, postId, response } = action.payload
  const post = state.getIn([MAPPING_TYPES.POSTS, postId])
  let index = null
  switch (action.type) {
    case ACTION_TYPES.COMMENT.CREATE_REQUEST:
      if (!hasAutoWatchEnabled) { return state }
      return postMethods.updatePostWatch(state, {
        payload: { method: 'POST', model: post, hasAutoWatchEnabled },
      })
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
    case ACTION_TYPES.COMMENT.UPDATE_SUCCESS:
      state = state.setIn(
        [MAPPING_TYPES.COMMENTS, response[MAPPING_TYPES.COMMENTS].id],
        Immutable.fromJS(response[MAPPING_TYPES.COMMENTS]),
      )
      if (action.type === ACTION_TYPES.COMMENT.UPDATE_SUCCESS) { return state }
      // update post watching prop
      if (hasAutoWatchEnabled) {
        state = postMethods.updatePostWatch(state, { payload: { method: 'POST', model: post }, type: ACTION_TYPES.POST.WATCH_SUCCESS })
      }
      // add the comment to the linked array
      if (!post.getIn(['links', 'comments'], Immutable.List()).isEmpty()) {
        state = state.setIn(
          [MAPPING_TYPES.POSTS, postId, 'links', 'comments', 'ids'],
          post.getIn(['links', 'comments', 'ids']).unshift(`${response[MAPPING_TYPES.COMMENTS].id}`),
        )
      }
      state = jsonReducer.methods.appendPageId(
        state, `/posts/${postId}/comments`,
        MAPPING_TYPES.COMMENTS, response[MAPPING_TYPES.COMMENTS].id)
      return methods.updateCommentsCount(state, postId, 1)
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      // delete the comment from the linked array
      if (!post.getIn(['links', 'comments'], Immutable.List()).isEmpty()) {
        index = post.links.comments.ids.indexOf(`${model.get('id')}`)
        if (index > -1) {
          state = state.setIn(
            [MAPPING_TYPES.POSTS, postId, 'links', 'comments', 'ids'],
            post.getIn(['links', 'comments', 'ids']).splice(index, 1),
          )
        }
      }
      state = jsonReducer.methods.removePageId(state, `/posts/${postId}/comments`, model.get('id'))
      return methods.updateCommentsCount(state, postId, -1)
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
      state = postMethods.updatePostWatch(state, {
        payload: { method: 'DELETE', model: post },
      })
      return methods.updateCommentsCount(state, postId, -1)
    default:
      return state
  }
}

methods.toggleEditing = (state, action) => {
  const { model, isEditing } = action.payload
  return state.setIn([MAPPING_TYPES.COMMENTS, model.get('id'), 'isEditing'], isEditing)
}

export default methods
