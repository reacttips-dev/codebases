import update from 'immutability-helper'

import createReducer, { cachedInitialState } from '../utils/create-reducer'
import * as ActionTypes from '../constants/ActionTypes'

import { APP_HOME_DATA_FETCHED } from '../constants/TrackingEvents'
import { trackEvent } from '../utils/analytics'
import generateInitialDocumentsURL from '../utils/generateInitialDocumentsURL'

export const reducerName = 'metadata'

export const defaultKeys = {
  analytics: [],
  initialDocumentsError: false,
  initialDocumentsLoading: true,
  initialDocumentsLoaded: false,
  page: 0,
  permissions: {},
  removals: [],
  spaceOverrides: {},
  freehands: {}
}

export const cachedKeys = {
  cachedUrl: '',
  initialDocuments: [],
  initialDocumentsCursor: '',
  initialDocumentsParams: {}
}

const checkAnalytics = (analytics, index) => {
  if (index === -1 || !analytics || !analytics[index]) return

  if (
    analytics[index].permissionsLoaded &&
    analytics[index].resourcesLoaded &&
    !analytics[index].eventSent
  ) {
    trackEvent(APP_HOME_DATA_FETCHED, {
      status: 'success',
      timeToResourcesFetched: analytics[index].timeToResourcesFetched,
      timeToResourcesRendered: analytics[index].timeToResourcesRendered,
      permissionsLoadTime: analytics[index].permissionsLoadTime,
      resourcesReturned: analytics[index].resourcesReturned,
      requestPageCount: analytics[index].page,
      pageSize: analytics[index].pageSize,
      pageContext: analytics[index].pageContext,
      sort: analytics[index].sort,
      spaceFilter: analytics[index].spaceFilter,
      type: analytics[index].type
    })

    return update(analytics, { [index]: {
      eventSent: { '$set': true }
    } })
  }

  return analytics
}

const documentMoved = (state, data) => {
  const { documentType, documentID, spaceCUID, spaceTitle } = data
  return documentsMoved(state, {
    documents: [{ documentType, documentId: documentID }],
    spaceId: spaceCUID,
    spaceName: spaceTitle
  })
}

const documentsMoved = (state, { documents = [], spaceId, spaceName }) => {
  let overrides = {}

  if (documents.length > 0) {
    documents.forEach(doc => {
      overrides[`${doc.documentType}-${doc.documentId}`] = {
        id: spaceId,
        title: spaceName,
        documentId: doc.documentId,
        documentType: doc.documentType
      }
    })
  }

  return {
    spaceOverrides: update(state.spaceOverrides, { $merge: overrides })
  }
}

const removeDocument = (state, data) => {
  const { type, id } = data
  return {
    removals: update(state.removals, {
      '$push': [{ type, id }]
    })
  }
}

const actionHandlers = {
  [ ActionTypes.API_ARCHIVE_DOCUMENT.SUCCESS ]: removeDocument,
  [ ActionTypes.API_DELETE_DOCUMENT.SUCCESS ]: removeDocument,

  [ ActionTypes.API_GET_INITIAL_DOCUMENTS.REQUEST ]: (_, data) => {
    const { isExternalDocType, docType, externalDocFilterEntries, enableFreehandXFilteringSorting } = data
    const generatedUrl = generateInitialDocumentsURL(
      window.location.pathname,
      externalDocFilterEntries,
      isExternalDocType,
      docType,
      enableFreehandXFilteringSorting
    )

    return {
      cachedUrl: generatedUrl.url,
      initialDocumentsParams: generatedUrl.params,
      initialDocumentsLoaded: true
    }
  },

  [ ActionTypes.API_GET_INITIAL_DOCUMENTS.SUCCESS ]: (_, data) => ({
    initialDocuments: data && data.resources ? data.resources : [],
    initialDocumentsCursor: data && data.pagination && data.pagination.cursor ? data.pagination.cursor : '',
    initialDocumentsError: false,
    initialDocumentsLoading: false
  }),

  [ ActionTypes.API_GET_INITIAL_DOCUMENTS.FAILURE ]: () => ({
    initialDocuments: [],
    initialDocumentsError: true,
    initialDocumentsCursor: '',
    initialDocumentsLoading: false
  }),

  [ ActionTypes.API_MOVE_DOCUMENTS_TO_SPACE.SUCCESS ]: (state, data) => {
    return documentsMoved(state, {
      documents: data.documents,
      spaceId: data.id,
      spaceName: data.title
    })
  },

  [ ActionTypes.API_GET_DOCUMENT_METADATA.REQUEST ]: (state, data) => {
    const { analyticsData } = data

    return {
      page: analyticsData.page,
      analytics: update(state.analytics, {
        '$push': [analyticsData]
      })
    }
  },

  [ActionTypes.API_GET_DOCUMENT_METADATA.PERMISSIONS_SUCCESS]: (state, data) => {
    const analytics = data.index >= 0 ? update(state.analytics, { [data.index]: {
      permissionsLoaded: { '$set': true },
      permissionsLoadTime: { '$set': data.permissionsLoadTime }
    } }) : state.analytics

    const checkedAnalytics = checkAnalytics(analytics, data.index)

    return {
      analytics: checkedAnalytics,
      permissions: update(state.permissions, { $merge: data.permissions || {} })
    }
  },

  [ActionTypes.API_GET_DOCUMENT_METADATA.FREEHAND_METADATA_SUCCESS]: (state, data) => {
    const analytics = data.index >= 0 ? update(state.analytics, { [data.index]: {
      freehandMetadataLoadTime: { '$set': data.loadTime }
    } }) : state.analytics

    const checkedAnalytics = checkAnalytics(analytics, data.index)

    return {
      analytics: checkedAnalytics,
      freehands: update(state.freehands, { $merge: data.documents || {} })
    }
  },

  [ ActionTypes.DOCUMENT_MOVED ]: documentMoved,

  [ActionTypes.SET_VIEW_TYPE]: () => {
    return {
      removals: [],
      spaceOverrides: {}
    }
  }
}

export default createReducer(
  cachedInitialState(reducerName, defaultKeys, cachedKeys),
  actionHandlers,
  reducerName,
  Object.keys(cachedKeys)
)
