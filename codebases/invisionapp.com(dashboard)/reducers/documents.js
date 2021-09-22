import update from 'immutability-helper'
import cloneDeep from 'lodash/cloneDeep'
import sortBy from 'lodash/sortBy'
import uniqWith from 'lodash/uniqWith'

import * as ActionTypes from '../constants/ActionTypes'

import createReducer, { cachedInitialState } from '../utils/create-reducer'

export const reducerName = 'documents'

export const defaultKeys = {
  currentSpaceID: '',
  currentSpaceName: '',
  fromCache: true,
  page: 0,
  errors: []
}

export const cachedKeys = {
  archivedDocuments: [],
  documents: [],
  isLoading: true,
  pagingEnabled: false,
  permissions: {
    canCreateBoards: false,
    canCreateFreehands: false,
    canCreatePrototypes: false,
    canCreateRhombuses: false
  }
}

const archiveDocument = (state, data) => {
  const { type, id } = data
  const docIdx = findDocument(state, type, id)

  if (docIdx.index >= 0) {
    const archivedDocument = update(state.documents[docIdx.index], {
      data: { '$merge': { isArchived: true } }
    })

    return {
      archivedDocuments: update(state.archivedDocuments, {
        '$push': [archivedDocument]
      }),
      documents: update(state.documents, {
        '$splice': [[docIdx.index, 1]]
      })
    }
  }
}

const documentMoved = (state, data) => {
  if (state.documents.length === 0) return

  const { documentType, documentID, spaceCUID, spaceTitle } = data
  const docIdx = findDocument(state, documentType, documentID)

  if (docIdx.index >= 0) {
    const docsKey = docIdx.isArchived ? 'archivedDocuments' : 'documents'

    return {
      [docsKey]: update(state[docsKey], {
        [docIdx.index]: {
          data: {
            spaceName: { '$set': spaceTitle || '' },
            spaceID: { '$set': spaceCUID || '' }
          }
        }
      })
    }
  }
}

const documentsMoved = (state, data) => {
  if (state.documents.length === 0) return

  const { data: { documents }, spaceID, spaceTitle } = data

  let newState = cloneDeep(state)

  if (documents.length > 0) {
    documents.forEach(doc => {
      newState = documentMoved(newState, {
        documentType: doc.documentType,
        documentID: doc.documentId,
        spaceCUID: spaceID,
        spaceTitle: spaceTitle
      })
    })
  }

  return newState
}

const findDocument = (state, type, id) => {
  const docIdx = state.documents.findIndex(doc => (type === doc.type && (id + '' === doc.id + '' || id + '' === doc.data.hash + '')))

  if (docIdx >= 0) {
    return { index: docIdx, isArchived: false }
  } else {
    const archivedDocIdx = state.archivedDocuments.findIndex(doc => (type === doc.type && (id + '' === doc.id + '' || id + '' === doc.data.hash + '')))

    if (archivedDocIdx >= 0) {
      return { index: archivedDocIdx, isArchived: true }
    }
  }

  return { index: -1 }
}

const loadArchivedSpaceDocuments = (state, { documents }) => {
  const spaceDocuments = documents.map(doc => {
    doc.data.spaceID = state.currentSpaceID
    doc.data.spaceName = state.currentSpaceName
    return doc
  })

  const baseDocuments = removeOrphanedSpaceDocuments(state.archivedDocuments, spaceDocuments, state.currentSpaceID)
  const mergedDocuments = state.archivedDocuments.length === 0 ? spaceDocuments : mergeDocuments(baseDocuments, spaceDocuments)

  return update(state, {
    archivedDocuments: { $set: mergedDocuments }
  })
}

const loadSpaceDocuments = (state, { pagingEnabled = false, data: { id, title, documents }, errors }) => {
  if (pagingEnabled) return

  const spaceDocuments = documents.map(doc => {
    return { ...doc, data: { ...doc.data, spaceID: id, spaceName: title } }
  })

  const baseDocuments = removeOrphanedSpaceDocuments(state.documents, spaceDocuments, id)
  const mergedDocuments = state.documents.length === 0 ? spaceDocuments : mergeDocuments(baseDocuments, spaceDocuments)
  const spaceErrors = errors && errors.length > 0 ? errors : []

  return update(state, {
    currentSpaceID: { $set: id },
    currentSpaceName: { $set: title },
    isLoading: { $set: false },
    documents: { $set: mergedDocuments },
    errors: { $push: spaceErrors }
  })
}

const leaveSpace = (state, { cuid, isPublic }) => {
  if (!isPublic) {
    return update(state, {
      documents: docs => docs.filter(doc => doc.data.spaceID !== cuid || doc.permissions.hasMembership)
    })
  }
}

const mergeDocuments = (current, incoming) => {
  const merged = sortBy(current.concat(incoming), item => item.data.updatedAt).reverse()
  return uniqWith(merged, (a, b) => { return a.id === b.id && a.type === b.type })
}

const removeDocument = (state, data) => {
  const { type, id } = data
  const docIdx = findDocument(state, type, id)

  if (docIdx.index >= 0) {
    const docsKey = docIdx.isArchived ? 'archivedDocuments' : 'documents'
    return {
      [docsKey]: update(state[docsKey], {
        '$splice': [[docIdx.index, 1]]
      })
    }
  }
}

const removeOrphanedSpaceDocuments = (baseDocuments = [], spaceDocuments = [], spaceID) => {
  if (baseDocuments.length === 0) return []
  if (!spaceID) return baseDocuments

  const clonedDocuments = cloneDeep(baseDocuments)

  // If a document exists in the main list that is no longer in the space, update
  for (let i = 0; i < clonedDocuments.length; i++) {
    if (clonedDocuments[i] && clonedDocuments[i].data.spaceID === spaceID) {
      const isInSpace = spaceDocuments.findIndex(d => d.id === clonedDocuments[i].id && d.type === clonedDocuments[i].type) >= 0
      if (!isInSpace) {
        clonedDocuments[i].data.spaceID = ''
        clonedDocuments[i].data.spaceName = ''
      }
    }
  }

  return clonedDocuments
}

const resetPage = () => {
  return { page: 0 }
}

const actionHandlers = {
  // Server Actions - Documents
  [ ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.SUCCESS ]: documentsMoved,
  [ ActionTypes.API_ARCHIVE_DOCUMENT.SUCCESS ]: archiveDocument,
  [ ActionTypes.API_DELETE_DOCUMENT.SUCCESS ]: removeDocument,

  // Server Actions - Space
  [ ActionTypes.API_GET_ARCHIVED_SPACE_DOCUMENTS.SUCCESS ]: loadArchivedSpaceDocuments,
  [ ActionTypes.API_GET_SPACE.SUCCESS ]: loadSpaceDocuments,
  [ ActionTypes.API_LEAVE_SPACE.SUCCESS ]: leaveSpace,

  // Server Actions - From Sidebar
  [ ActionTypes.API_MOVE_DOCUMENTS_TO_SPACE.SUCCESS ]: (state, data) => {
    return documentsMoved(state, {
      data: { documents: data.documents },
      spaceID: data.id,
      spaceTitle: data.title
    })
  },

  // View Actions
  [ ActionTypes.DOCUMENT_MOVED ]: documentMoved,

  [ ActionTypes.GOTO_PAGE ]: (_, data) => ({
    page: data.page
  }),

  [ ActionTypes.SET_VIEW_TYPE ]: resetPage,
  [ ActionTypes.RESET_FILTERS ]: resetPage,
  [ ActionTypes.UPDATE_FILTERS ]: resetPage
}

export default createReducer(
  cachedInitialState(reducerName, defaultKeys, cachedKeys),
  actionHandlers,
  reducerName,
  Object.keys(cachedKeys)
)
