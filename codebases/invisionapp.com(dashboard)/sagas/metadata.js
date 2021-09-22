import { call, fork, put, select } from 'redux-saga/effects'
import { takeEvery, takeLatest } from 'redux-saga'

import * as ActionTypes from '../constants/ActionTypes'
import { APP_HOME_DATA_FETCHED } from '../constants/TrackingEvents'
import { GET_PERMISSIONS, GET_FREEHAND_METADATA } from '../constants/ServerURLs'
import { SORT_ALPHA, SORT_CREATED, SORT_UPDATED } from '../constants/SortTypes'
import { permissionsSelector } from '../selectors/metadata'

import * as serverActions from '../actions/serverActions'

import { mapSidebarPathname } from '../utils/mapPaths'
import { trackEvent } from '../utils/analytics'
import request from '../utils/API'
import { getItem } from '../utils/cache'
import generateInitialDocumentsURL, { getStoredSort } from '../utils/generateInitialDocumentsURL'

let firstLoad = true

const { appShell } = window.inGlobalContext
appShell.getFeatureContext('home').on('before:unmount', () => {
  firstLoad = true
})

export function * getInitialDocuments (action) {
  const hasCachedData = getItem('home.metadata.initialDocuments', false)
  const { externalDocFilterEntries, isExternalDocType, docType, enableFreehandXFilteringSorting } = action.data
  let loadTime = 0
  let renderTime = 0
  let renderStart = 0
  let response = null

  const generatedURL = generateInitialDocumentsURL(
    window.location.pathname,
    externalDocFilterEntries,
    isExternalDocType,
    docType,
    enableFreehandXFilteringSorting
  )

  const { error, response: _response, loadTime: _loadTime } = yield call(
    request,
    generatedURL.url,
    { method: 'GET' },
    'home-v1-projects-list'
  )

  response = _response
  loadTime = _loadTime
  renderStart = window.performance.now()

  if (error) {
    yield put(serverActions.getInitialDocuments.failure(error))
    trackEvent(APP_HOME_DATA_FETCHED, {
      status: 'failure',
      requestPageCount: 1
    })
  } else {
    yield put(serverActions.getInitialDocuments.success(_response))

    if (renderStart > 0) {
      renderTime = window.performance.now() - renderStart
    }

    const sortValue = getStoredSort()
    let analyticsSortName = 'viewed'

    switch (sortValue) {
      case SORT_CREATED:
        analyticsSortName = 'created'
        break
      case SORT_UPDATED:
        analyticsSortName = 'updated'
        break
      case SORT_ALPHA:
        analyticsSortName = 'alphabetical'
        break
    }

    if (firstLoad && !hasCachedData && response && response.resources) {
      if (window.rum) {
        const props = {
          featureName: 'home',
          cachedAppData: false,
          resourcesLoadTime: loadTime,
          resourcesRenderTime: renderTime
        }

        window.rum.markTime('spaDataFullyLoaded', props)
      }

      firstLoad = false
    }

    yield put(serverActions.getDocumentsMetadata.request(_response.resources || [], {
      index: 0,
      newRequest: true,
      page: 1,
      pageSize: 50,
      pageContext: mapSidebarPathname(window.location.pathname),
      resourcesLoaded: true,
      resourcesReturned: _response.resources.length || 0,
      sort: analyticsSortName,
      spaceFilter: false,
      timeToResourcesFetched: loadTime,
      timeToResourcesRendered: renderTime,
      type: 'all'
    }))
  }
}

export function * getPermissions (action) {
  const { documents, analyticsData } = action.data

  const start = window.performance.now()

  const existing = yield select(permissionsSelector)

  const body = { documents: documents.filter(doc => {
    return !([`${doc.resourceType}-${doc.id}`] in existing)
  }).map(doc => {
    return {
      type: doc.resourceType,
      id: doc.id,
      spaceId: doc.space && doc.space.id !== '' ? doc.space.id : '',
      key: `${doc.resourceType}-${doc.id}`
    }
  }) }

  if (body.documents.length === 0) {
    yield put(serverActions.getDocumentsMetadata.permissionsSuccess({
      index: analyticsData.index,
      permissions: {},
      permissionsLoadTime: 0
    }))

    return
  }

  const { error, response } = yield call(request, GET_PERMISSIONS, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  })

  if (error) {
    yield put(serverActions.getDocumentsMetadata.permissionsFailure(error))
  } else {
    const end = window.performance.now()
    yield put(serverActions.getDocumentsMetadata.permissionsSuccess({
      ...response,
      index: analyticsData.index,
      permissionsLoadTime: end - start
    }))
  }
}

export function * getFreehandMetadata (action) {
  const { documents, analyticsData } = action.data

  const start = window.performance.now()

  // The data is fetch by only freehand document ids
  const freehandDocumentIds = documents.reduce((queries, document) => {
    if (document.resourceType === 'freehand') {
      queries.push(['ids', document.id])
    }

    return queries
  }, [])

  if (freehandDocumentIds.length === 0) {
    yield put(serverActions.getDocumentsMetadata.freehandMetadataSuccess({
      documents: {},
      index: analyticsData.index,
      loadTime: 0
    }))

    return
  }

  const search = new URLSearchParams(freehandDocumentIds).toString()

  const { error, response } = yield call(request, `${GET_FREEHAND_METADATA}?${search}`, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' })
  })

  if (error) {
    yield put(serverActions.getDocumentsMetadata.freehandMetadataFailure(error))
  } else if (response.documents) {
    const end = window.performance.now()

    // Convert data from an array to an indexed object to avoid a lot of loops later
    const indexedDocuments = response.documents.reduce((indexed, document) => {
      return {
        [document.id]: document,
        ...indexed
      }
    }, {})

    yield put(serverActions.getDocumentsMetadata.freehandMetadataSuccess({
      documents: indexedDocuments,
      index: analyticsData.index,
      loadTime: end - start
    }))
  }
}

export function * watchGetInitialDocumentsRequest () {
  yield * takeLatest(ActionTypes.API_GET_INITIAL_DOCUMENTS.REQUEST, getInitialDocuments)
}

export function * watchGetPermissionsRequest () {
  yield * takeEvery(ActionTypes.API_GET_DOCUMENT_METADATA.REQUEST, getPermissions)
}

export function * watchGetFreehandMetadataRequest () {
  yield * takeLatest(ActionTypes.API_GET_DOCUMENT_METADATA.REQUEST, getFreehandMetadata)
}

export function * watchGetFreenhandMetadataRequestOnly () {
  yield * takeLatest(ActionTypes.API_GET_FREEHAND_METADATA.REQUEST, getFreehandMetadata)
}

export default function * metadata () {
  yield [
    fork(watchGetInitialDocumentsRequest),
    fork(watchGetPermissionsRequest),
    fork(watchGetFreehandMetadataRequest),
    fork(watchGetFreenhandMetadataRequestOnly)
  ]
}
