/* eslint-disable no-param-reassign */
import Immutable from 'immutable'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import { RELATIONSHIP_PRIORITY } from '../constants/relationship_types'
import * as jsonReducer from '../reducers/json'

const methods = {}

methods.removeIdFromDeletedArray = (state, type, id) => {
  const delArr = state.get(`deleted_${type}`, Immutable.List())
  if (!delArr.isEmpty()) {
    const index = delArr.indexOf(`${id}`)
    if (index > -1) {
      return state.set(`deleted_${type}`, delArr.splice(index, 1))
    }
  }
  return state
}

methods.relationshipUpdateSuccess = (state, action) => {
  const { response } = action.payload
  const { owner, subject } = response
  if (owner) { state = state.setIn([MAPPING_TYPES.USERS, owner.id], Immutable.fromJS(owner)) }
  if (subject) { state = state.setIn([MAPPING_TYPES.USERS, subject.id], Immutable.fromJS(subject)) }
  return state
}

methods.addItemsForAuthor = (state, mappingType, authorId) => {
  state.get(mappingType, Immutable.Map()).valueSeq().forEach((model) => {
    if (model.get('authorId') === authorId) {
      state = methods.removeIdFromDeletedArray(state, mappingType, model.get('id'))
    }
  })
  return state
}

methods.removeItemsForAuthor = (state, mappingType, authorId) => {
  state.get(mappingType, Immutable.Map()).valueSeq().forEach((model) => {
    if (model.get('authorId') === authorId) {
      const action = {
        type: '_REQUEST',
        payload: {
          model: state.getIn([mappingType, model.get('id')]),
        },
      }
      state = jsonReducer.methods.deleteModel(state, action, mappingType)
    }
  })
  return state
}

methods.blockUser = (state, userId) => {
  // update blockedCount
  state = jsonReducer.methods.updateUserCount(state, userId, 'blockedCount', 1)
  // delete the user
  const userAction = {
    type: '_REQUEST',
    payload: {
      model: state.getIn([MAPPING_TYPES.USERS, userId]),
    },
  }
  state = jsonReducer.methods.deleteModel(state, userAction, MAPPING_TYPES.USERS)
  // delete all of their posts
  state = methods.removeItemsForAuthor(state, MAPPING_TYPES.POSTS, userId)
  // delete all of their comments
  return methods.removeItemsForAuthor(state, MAPPING_TYPES.COMMENTS, userId)
}

methods.unblockUser = (state, userId) => {
  // update blockedCount
  state = jsonReducer.methods.updateUserCount(state, userId, 'blockedCount', -1)
  // remove the user from the deleted user ids array
  state = methods.removeIdFromDeletedArray(state, MAPPING_TYPES.USERS, userId)
  // add back all of their posts
  state = methods.addItemsForAuthor(state, MAPPING_TYPES.POSTS, userId)
  // add back all of their comments
  return methods.addItemsForAuthor(state, MAPPING_TYPES.COMMENTS, userId)
}

methods.updateRelationship = (state, action) => {
  // on success just return the owner subject mapped back on users
  if (action.type === ACTION_TYPES.RELATIONSHIPS.UPDATE_SUCCESS) {
    return methods.relationshipUpdateSuccess(state, action)
  }
  const { userId, priority } = action.payload
  const user = state.getIn([MAPPING_TYPES.USERS, userId])
  const prevPriority = user.get('relationshipPriority')
  switch (prevPriority) {
    case RELATIONSHIP_PRIORITY.BLOCK:
      state = methods.unblockUser(state, userId)
      break
    case RELATIONSHIP_PRIORITY.MUTE:
      state = jsonReducer.methods.updateUserCount(state, userId, 'mutedCount', -1)
      break
    case RELATIONSHIP_PRIORITY.FRIEND:
    case RELATIONSHIP_PRIORITY.NOISE:
      if (priority !== RELATIONSHIP_PRIORITY.FRIEND &&
          priority !== RELATIONSHIP_PRIORITY.NOISE) {
        state = jsonReducer.methods.updateUserCount(state, userId, 'followersCount', -1)
      }
      break
    default:
      break
  }
  switch (priority) {
    case RELATIONSHIP_PRIORITY.FRIEND:
    case RELATIONSHIP_PRIORITY.NOISE:
      if (prevPriority !== RELATIONSHIP_PRIORITY.FRIEND &&
          prevPriority !== RELATIONSHIP_PRIORITY.NOISE) {
        state = jsonReducer.methods.updateUserCount(state, userId, 'followersCount', 1)
      }
      break
    case RELATIONSHIP_PRIORITY.BLOCK:
      state = methods.blockUser(state, userId)
      break
    case RELATIONSHIP_PRIORITY.MUTE:
      state = jsonReducer.methods.updateUserCount(state, userId, 'mutedCount', 1)
      break
    default:
      break
  }
  // update local user
  return jsonReducer.methods.mergeModel(
    state,
    MAPPING_TYPES.USERS,
    {
      id: userId,
      relationshipPriority: priority,
    },
  )
}

methods.batchUpdateRelationship = (state, action) => {
  const { priority, userIds } = action.payload
  userIds.forEach((id) => {
    state = jsonReducer.methods.mergeModel(
      state,
      MAPPING_TYPES.USERS,
      {
        id,
        relationshipPriority: priority,
      },
    )
  })
  return state
}

export { methods as default, jsonReducer }
