/* eslint-disable no-param-reassign */
import Immutable from 'immutable'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as jsonReducer from '../reducers/json'

const methods = {}

methods.updatePostLoves = (state, action) => {
  const { method, model } = action.payload

  const newPost = {
    id: model ? model.get('id') : '',
  }

  let delta = 0
  let idAdded = false
  switch (action.type) {
    case ACTION_TYPES.POST.LOVE_REQUEST:
      if (method === 'POST') {
        delta = 1
        newPost.loved = true
      } else {
        delta = -1
        newPost.loved = false
      }
      break
    case ACTION_TYPES.POST.LOVE_SUCCESS:
      if (method === 'POST') {
        newPost.showLovers = true
        idAdded = true
      } else {
        newPost.showLovers = false
      }
      break
    case ACTION_TYPES.POST.LOVE_FAILURE:
      if (method === 'POST') {
        delta = -1
        newPost.loved = false
      } else {
        delta = 1
        newPost.loved = true
        idAdded = true
      }
      break
    default:
      return state
  }

  // since we pull `model` out of payload, not state, we don't want to set
  // or update the lovesCount during a LOVE_SUCCESS.
  //
  // During LOVE_REQUEST, model.lovesCount is incremented.
  // In LOVE_SUCCESS, model.lovesCount is the *old* value, so just ignore it.
  if (delta !== 0) {
    newPost.lovesCount = Number(model.get('lovesCount')) + delta
  }

  const resultPath = jsonReducer.methods.pagesKey(action)
  const currentUser = jsonReducer.methods.getCurrentUser(state)
  if (currentUser) {
    state = idAdded ?
      jsonReducer.methods.appendPageId(state, resultPath, MAPPING_TYPES.USERS, currentUser.get('id')) :
      jsonReducer.methods.removePageId(state, resultPath, currentUser.get('id'))
  }

  if (currentUser.get('id') === model.get('authorId')) {
    state = jsonReducer.methods.updateUserCount(state, model.get('authorId'), 'lovesCount', delta)
  }
  return jsonReducer.methods.mergeModel(state, MAPPING_TYPES.POSTS, newPost)
}

methods.updatePostWatch = (state, action) => {
  const { method, model, hasAutoWatchEnabled } = action.payload
  let isWatching = false

  if (method === 'POST') {
    isWatching = action.type === ACTION_TYPES.POST.WATCH_SUCCESS ? true : hasAutoWatchEnabled
  }

  const newPost = {
    id: model ? model.get('id') : '',
    watching: isWatching,
  }
  if (action.type === ACTION_TYPES.POST.WATCH_FAILURE) {
    newPost.watching = !method === 'POST'
  }
  return jsonReducer.methods.mergeModel(state, MAPPING_TYPES.POSTS, newPost)
}

methods.addOrUpdatePost = (state, action) => {
  const { model, response } = action.payload
  const user = model ?
    state.getIn([MAPPING_TYPES.USERS, model.get('authorId')]) :
    jsonReducer.methods.getCurrentUser(state)
  switch (action.type) {
    case ACTION_TYPES.POST.CREATE_SUCCESS:
    case ACTION_TYPES.POST.UPDATE_SUCCESS:
      state = state.setIn(
        [MAPPING_TYPES.POSTS, response[MAPPING_TYPES.POSTS].id],
        Immutable.fromJS(response[MAPPING_TYPES.POSTS]),
      )
      if (action.type === ACTION_TYPES.POST.UPDATE_SUCCESS) { return state }
      state = jsonReducer.methods.appendPageId(
        state,
        '/following',
        MAPPING_TYPES.POSTS,
        response[MAPPING_TYPES.POSTS].id,
      )

      if (action.meta.repostId) {
        state = jsonReducer.methods.updatePostCount(state, action.meta.repostId, 'repostsCount', 1)
        state = jsonReducer.methods.appendPageId(
          state,
          `/posts/${action.meta.repostId}/repost`,
          MAPPING_TYPES.USERS,
          user.get('id'),
        )
        state = jsonReducer.methods.mergeModel(
          state,
          MAPPING_TYPES.POSTS,
          { id: action.meta.repostId, reposted: true, showReposters: true },
        )
      }
      if (action.meta.repostedFromId) {
        state = jsonReducer.methods.updatePostCount(state, action.meta.repostedFromId, 'repostsCount', 1)
        state = jsonReducer.methods.appendPageId(
          state,
          `/posts/${action.meta.repostedFromId}/repost`,
          MAPPING_TYPES.USERS,
          user.get('id'),
        )
        state = jsonReducer.methods.mergeModel(
          state,
          MAPPING_TYPES.POSTS,
          { id: action.meta.repostedFromId, reposted: true },
        )
      }
      if (user) {
        state = jsonReducer.methods.updateUserCount(state, user.get('id'), 'postsCount', 1)
        state = jsonReducer.methods.appendPageId(
          state,
          `/${user.get('username')}`,
          MAPPING_TYPES.POSTS,
          response[MAPPING_TYPES.POSTS].id,
        )
      }
      return state
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      if (user) {
        state = jsonReducer.methods.removePageId(state, '/following', model.get('id'))
        state = jsonReducer.methods.removePageId(state, `/${user.get('username')}`, model.get('id'))
        state = jsonReducer.methods.updateUserCount(state, user.get('id'), 'postsCount', -1)
      }
      return state
    case ACTION_TYPES.POST.CREATE_FAILURE:
      if (user) {
        state = jsonReducer.methods.updateUserCount(state, user.get('id'), 'postsCount', -1)
      }
      return state
    default:
      return state
  }
}

methods.toggleComments = (state, action) => {
  const { model, showComments } = action.payload
  return state.setIn([MAPPING_TYPES.POSTS, model.get('id'), 'showComments'], showComments)
}

methods.toggleEditing = (state, action) => {
  const { model, isEditing } = action.payload
  return state.setIn([MAPPING_TYPES.POSTS, model.get('id'), 'isEditing'], isEditing)
}

methods.toggleReposting = (state, action) => {
  const { model, isReposting } = action.payload
  return state.setIn([MAPPING_TYPES.POSTS, model.get('id'), 'isReposting'], isReposting)
}

export default methods
