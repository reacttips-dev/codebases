// Action Types
import * as ActionTypes from '../constants/ActionTypes'

import { GenerateIDURL } from '../utils/urlIDParser'
import { navigate } from '../utils/navigation'

export const initialState = {
  archiveModal: {
    document: {},
    showModal: false
  },
  deleteModal: {
    document: {},
    isDeleting: false,
    showModal: false
  },
  moveDocumentModal: {
    document: {},
    showModal: false,
    currentSpace: 0,
    selectedSpace: 0
  },
  moreMenuOpen: {
    type: '',
    id: 0
  }
}

export default function tileReducer (state = initialState, action) {
  var { type, data } = action

  switch (type) {
    // Server actions
    case ActionTypes.API_ARCHIVE_DOCUMENT.SUCCESS:
    case ActionTypes.API_ARCHIVE_DOCUMENT.FAILURE:
    case ActionTypes.API_ACTIVATE_DOCUMENT.FAILURE:
      return toggleArchiveModal(state, { document: {} })

    case ActionTypes.API_ACTIVATE_DOCUMENT.SUCCESS:
      return gotoActivatedDocument(state, data)

    case ActionTypes.API_DELETE_DOCUMENT.REQUEST:
    case ActionTypes.API_DELETE_PROJECT.REQUEST:
    case ActionTypes.API_DELETE_SPACE.REQUEST:
      return toggleIsDeleting(state)

    case ActionTypes.API_DELETE_DOCUMENT.SUCCESS:
    case ActionTypes.API_DELETE_DOCUMENT.FAILURE:
    case ActionTypes.API_DELETE_SPACE.SUCCESS:
    case ActionTypes.API_DELETE_SPACE.FAILURE:
    case ActionTypes.API_DELETE_PROJECT.SUCCESS:
    case ActionTypes.API_DELETE_PROJECT.FAILURE:
      return toggleDeleteModal(state, { document: {} })

    // View actions
    case ActionTypes.TOGGLE_ARCHIVE_MODAL:
      return toggleArchiveModal(state, data)

    case ActionTypes.TOGGLE_DELETE_MODAL:
      return toggleDeleteModal(state, data)

    case ActionTypes.TOGGLE_MOVE_DOCUMENT_MODAL:
      return toggleMoveDocumentModal(state, data)

    case ActionTypes.TOGGLE_MORE_MENU:
      return toggleMoreMenu(state, data)

    case ActionTypes.SELECT_SPACE_RESULT:
      return selectSpace(state, data)

    case ActionTypes.API_MOVE_DOCUMENT_TO_SPACE.SUCCESS:
    case ActionTypes.API_REMOVE_DOCUMENT_AND_CREATE_SPACE.SUCCESS:
      return redirectAfterMoveDocument(state, data)

    case ActionTypes.DOCUMENT_MOVED:
    case ActionTypes.API_MOVE_DOCUMENT_TO_SPACE.FAILURE:
    case ActionTypes.API_REMOVE_DOCUMENT_FROM_SPACE.FAILURE:
    case ActionTypes.API_REMOVE_DOCUMENT_AND_CREATE_SPACE.FAILURE:
      return closeMoveDocumentToSpace(state, data)

    default:
      return state
  }
}

function toggleArchiveModal (state, data) {
  const { document } = data

  return Object.assign({}, state, {
    archiveModal: {
      showModal: !state.archiveModal.showModal,
      document
    }
  })
}

function toggleDeleteModal (state, data) {
  const { document } = data

  return Object.assign({}, state, {
    deleteModal: {
      document,
      isDeleting: false,
      showModal: !state.deleteModal.showModal
    }
  })
}

function toggleIsDeleting (state) {
  return Object.assign({}, state, {
    deleteModal: {
      document: state.deleteModal.document,
      isDeleting: !state.deleteModal.isDeleting,
      showModal: state.deleteModal.showModal
    }
  })
}

function toggleMoveDocumentModal (state, data) {
  const { doc } = data

  return Object.assign({}, state, {
    moveDocumentModal: {
      showModal: !state.moveDocumentModal.showModal,
      document: doc || {},
      selectedSpace: doc ? doc.currentSpaceID : 0,
      currentSpace: doc ? doc.currentSpaceID : 0
    }
  })
}

function redirectAfterMoveDocument (state, data) {
  const { spaceCUID } = data
  setTimeout(() => {
    navigate(`/space/${spaceCUID}`)
  }, 150)

  return Object.assign({}, state, {
    moveDocumentModal: {
      ...state.moveDocumentModal,
      showModal: false
    }
  })
}
function closeMoveDocumentToSpace (state, data) {
  return Object.assign({}, state, {
    moveDocumentModal: initialState.moveDocumentModal
  })
}
function toggleMoreMenu (state, data) {
  const { type, id } = data
  const moreMenuOpen = {}

  const isClose = type === state.moreMenuOpen.type && id === state.moreMenuOpen.id

  moreMenuOpen.id = isClose ? 0 : id
  moreMenuOpen.type = isClose ? '' : type

  return Object.assign({}, state, {
    moreMenuOpen
  })
}

function selectSpace (state, spaceID) {
  return Object.assign({}, state, {
    moveDocumentModal: {
      ...state.moveDocumentModal,
      selectedSpace: spaceID
    }
  })
}

function gotoActivatedDocument (state, data) {
  const newState = toggleArchiveModal(state, { document: {} })
  let id = ''
  let url = ''

  switch (data.response.type) {
    case 'board':
      id = GenerateIDURL(data.response.id, data.response.title)
      url = `/board/${id}?activated`
      break

    default:
      url = ''
      break
  }

  if (url !== '') {
    setTimeout(() => {
      navigate(url)
    }, 150)
  }

  return newState
}
