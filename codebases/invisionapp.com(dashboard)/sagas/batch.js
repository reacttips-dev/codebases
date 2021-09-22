import { call, fork, put, select } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'
import * as ActionTypes from '../constants/ActionTypes'
import * as ServerURLs from '../constants/ServerURLs'
import {
  APP_SPACE_DOCUMENT_ADDED,
  APP_SPACE_ADDEXISTING_BATCHADDED
} from '../constants/TrackingEvents'

import { analyticsSpaceTypeSelector } from '../selectors/batch'

import * as actions from '../actions/index'
import * as serverActions from '../actions/serverActions'
import { trackEvent } from '../utils/analytics'
import request from '../utils/API'
import getCookie from '../utils/getCookie'
import normalizeAnalyticsDocumentType from '../utils/normalizeAnalyticsDocumentType'

export function * addDocumentsToSpace (action) {
  const { spaceID, spaceTitle, documents } = action.data

  const state = yield select()

  const spaceType = analyticsSpaceTypeSelector(state)
  const { pagingEnabled } = state.config

  const endpoint = ServerURLs.ADD_DOCUMENT_TO_SPACE.replace(':spaceID', spaceID)

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    })

    let { error, response } = yield call(request, endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(documents.map(doc => ({
        documentId: doc.id + '',
        documentType: doc.resourceType ? doc.resourceType : doc.type
      })))
    })

    if (error || (response && response.errors && response.errors.length > 0)) {
      yield put(actions.closeModal())
      yield put(serverActions.addDocumentsToSpace.failure({
        documents: documents,
        spaceTitle
      }))
    } else {
      const { title, id, documents = [] } = response.data

      documents.forEach((document) => {
        trackEvent(APP_SPACE_DOCUMENT_ADDED, {
          spaceId: id,
          spaceType,
          spaceDocumentContext: 'add-existing',
          documentType: normalizeAnalyticsDocumentType(document.type)
        })
      })

      // Extra payload fields (alert reducer uses them)
      response.spaceID = id
      response.spaceTitle = title

      trackEvent(APP_SPACE_ADDEXISTING_BATCHADDED, {
        spaceId: id,
        spaceType,
        docCount: documents.length
      })

      yield put(actions.closeModal())
      yield put(serverActions.addDocumentsToSpace.success(response))

      if (pagingEnabled) {
        yield put(serverActions.getSpaceV2.request(id))
      }
    }
  } else {
    yield put(serverActions.addDocumentsToSpace.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * moveDocumentsToContainer (action) {
  const {
    containerType,
    containerId,
    containerTitle,
    documents,
    alert = true
  } = action.data

  const endpoint = ServerURLs.MOVE_DOCUMENTS_V3

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    })

    let { error, response } = yield call(request, endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        documents: documents.map(doc => ({
          documentId: doc.id + '',
          documentType: doc.resourceType ? doc.resourceType : doc.type
        })),
        [containerType === 'space' ? 'spaceId' : 'projectId']: containerId
      })
    })

    if (
      error ||
      !response ||
      (
        response &&
        ('errorCount' in response) &&
        ('successCount' in response) &&
        response.errorCount > 0 &&
        response.successCount === 0
      )
    ) {
      yield put(actions.closeModal())
      yield put(serverActions.moveDocumentsToContainer.failure({
        errorCount: documents.length,
        documents,
        containerTitle
      }))
    } else {
      const successCount = response.successCount || 0
      const errorCount = response.errorCount || 0

      // Extra payload fields (alert reducer uses them)
      response.containerType = containerType
      response.containerId = containerId
      response.containerTitle = containerTitle
      response.alert = alert

      trackEvent(APP_SPACE_ADDEXISTING_BATCHADDED, {
        [containerType === 'space' ? 'spaceId' : 'projectId']: containerId,
        docCount: successCount,
        errorCount
      })

      if (containerType === 'space') {
        yield put(serverActions.getSpaceV2.request(containerId))
      }

      yield put(actions.closeModal())
      yield put(serverActions.moveDocumentsToContainer.success(response))
    }
  } else {
    yield put(serverActions.moveDocumentsToContainer.failure({ msg: 'No XSRF Token provided' }))
  }
}

export function * watchAddDocumentsToSpaceRequest () {
  yield takeLatest(ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.REQUEST, addDocumentsToSpace)
}

export function * watchMoveDocumentsToContainerRequest () {
  yield takeLatest(ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.REQUEST, moveDocumentsToContainer)
}

export default function * batch () {
  yield [
    fork(watchAddDocumentsToSpaceRequest),
    fork(watchMoveDocumentsToContainerRequest)
  ]
}
