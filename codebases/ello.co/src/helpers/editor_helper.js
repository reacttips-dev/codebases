/* eslint-disable no-param-reassign */
import Immutable from 'immutable'
import get from 'lodash/get'
import reduce from 'lodash/reduce'
import { COMMENT, EDITOR, POST } from '../constants/action_types'
import { suggestEmoji } from '../components/completers/EmojiSuggester'
import { userRegex } from '../components/completers/Completer'

const methods = {}
const initialState = Immutable.Map({
  artistInvite: null,
  collection: Immutable.Map(),
  hasContent: false,
  hasMedia: false,
  hasMention: false,
  isLoading: false,
  isPosting: false,
  order: Immutable.List(),
  postBuyLink: null,
  shouldPersist: false,
  uid: 0,
  categoryIds: [],
})

methods.getCompletions = (action) => {
  const { payload } = action
  if (payload && payload.response) {
    const { type = 'user', word } = payload
    if (type === 'user' || type === 'location') {
      if (type === 'location' && !document.activeElement.classList.contains('LocationControl')) {
        return null
      }
      return Immutable.fromJS({ data: payload.response.autocompleteResults, type })
    } else if (type === 'emoji') {
      return Immutable.fromJS({ data: suggestEmoji(word, payload.response.emojis), type })
    }
  }
  return Immutable.Map()
}

methods.rehydrateEditors = (persistedEditors = Immutable.Map()) => {
  let editors = Immutable.Map()
  persistedEditors.keySeq().forEach((key) => {
    let pe = persistedEditors.get(key)
    if (pe && pe.get('shouldPersist')) {
      // clear out the blobs
      const collection = pe.get('collection')
      collection.keySeq().forEach((uid) => {
        const block = collection.get(uid)
        if (/image/.test(block.get('kind'))) {
          pe = pe.setIn(['collection', uid], block.delete('blob'))
        }
      })
      pe = pe.set('isLoading', false).set('isPosting', false)
      editors = editors.set(key, pe)
    }
  })
  return editors
}

methods.hasContent = (state) => {
  const order = state.get('order')
  const firstBlock = state.getIn(['collection', `${order.first()}`])
  if (!firstBlock) { return false }
  const data = firstBlock.get('data')
  return !!(order.size > 1 || (data && data.length && data !== '<br>'))
}

methods.hasMedia = (state) => {
  const collection = state.get('collection')
  const order = state.get('order')
  return order.some(uid => /embed|image/.test(collection.getIn([`${uid}`, 'kind'])))
}

methods.hasMention = (state) => {
  const collection = state.get('collection')
  const order = state.get('order')
  return order.some((uid) => {
    const block = collection.get(`${uid}`)
    return block && /text/.test(block.get('kind')) && userRegex.test(block.get('data'))
  })
}

methods.isLoading = (state) => {
  const collection = state.get('collection')
  let isLoading = collection.valueSeq().some(block =>
    /image/.test(block.get('kind')) && block.get('isLoading'),
  )
  const dragBlock = state.get('dragBlock')
  if (!isLoading && dragBlock) { isLoading = dragBlock.get('isLoading') }
  return isLoading
}

methods.add = ({ block, shouldCheckForEmpty = true, state }) => {
  const uid = state.get('uid')
  const newBlock = { ...block, uid }
  let postBuyLink = state.get('postBuyLink')
  if (!postBuyLink && block.linkUrl) {
    postBuyLink = block.linkUrl
    state = state.set('postBuyLink', postBuyLink)
  } else if (postBuyLink) {
    newBlock.linkUrl = postBuyLink
  }
  const order = state.get('order', Immutable.List())
  const updatedState = state.setIn(['collection', `${uid}`], Immutable.fromJS(newBlock))
    .set('order', order.push(uid))
    .set('uid', uid + 1)
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(updatedState) }
  return updatedState
}

methods.addEmptyTextBlock = (state, shouldCheckForEmpty = false) => {
  const order = state.get('order', Immutable.List())
  const last = state.getIn(['collection', `${order.last()}`])
  if (order.size > 1) {
    const secondToLast = state.getIn(['collection', `${order.get(-2)}`])
    if (/text/.test(secondToLast.get('kind')) && /text/.test(last.get('kind')) && !last.get('data').length) {
      return methods.remove({ shouldCheckForEmpty, state, uid: last.get('uid') })
    }
  }
  if (!order.size || !/text/.test(last.get('kind'))) {
    return methods.add({ block: { data: '', kind: 'text' }, state })
  }
  return state
}

methods.remove = ({ shouldCheckForEmpty = true, state, uid }) => {
  const order = state.get('order')
  const updatedState = state.deleteIn(['collection', `${uid}`])
    .deleteIn(['order', `${order.indexOf(uid)}`])
  if (shouldCheckForEmpty) { return methods.addEmptyTextBlock(updatedState) }
  return updatedState
}

methods.removeEmptyTextBlock = (state) => {
  const order = state.get('order')
  if (order.size > 0) {
    const last = state.getIn(['collection', `${order.last()}`])
    if (last && /text/.test(last.get('kind')) && !last.get('data').length) {
      return state.deleteIn(['collection', `${last.get('uid')}`])
        .deleteIn(['order', `${order.indexOf(last.get('uid'))}`])
    }
  }
  return state
}

methods.updateBlock = (state, action) => {
  const { block, uid } = action.payload
  return state.setIn(['collection', `${uid}`], Immutable.fromJS(block))
}

methods.reorderBlocks = (state, action) => {
  const order = state.get('order')
  const { delta, uid } = action.payload
  const index = order.indexOf(uid)
  // remove from old spot and add to new spot
  return state.set('order', order.splice(index, 1).splice(index + delta, 0, uid))
}

methods.appendText = (state, text) => {
  const order = state.get('order')
  const textBlocks = order.filter(uid => /text/.test(state.getIn(['collection', `${uid}`, 'kind'])))
  const lastTextBlock = state.getIn(['collection', `${textBlocks.last()}`])
  if (lastTextBlock) {
    return state.setIn(['collection', `${lastTextBlock.get('uid')}`, 'data'], lastTextBlock.get('data') + text)
  }
  return state
}

methods.appendUsernames = (state, usernames) => {
  const order = state.get('order')
  const textBlocks = order.filter(uid => /text/.test(state.getIn(['collection', `${uid}`, 'kind'])))
  const lastTextBlock = state.getIn(['collection', `${textBlocks.last()}`])
  const text = reduce(usernames, (memo, { username }) => `${memo}@${username} `, '')
  if (lastTextBlock && !lastTextBlock.get('data').includes(text)) {
    return state.setIn(['collection', `${lastTextBlock.get('uid')}`, 'data'], lastTextBlock.get('data') + text)
  }
  return state
}

methods.replaceText = (state, action) => {
  const { editorId, uid } = action.payload
  const kind = state.getIn(['collection', `${uid}`, 'kind'])
  if (/text/.test(kind)) {
    const selector = `[data-editor-id="${editorId}"][data-collection-id="${uid}"]`
    const elem = document.querySelector(selector)
    if (elem && elem.firstChild) {
      return state.setIn(['collection', `${uid}`, 'data'], elem.firstChild.innerHTML)
    }
  }
  return state
}

methods.updateBuyLink = (state, action) => {
  const { payload: { link } } = action
  // once individual blocks can get their own links
  // we can rip out this overall property on editor
  const order = state.get('order')
  state.set('postBuyLink', link)
  let updatedState = state
  order.forEach((uid) => {
    if (link && link.length) {
      updatedState = updatedState.setIn(['collection', `${uid}`, 'linkUrl'], link)
    } else {
      updatedState = updatedState.deleteIn(['collection', `${uid}`, 'linkUrl'])
    }
  })
  return updatedState
}

methods.updateCategoryIds = (state, action) => {
  const { payload: { categoryIds } } = action
  return state.set('categoryIds', categoryIds)
}

methods.getEditorObject = (state = initialState, action) => {
  switch (action.type) {
    case EDITOR.ADD_ARTIST_INVITE:
      return state.set('artistInvite', action.payload.artistInvite)
    case EDITOR.ADD_BLOCK:
      return methods.add({
        block: action.payload.block,
        state,
        shouldCheckForEmpty: action.payload.shouldCheckForEmpty,
      })
    case EDITOR.ADD_DRAG_BLOCK:
      return state.set('dragBlock', action.payload.block)
    case EDITOR.ADD_EMPTY_TEXT_BLOCK:
      return methods.addEmptyTextBlock(state)
    case EDITOR.APPEND_TEXT:
      return methods.appendText(state, action.payload.text)
    case EDITOR.INITIALIZE:
      if (state.get('shouldPersist') || get(action, 'payload.shouldPersist')) {
        return state
      }
      return initialState
    case EDITOR.POST_PREVIEW_SUCCESS:
      state = methods.removeEmptyTextBlock(state)
      state = methods.add({
        block: { ...action.payload.response.postPreviews.body[0] },
        state,
      })
      return state
    case EDITOR.REMOVE_BLOCK:
      return methods.remove({ state, uid: action.payload.uid })
    case EDITOR.REMOVE_DRAG_BLOCK:
      return state.delete('dragBlock')
    case EDITOR.REORDER_BLOCKS:
      return methods.reorderBlocks(state, action)
    case EDITOR.REPLACE_TEXT:
      return methods.replaceText(state, action)
    case COMMENT.CREATE_REQUEST:
    case COMMENT.UPDATE_REQUEST:
    case POST.CREATE_REQUEST:
    case POST.UPDATE_REQUEST:
      return state.set('isPosting', true)
    case COMMENT.CREATE_SUCCESS:
    case COMMENT.UPDATE_SUCCESS:
    case EDITOR.RESET:
    case POST.CREATE_SUCCESS:
    case POST.UPDATE_SUCCESS:
      return methods.addEmptyTextBlock(initialState.set('uid', state.get('uid')))
    case COMMENT.CREATE_FAILURE:
    case COMMENT.UPDATE_FAILURE:
    case POST.CREATE_FAILURE:
    case POST.UPDATE_FAILURE:
      return state.set('isPosting', false)
    case EDITOR.LOAD_REPLY_ALL_SUCCESS:
      return methods.appendUsernames(state, get(action, 'payload.response.usernames', []))
    case EDITOR.SAVE_ASSET_SUCCESS:
      if (state.getIn(['dragBlock', 'uid']) === action.payload.uid) {
        state = state.setIn(['dragBlock', 'data', 'url'], action.payload.response.url)
          .setIn(['dragBlock', 'isLoading'], false)
      } else {
        state = state.setIn(['collection', `${action.payload.uid}`, 'data', 'url'], action.payload.response.url)
          .setIn(['collection', `${action.payload.uid}`, 'isLoading'], false)
      }
      return state.set('isPosting', false)
    case EDITOR.TMP_IMAGE_CREATED:
      return methods.add({
        block: {
          blob: action.payload.url,
          kind: 'image',
          data: {},
          isLoading: true,
        },
        state: methods.removeEmptyTextBlock(state),
      })
    case EDITOR.UPDATE_BUY_LINK:
      return methods.updateBuyLink(state, action)
    case EDITOR.UPDATE_CATEGORY_IDS:
      return methods.updateCategoryIds(state, action)
    case EDITOR.UPDATE_BLOCK:
      return methods.updateBlock(state, action).set('isPosting', false)
    default:
      return state
  }
}

export default methods
export { initialState, methods }

