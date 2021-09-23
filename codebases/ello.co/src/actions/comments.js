import { COMMENT } from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import { resetEditor } from '../actions/editor'

export function createComment(hasAutoWatchEnabled, body, editorId, postId) {
  return {
    type: COMMENT.CREATE,
    payload: {
      body: { body },
      editorId,
      endpoint: api.createComment(postId),
      method: 'POST',
      postId,
      hasAutoWatchEnabled,
    },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
      successAction: resetEditor(editorId),
    },
  }
}

export function deleteComment(comment) {
  return {
    type: COMMENT.DELETE,
    payload: {
      endpoint: api.deleteComment(comment),
      method: 'DELETE',
      model: comment,
    },
    meta: {},
  }
}

export function flagComment(comment, kind) {
  return {
    type: COMMENT.FLAG,
    payload: {
      endpoint: api.flagComment(comment, kind),
      method: 'POST',
    },
    meta: {},
  }
}

export function loadEditableComment(comment) {
  return {
    type: COMMENT.EDITABLE,
    payload: { endpoint: api.editComment(comment) },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
      updateResult: false,
    },
  }
}

export function toggleEditing(comment, isEditing) {
  return {
    type: COMMENT.TOGGLE_EDITING,
    payload: {
      model: comment,
      isEditing,
    },
  }
}

export function updateComment(comment, body, editorId) {
  return {
    type: COMMENT.UPDATE,
    payload: {
      body: { body },
      editorId,
      endpoint: api.editComment(comment),
      method: 'PATCH',
    },
    meta: {
      mappingType: MAPPING_TYPES.COMMENTS,
    },
  }
}

