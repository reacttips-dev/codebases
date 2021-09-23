import { EDITOR, V3 } from '../constants/action_types'
import * as api from '../networking/api'
import allCategoriesQuery from '../queries/allCategories'

export function addBlock(block, editorId, shouldCheckForEmpty = true) {
  return {
    type: EDITOR.ADD_BLOCK,
    payload: {
      block,
      editorId,
      shouldCheckForEmpty,
    },
  }
}

export function addDragBlock(block, editorId) {
  return {
    type: EDITOR.ADD_DRAG_BLOCK,
    payload: {
      block,
      editorId,
    },
  }
}

export function addEmptyTextBlock(editorId) {
  return {
    type: EDITOR.ADD_EMPTY_TEXT_BLOCK,
    payload: {
      editorId,
    },
  }
}

export function autoCompleteUsers(type, word) {
  return {
    type: EDITOR.USER_COMPLETER,
    payload: {
      endpoint: api.userAutocompleter(word),
      type,
    },
  }
}

export function initializeEditor(editorId, shouldPersist) {
  return {
    type: EDITOR.INITIALIZE,
    payload: {
      editorId,
      shouldPersist,
    },
  }
}

export function loadEmojis(type, word) {
  return {
    type: EDITOR.EMOJI_COMPLETER,
    payload: {
      endpoint: api.loadEmojis(),
      type,
      word,
    },
  }
}

export function loadReplyAll(postId, editorId) {
  return {
    type: EDITOR.LOAD_REPLY_ALL,
    payload: {
      endpoint: api.postReplyAll(postId),
      editorId,
    },
  }
}

export function postPreviews(embedUrl, editorId, uid) {
  return {
    type: EDITOR.POST_PREVIEW,
    payload: {
      body: { body: [{ kind: 'embed', data: { url: embedUrl } }] },
      editorId,
      endpoint: api.postPreviews(),
      uid,
      method: 'POST',
    },
  }
}

export function removeBlock(uid, editorId) {
  return {
    type: EDITOR.REMOVE_BLOCK,
    payload: {
      editorId,
      uid,
    },
  }
}

export function removeDragBlock(editorId) {
  return {
    type: EDITOR.REMOVE_DRAG_BLOCK,
    payload: {
      editorId,
    },
  }
}

export function reorderBlocks(uid, delta, editorId) {
  return {
    type: EDITOR.REORDER_BLOCKS,
    payload: {
      delta,
      editorId,
      uid,
    },
  }
}

export function replaceText(uid, editorId) {
  return {
    type: EDITOR.REPLACE_TEXT,
    payload: {
      editorId,
      uid,
    },
  }
}

export function resetEditor(editorId) {
  return {
    type: EDITOR.RESET,
    payload: {
      editorId,
    },
  }
}

export function saveAsset(file, editorId) {
  return {
    type: EDITOR.SAVE_ASSET,
    payload: {
      editorId,
      file,
    },
  }
}

export function setIsCompleterActive({ isActive }) {
  return {
    type: EDITOR.SET_IS_COMPLETER_ACTIVE,
    payload: {
      isCompleterActive: isActive,
    },
  }
}

export function setIsTextToolsActive({ isActive, textToolsStates = {} }) {
  return {
    type: EDITOR.SET_IS_TEXT_TOOLS_ACTIVE,
    payload: {
      isTextToolsActive: isActive,
      textToolsStates,
    },
  }
}

export function setTextToolsCoordinates({ textToolsCoordinates = { top: -200, left: -666 } }) {
  return {
    type: EDITOR.SET_TEXT_TOOLS_COORDINATES,
    payload: {
      textToolsCoordinates,
    },
  }
}

export function temporaryEditorAssetCreated(objectURL, editorId) {
  return {
    type: EDITOR.TMP_IMAGE_CREATED,
    payload: {
      url: objectURL,
      editorId,
    },
  }
}

export function updateBuyLink(editorId, link) {
  return {
    type: EDITOR.UPDATE_BUY_LINK,
    payload: {
      editorId,
      link,
    },
  }
}

export function updateCategoryId(editorId, categoryId) {
  return {
    type: EDITOR.UPDATE_CATEGORY_IDS,
    payload: {
      editorId,
      categoryIds: [categoryId],
    },
  }
}

export function clearCategoryId(editorId) {
  return {
    type: EDITOR.UPDATE_CATEGORY_IDS,
    payload: {
      editorId,
      categoryIds: [],
    },
  }
}

export function updateBlock(block, uid, editorId) {
  return {
    type: EDITOR.UPDATE_BLOCK,
    payload: {
      block,
      editorId,
      uid,
    },
  }
}

export function fetchEditorCategories() {
  return {
    type: V3.LOAD_CATEGORIES,
    payload: {
      query: allCategoriesQuery,
      variables: {},
    },
  }
}
