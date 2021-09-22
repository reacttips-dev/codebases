import { call, fork, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import * as ActionTypes from '../constants/ActionTypes'
import * as ServerURLs from '../constants/ServerURLs'
import { BOARD, FREEHAND, PROTOTYPE, RHOMBUS, SPEC } from '../constants/DocumentTypes'

import * as actions from '../actions'
import * as serverActions from '../actions/serverActions'
import request from '../utils/API'
import getCookie from '../utils/getCookie'
import { trackEvent } from '../utils/analytics'

export function * addDocumentToContainer (action) {
  const { documentType, documentId, type, id } = action.data
  const endpoint = ServerURLs.MOVE_DOCUMENTS_V3

  const { error, response } = yield call(request, endpoint, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      documents: [{ documentType, documentId }],
      [type]: id
    })
  })

  if (error) {
    yield put(serverActions.addDocumentToContainer.failure(error))
  } else {
    yield put(actions.analyticsSetContext({
      documentType: documentType
    }))

    yield put(serverActions.addDocumentToContainer.success(response))
  }
}

export function * createDocument (action) {
  const { type, data, projectId } = action.data
  const XSRFToken = getCookie('XSRF-TOKEN')

  if (!XSRFToken) {
    yield put(serverActions.createDocument.failure({ msg: 'No XSRF Token provided' }))
  }

  let endpoint = ''

  switch (type) {
    case BOARD:
      endpoint = ServerURLs.CREATE_BOARD
      break
    case FREEHAND:
      endpoint = ServerURLs.CREATE_FREEHAND
      break
    case PROTOTYPE:
      endpoint = ServerURLs.CREATE_PROTOTYPE
      break
    case RHOMBUS:
      endpoint = ServerURLs.CREATE_RHOMBUS
      break
    case SPEC:
      endpoint = ServerURLs.CREATE_SPEC
      break
    default:
      return
  }

  const { error, response } = yield call(request, endpoint, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data),
    showErrorBody: true
  })

  if (error) {
    yield put(serverActions.createDocument.failure({ type, response }))
  } else {
    if ((data.spaceCUID && data.spaceCUID !== '') || projectId !== '') {
      const containerType = projectId ? 'projectId' : 'spaceId'
      const containerId = projectId || data.spaceCUID

      let documentId = response.data && response.data.id ? response.data.id + '' : response.id + ''
      if (documentId === 'undefined' && response.document) {
        documentId = response.document.id + ''
      }

      yield addDocumentToContainer({
        data: {
          documentType: type,
          documentId,
          type: containerType,
          id: containerId
        }
      })
    }

    if (type === FREEHAND) {
      const doc = response.document

      if (doc != null) {
        trackEvent('App.Freehand.Created', {
          name: data.title,
          spaceCUID: data.spaceCUID,
          origin: data.isOnboarding ? 'onboarding' : 'HomeUI',
          documentID: doc.slug
        })
      }
    } else if (type === PROTOTYPE) {
      trackEvent('App.Prototype.Created', {
        prototypeId: response.data.id,
        userId: data.userID || null,
        isMobile: !!data.isMobile,
        isAdvanced: !!data.isAdvanced,
        spaceCUID: data.spaceCUID || null
      })
    } else if (type === SPEC) {
      trackEvent('App.Spec.Created', {
        specId: response.data.id,
        spaceCUID: data.spaceCUID || null
      })
    }

    yield put(serverActions.createDocument.success({ type, response }))
  }
}

export function * watchCreateDocumentRequest () {
  yield * takeLatest(ActionTypes.API_CREATE_DOCUMENT.REQUEST, createDocument)
}

export default function * create () {
  yield [
    fork(watchCreateDocumentRequest)
  ]
}
