/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import Immutable from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import { REHYDRATE } from 'redux-persist/constants'
import { camelize } from 'humps'
import get from 'lodash/get'
import union from 'lodash/union'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../constants/relationship_types'
import { findModel } from '../helpers/json_helper'
import commentMethods from './comments'
import postMethods from './posts'
import relationshipMethods from './relationships'
import v3Reducer from './v3_reducer'

const { OrderedSet } = Immutable;

// adding methods and accessing them from this object
// allows the unit tests to stub methods in this module
const methods = {}
let path = '/'
let hasLoadedFirstStream = false
let dupArr = []

const initialState = Immutable.Map({
  pages: Immutable.Map(),
})

export function emptyPagination() {
  return Immutable.Map({
    totalPages: 0,
    totalPagesRemaining: 0,
  })
}

methods.addNewIdsToResult = (state, action) => {
  const resultKey = get(action, 'payload.resultKey', path)
  let result = state.getIn([MAPPING_TYPES.PAGES, resultKey])
  if (!result || !result.get('morePostIds')) { return state }
  if (Immutable.OrderedSet.isOrderedSet(result.get('morePostIds'))) {
    const s1 = state.updateIn([MAPPING_TYPES.PAGES, resultKey, 'ids'], existing =>
      result.get('morePostIds').concat(existing),
    )
    return s1.deleteIn([MAPPING_TYPES.PAGES, resultKey, 'morePostIds'])
  }
  // if you have created a post it gets prepended to the result ids
  // when we come back with additional ids we want them to be unique
  // and in descending order, which fills in the gaps and is what union does
  // unfortunately it is not very performant to use the `toArray`
  result = result.set('ids', Immutable.List(union(result.get('morePostIds').toArray(), result.get('ids').toArray()))).delete('morePostIds')
  return state.setIn([MAPPING_TYPES.PAGES, resultKey], result)
}

methods.updateUserCount = (state, userId, prop, delta) => {
  const count = state.getIn([MAPPING_TYPES.USERS, userId, prop], 0)
  if (count === '∞') { return state }
  return state.setIn([MAPPING_TYPES.USERS, userId, prop], parseInt(count, 10) + delta)
}

methods.updatePostCount = (state, postId, prop, delta) => {
  const count = state.getIn([MAPPING_TYPES.POSTS, postId, prop], 0)
  if (count === '∞') { return state }
  return state.setIn([MAPPING_TYPES.POSTS, postId, prop], parseInt(count, 10) + delta)
}

methods.appendPageId = (state, pageName, mappingType, id) => {
  const page = state.getIn([MAPPING_TYPES.PAGES, pageName])
  if (page) {
    const ids = page.get('ids', Immutable.List())
    if (!ids.includes(`${id}`)) {
      const newIds = OrderedSet.isOrderedSet(ids) ? OrderedSet([`${id}`]).merge(ids) :
        ids.unshift(`${id}`)
      return state.setIn([MAPPING_TYPES.PAGES, pageName, 'ids'], newIds)
    }
  }
  return state.setIn([MAPPING_TYPES.PAGES, pageName], Immutable.fromJS({
    ids: [`${id}`], type: mappingType, pagination: emptyPagination(),
  }))
}

methods.removePageId = (state, pageName, id) => {
  let existingIds = state.getIn([MAPPING_TYPES.PAGES, pageName, 'ids'])
  if (existingIds && OrderedSet.isOrderedSet(existingIds)) {
    return state.setIn([MAPPING_TYPES.PAGES, pageName, 'ids'], existingIds.delete(`${id}`))
  } else if (existingIds) {
    const index = existingIds.indexOf(`${id}`)
    if (index !== -1) {
      existingIds = existingIds.splice(index, 1)
      return state.setIn([MAPPING_TYPES.PAGES, pageName, 'ids'], existingIds)
    }
  }
  return state
}

function normalizePostContentRegion(model, field, state) {
  return model.get(field, Immutable.List()).map((region, index) => {
    const id = `${model.get('id')}-${index}`
    const assetId = region.getIn(['links', 'assets'])
    if (region.get('kind') === 'image' && assetId) {
      const asset = state.getIn(['assets', assetId])
      if (asset) {
        return region.merge({ id, asset })
      }
    }
    return region.merge({ id })
  })
}

function normalizeModel(type, model, state) {
  if (type === MAPPING_TYPES.POSTS) {
    return model.merge({
      content: normalizePostContentRegion(model, 'content', state),
      summary: normalizePostContentRegion(model, 'summary', state),
      repostContent: normalizePostContentRegion(model, 'repostContent', state),
    })
  } else if (type === 'categoryUsers') {
    const categoryId = model.getIn(['links', 'category', 'id'])
    const category = state.getIn(['categories', categoryId])
    return model.merge({
      categoryId,
      categoryName: category.get('name'),
      categorySlug: category.get('slug'),
      userId: model.getIn(['links', 'user', 'id']),
      role: model.get('role').toUpperCase(),
    })
  } else if (type === MAPPING_TYPES.COMMENTS) {
    return model.merge({
      content: normalizePostContentRegion(model, 'content', state),
    })
  }
  return model
}

methods.mergeModel = (state, type, params) => {
  if (!params.id) { return state }

  // make the model's id a string for later comparisons
  // the API sent them back as a number at one point
  params.id = `${params.id}`
  return state.setIn(
    [type, params.id],
    normalizeModel(type, state.getIn([type, params.id], Immutable.Map()).mergeDeep(params), state),
  )
}

methods.addModels = (state, type, data) => {
  // add state['modelType']
  const camelType = camelize(type)
  let ids = Immutable.List()
  if (!data[camelType]) { return { ids, state } }

  // need to clobber the invite submissions since we want to replace
  // their actions and not merge them with what we had previously
  if (type === MAPPING_TYPES.ARTIST_INVITE_SUBMISSIONS) {
    if (data[camelType].length) {
      // add arrays of models to state['modelType']['id']
      data[camelType].forEach((item) => {
        const id = `${item.id}`
        state = state.setIn([camelType, id], Immutable.fromJS(item))
        ids = ids.push(id)
      })
    } else if (typeof data[camelType] === 'object') {
      // add single model objects to state['modelType']['id']
      const model = data[camelType]
      const id = `${model.id}`
      state = state.setIn([camelType, id], Immutable.fromJS(model))
      ids = ids.push(id)
    }
  } else if (type === MAPPING_TYPES.CATEGORIES || type === MAPPING_TYPES.PAGE_PROMOTIONALS) {
    data[camelType].forEach((item) => {
      const id = `${item.id}`
      state = state.setIn(
        [camelType, id],
        state.getIn([camelType, id], Immutable.Map()).mergeDeep(item),
      )
      ids = ids.push(id)
    })
  } else if (data[camelType].length) {
    // add arrays of models to state['modelType']['id']
    data[camelType].forEach((model) => {
      state = methods.mergeModel(state, camelType, model)
      ids = ids.push(`${model.id}`)
    })
  } else if (typeof data[camelType] === 'object') {
    // add single model objects to state['modelType']['id']
    const model = data[camelType]
    state = methods.mergeModel(state, camelType, model)
    ids = ids.push(`${model.id}`)
  }
  return { ids, state }
}

// parses the 'linked' node of the JSON
// api responses into the json store
methods.parseLinked = (linked, state) => {
  if (!linked) { return state }
  Object.keys(linked).forEach((linkedType) => {
    state = methods.addModels(state, linkedType, linked).state
  })
  return state
}

// parse main part of request into the state and
// pull out the ids as this is the main payload
methods.getResult = (response, state, action) => {
  const { mappingType, resultFilter } = action.meta
  const { ids, state: newState } = methods.addModels(state, mappingType, response)
  // set the result to the resultFilter if it exists
  const result = (typeof resultFilter === 'function') ? resultFilter(response[mappingType]) : { type: mappingType, ids }
  result.pagination = action.payload.pagination
  return { newState, result: Immutable.fromJS(result) }
}

methods.getCurrentUser = state =>
  state.get(MAPPING_TYPES.USERS).find(user =>
    user.get('relationshipPriority') === RELATIONSHIP_PRIORITY.SELF,
  )

methods.findPostFromIdOrToken = (state, postIdOrToken) =>
  state.getIn(
    [MAPPING_TYPES.POSTS, postIdOrToken],
    findModel(state, {
      collection: MAPPING_TYPES.POSTS,
      findObj: { token: postIdOrToken },
    }),
  )

// This method updates comment postIds to be the id of the post that was
// requesting the comments. This is due to the fact that a comment can get
// added to the original post, a repost of it, or a repost of a repost of it.
// This way the comment will always have a post that we have loaded client
// side to reference from.
methods.addParentPostIdToComments = (response, state, action) => {
  const mappingType = get(action, 'meta.mappingType')
  if (mappingType !== MAPPING_TYPES.COMMENTS) { return response }
  const { postIdOrToken } = action.payload
  if (postIdOrToken) {
    const post = methods.findPostFromIdOrToken(state, postIdOrToken)
    if (post) {
      const newResponse = { ...response }
      newResponse[mappingType] = response[mappingType].map((model) => {
        // need this to determine if a user can
        // delete comments on their own repost
        model.originalPostId = model.postId
        model.postId = post.get('id')
        return model
      })
      return newResponse
    }
  }
  return response
}

methods.setLayoutMode = (action, state) => {
  const result = state.getIn([MAPPING_TYPES.PAGES, path])
  if (!result || (result.get('mode') === action.payload.mode)) { return state }
  return state.setIn([MAPPING_TYPES.PAGES, path, 'mode'], action.payload.mode)
}

methods.pagesKey = action =>
  get(action, 'meta.resultKey', get(action, 'payload.pathname', path))

function removeDuplicates(value) {
  if (dupArr.includes(value)) {
    return false
  }
  dupArr.push(value)
  return true
}

// look at json_test to see more documentation for what happens in here
methods.updateResult = (response, state, action) => {
  const { newState, result } = methods.getResult(response, state, action)
  state = newState
  const resultPath = methods.pagesKey(action)
  const existingResult = state.getIn([MAPPING_TYPES.PAGES, resultPath])
  if (existingResult) {
    if (action.type === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS) {
      dupArr = []
      return state.setIn([MAPPING_TYPES.PAGES, resultPath], result.set('ids', existingResult.get('ids', Immutable.List()).concat(result.get('ids')).filter(removeDuplicates)))
    } else if (existingResult.get('ids').isSuperset(result.get('ids'))) {
      return state
    } else if ((!existingResult.get('ids').includes(result.get('ids').last()) && existingResult.get('morePostIds', Immutable.List()).isEmpty()) ||
              (!existingResult.get('morePostIds', Immutable.List()).isEmpty() && !existingResult.get('morePostIds').includes(result.get('ids').last()))) {
      return state.setIn([MAPPING_TYPES.PAGES, resultPath], result)
    } else if (hasLoadedFirstStream && !get(action, 'meta.mergeResults')) {
      if (!existingResult.get('morePostIds', Immutable.List()).isEmpty()) {
        dupArr = []
        return state.setIn(
          [MAPPING_TYPES.PAGES, resultPath, 'morePostIds'],
          Immutable.List(union(result.get('ids').toArray(), existingResult.get('morePostIds').toArray())).filter(removeDuplicates),
        )
      } else if (existingResult.get('ids').first() !== result.get('ids').first()) {
        return state.setIn([MAPPING_TYPES.PAGES, resultPath, 'morePostIds'], result.get('ids'))
      }
    } else {
      return state.setIn(
        [MAPPING_TYPES.PAGES, resultPath],
        existingResult.set('ids', Immutable.List(union(result.get('ids').toArray(), existingResult.get('ids').toArray()))).delete('morePostIds'),
      )
    }
  }
  return state.setIn([MAPPING_TYPES.PAGES, resultPath], result)
}

methods.deleteModel = (state, action, mappingType) => {
  const { model } = action.payload
  switch (action.type) {
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
      state = commentMethods.addOrUpdateComment(state, { ...action, payload: { ...action.payload, postId: model.get('postId') } })
      break
    case ACTION_TYPES.POST.DELETE_SUCCESS:
      state = postMethods.addOrUpdatePost(state, action)
      break
    case ACTION_TYPES.USER.REMOVE_FROM_CATEGORY_SUCCESS:
      state = state.deleteIn(['categoryUsers', model.get('id')])
      break
    default:
      break
  }
  const deletedType = state.get(`deleted_${mappingType}`, Immutable.List())
  if (action.type.includes('_REQUEST') || action.type.includes('_SUCCESS')) {
    if (!deletedType.includes(`${model.get('id')}`)) {
      return state.set(`deleted_${mappingType}`, deletedType.push(`${model.get('id')}`))
    }
  } else if (action.type.includes('_FAILURE')) {
    // TODO: pop an alert or modal saying 'something went wrong'
    // and we couldn't delete this model?
    return state.setIn([mappingType, model.get('id')], model)
      .set(
        `deleted_${mappingType}`,
        deletedType.splice(deletedType.indexOf(`${model.get('id')}`), 1),
      )
  }
  return state
}

methods.updateCurrentUser = (state, action) => {
  const { response } = action.payload
  const curUser = state.getIn([MAPPING_TYPES.USERS, `${response[MAPPING_TYPES.USERS].id}`])
  const newUser = curUser ?
    curUser.mergeDeep(response[MAPPING_TYPES.USERS]) :
    Immutable.fromJS(response[MAPPING_TYPES.USERS])
  const tmpAvatar = curUser && curUser.getIn(['avatar', 'tmp'])
  const tmpCoverImage = curUser && curUser.getIn(['coverImage', 'tmp'])
  if (tmpAvatar) {
    newUser.setIn(['avatar', 'tmp'], tmpAvatar)
  }
  if (tmpCoverImage) {
    newUser.setIn(['coverImage', 'tmp'], tmpCoverImage)
  }
  return state.setIn([MAPPING_TYPES.USERS, `${response[MAPPING_TYPES.USERS].id}`], newUser)
}

methods.updateCurrentUserTmpAsset = (state, action) => {
  const assetType = action.type === ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED ? 'avatar' : 'coverImage'
  const currentUser = methods.getCurrentUser(state)
  return state.setIn([MAPPING_TYPES.USERS, currentUser.get('id')],
    currentUser.set(assetType, currentUser.get(assetType).mergeDeep(action.payload)),
  )
}

methods.updatePostDetail = (state, action) => {
  const post = action.payload.response.posts
  state = methods.parseLinked(action.payload.response.linked, state)
  state = methods.addModels(state, action.meta.mappingType, action.payload.response).state
  return methods.mergeModel(
    state,
    action.meta.mappingType,
    {
      id: post.id,
      showLovers: parseInt(post.lovesCount, 10) > 0,
      showReposters: parseInt(post.repostsCount, 10) > 0,
    },
  )
}

methods.markAnnouncementRead = state =>
  state.delete('announcements')

export default function json(state = initialState, action = { type: '' }) {
  // whitelist actions
  switch (action.type) {
    case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.V3.LOAD_NEXT_CONTENT_SUCCESS:
    case ACTION_TYPES.V3.LOAD_CATEGORIES_SUCCESS:
    case ACTION_TYPES.V3.LOAD_PAGE_HEADERS_SUCCESS:
    case ACTION_TYPES.V3.POST.DETAIL_SUCCESS:
    case ACTION_TYPES.V3.POST.LOAD_MANY_SUCCESS:
    case ACTION_TYPES.V3.CATEGORY.LOAD_SUCCESS:
    case ACTION_TYPES.V3.USER.DETAIL_SUCCESS:
    case ACTION_TYPES.V3.USER.QUICK_SEARCH_SUCCESS:
    case ACTION_TYPES.V3.USER.QUICK_SEARCH_CLEAR:
    case ACTION_TYPES.PROFILE.FOLLOW_CATEGORIES_SUCCESS:
    case ACTION_TYPES.PROFILE.UNFOLLOW_CATEGORIES_SUCCESS:
      return v3Reducer(state, action)
    case ACTION_TYPES.ADD_NEW_IDS_TO_RESULT:
      return methods.addNewIdsToResult(state, action)
    case ACTION_TYPES.AUTHENTICATION.LOGOUT_SUCCESS:
    case ACTION_TYPES.AUTHENTICATION.LOGOUT_FAILURE:
    case ACTION_TYPES.AUTHENTICATION.REFRESH_FAILURE:
    case ACTION_TYPES.PROFILE.DELETE_SUCCESS:
      return initialState
    case ACTION_TYPES.CLEAR_PAGE_RESULT:
      return state.deleteIn([MAPPING_TYPES.PAGES, action.payload.resultKey])
    case ACTION_TYPES.COMMENT.CREATE_FAILURE:
    case ACTION_TYPES.COMMENT.CREATE_REQUEST:
    case ACTION_TYPES.COMMENT.CREATE_SUCCESS:
    case ACTION_TYPES.COMMENT.UPDATE_SUCCESS:
      state = methods.parseLinked(get(action, 'payload.response.linked'), state)
      return commentMethods.addOrUpdateComment(state, action)
    case ACTION_TYPES.COMMENT.DELETE_REQUEST:
    case ACTION_TYPES.COMMENT.DELETE_SUCCESS:
    case ACTION_TYPES.COMMENT.DELETE_FAILURE:
      return methods.deleteModel(state, action, MAPPING_TYPES.COMMENTS)
    case ACTION_TYPES.USER.REMOVE_FROM_CATEGORY_REQUEST:
    case ACTION_TYPES.USER.REMOVE_FROM_CATEGORY_SUCCESS:
    case ACTION_TYPES.USER.REMOVE_FROM_CATEGORY_FAILURE:
      return methods.deleteModel(state, action, MAPPING_TYPES.CATEGORY_USERS)
    case ACTION_TYPES.COMMENT.TOGGLE_EDITING:
      return commentMethods.toggleEditing(state, action)
    case ACTION_TYPES.COMMENT.EDITABLE_SUCCESS:
    case ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS:
    case ACTION_TYPES.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.POST.EDITABLE_SUCCESS:
    case ACTION_TYPES.USER.DETAIL_SUCCESS:
    case ACTION_TYPES.USER.ADD_TO_CATEGORY_SUCCESS:
      // fall through to parse the rest
      break
    case ACTION_TYPES.NOTIFICATIONS.MARK_ANNOUNCEMENT_READ_REQUEST:
      return methods.markAnnouncementRead(state)
    case ACTION_TYPES.POST.CREATE_FAILURE:
    case ACTION_TYPES.POST.CREATE_SUCCESS:
    case ACTION_TYPES.POST.UPDATE_SUCCESS:
      state = methods.parseLinked(get(action, 'payload.response.linked'), state)
      return postMethods.addOrUpdatePost(state, action)
    case ACTION_TYPES.POST.DELETE_REQUEST:
    case ACTION_TYPES.POST.DELETE_SUCCESS:
    case ACTION_TYPES.POST.DELETE_FAILURE:
      return methods.deleteModel(state, action, MAPPING_TYPES.POSTS)
    case ACTION_TYPES.POST.DETAIL_SUCCESS:
      return methods.updatePostDetail(state, action)
    case ACTION_TYPES.POST.LOVE_REQUEST:
    case ACTION_TYPES.POST.LOVE_SUCCESS:
    case ACTION_TYPES.POST.LOVE_FAILURE:
      return postMethods.updatePostLoves(state, action)
    case ACTION_TYPES.POST.WATCH_REQUEST:
    case ACTION_TYPES.POST.WATCH_SUCCESS:
    case ACTION_TYPES.POST.WATCH_FAILURE:
      return postMethods.updatePostWatch(state, action)
    case ACTION_TYPES.POST.TOGGLE_COMMENTS:
      return postMethods.toggleComments(state, action)
    case ACTION_TYPES.POST.TOGGLE_EDITING:
      return postMethods.toggleEditing(state, action)
    case ACTION_TYPES.POST.TOGGLE_REPOSTING:
      return postMethods.toggleReposting(state, action)
    case ACTION_TYPES.PROFILE.LOAD_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_AVATAR_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_COVER_SUCCESS:
    case ACTION_TYPES.PROFILE.SAVE_SUCCESS:
      state = methods.parseLinked(get(action, 'payload.response.linked'), state)
      return methods.updateCurrentUser(state, action)
    case ACTION_TYPES.PROFILE.TMP_AVATAR_CREATED:
    case ACTION_TYPES.PROFILE.TMP_COVER_CREATED:
      return methods.updateCurrentUserTmpAsset(state, action)
    case ACTION_TYPES.RELATIONSHIPS.BATCH_UPDATE_INTERNAL:
      return relationshipMethods.batchUpdateRelationship(state, action)
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_INTERNAL:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_REQUEST:
    case ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS:
      return relationshipMethods.updateRelationship(state, action)
    case ACTION_TYPES.UPDATE_STATE_FROM_NATIVE: {
      if (!action.payload.json.isEmpty()) {
        return action.payload.json
      }
      return state
    }
    case REHYDRATE: {
      // if we start with an initial state we are iso
      // rendering and we should keep it to display the page
      if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
        return state
      }
      // only keep the items that have been deleted
      // so we can still filter them out if needed
      let keepers = initialState
      if (action.payload.json) {
        action.payload.json.keySeq().forEach((collection) => {
          if (/deleted_/.test(collection)) {
            keepers = keepers.set(collection, action.payload.json.get(collection))
          }
        })
      }
      if (action.payload.profile) {
        let curUser = action.payload.profile
        if (curUser) {
          curUser = curUser.deleteIn(['avatar', 'tmp'])
            .deleteIn(['coverImage', 'tmp'])
          keepers = keepers.setIn([MAPPING_TYPES.USERS, curUser.get('id')], curUser)
        }
      }
      return keepers
    }
    case LOCATION_CHANGE:
      path = action.payload.pathname
      return state
    default:
      return state
  }
  let { response } = action.payload
  // Announcement notifications dismissed from another tab/device/browser send an empty response
  if (!response && get(action, ['meta', 'mappingType'], null) === MAPPING_TYPES.ANNOUNCEMENTS) {
    return methods.markAnnouncementRead(state, action)
  }
  if (!response) { return state }
  // parse the linked part of the response into the state
  state = methods.parseLinked(response.linked, state)
  // parse main part of response into the state
  // and update the paging information
  // unless updateResult is false which is used for
  // user details when you want the result to be for
  // posts/following/followers/loves
  const mappingType = get(action, 'meta.mappingType')
  if (mappingType && action.meta.updateResult === false) {
    state = methods.addModels(state, mappingType, response).state
  } else {
    if (mappingType === MAPPING_TYPES.COMMENTS) {
      response = methods.addParentPostIdToComments(response, state, action)
    } else if (mappingType === MAPPING_TYPES.BADGES && response[MAPPING_TYPES.BADGES]) {
      state = state.setIn([MAPPING_TYPES.BADGES], Immutable.fromJS(response[MAPPING_TYPES.BADGES]))
    }
    state = methods.updateResult(response, state, action)
  }
  hasLoadedFirstStream = true
  return state
}

// only used for testing where results get stored
export function setPath(newPath) {
  path = newPath
}
export function setHasLoadedFirstStream(bool) {
  hasLoadedFirstStream = bool
}

export { json, methods, commentMethods, postMethods, relationshipMethods }
