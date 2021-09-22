import { call, fork, put } from 'redux-saga/effects'
import { takeLatest } from 'redux-saga'

import * as ActionTypes from '../constants/ActionTypes'
import * as ServerURLs from '../constants/ServerURLs'
import { BOARD, FREEHAND, PROTOTYPE, PRESENTATION, RHOMBUS, SPEC, HARMONY } from '../constants/DocumentTypes'

import * as serverActions from '../actions/serverActions'
import request from '../utils/API'
import getCookie from '../utils/getCookie'

export function buildParamString (params) {
  let paramString = ''

  for (var key in params) {
    if (params[key]) {
      paramString += paramString === '' ? '?' : '&'
      paramString += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    }
  }

  return paramString
}

export function * getArchivedSpaceDocuments (action) {
  const { spaceID } = action.data

  const endpoint = ServerURLs.GET_ARCHIVED_SPACE_DOCUMENTS.replace(':id', spaceID)

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'GET'
    })

    if (error) {
      yield put(serverActions.getArchivedSpaceDocuments.failure(error))
    } else {
      yield put(serverActions.getArchivedSpaceDocuments.success(response))
    }
  } else {
    yield put(serverActions.getArchivedSpaceDocuments.failure({ error: { msg: 'No XSRF Token provided' } }))
  }
}

export function * archiveDocument (action) {
  const { type, id } = action.data

  let endpoint = ''

  switch (type) {
    case PRESENTATION:
      endpoint = ServerURLs.ARCHIVE_PRESENTATION.replace(':id', id)
      break
    case PROTOTYPE:
      endpoint = ServerURLs.ARCHIVE_PROTOTYPE.replace(':id', id)
      break
    case BOARD:
      endpoint = ServerURLs.ARCHIVE_BOARD.replace(':id', id)
      break
    case FREEHAND:
      endpoint = ServerURLs.ARCHIVE_FREEHAND.replace(':id', id)
      break
    case RHOMBUS:
      endpoint = ServerURLs.ARCHIVE_RHOMBUS.replace(':id', id)
      break
    case SPEC:
      endpoint = ServerURLs.ARCHIVE_SPEC.replace(':id', id)
      break
    default:
      break
  }

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'POST'
    })

    if (error) {
      yield put(serverActions.archiveDocument.failure({ type, id, error }))
    } else {
      yield put(serverActions.archiveDocument.success({ type, id, response }))
    }
  } else {
    yield put(serverActions.archiveDocument.failure({ type, id, error: { msg: 'No XSRF Token provided' } }))
  }
}

export function * activateDocument (action) {
  const { type, id } = action.data

  let endpoint = ''

  switch (type) {
    case PROTOTYPE:
      endpoint = ServerURLs.ACTIVATE_PROTOTYPE.replace(':id', id)
      break
    case BOARD:
      endpoint = ServerURLs.ACTIVATE_BOARD.replace(':id', id)
      break
    case FREEHAND:
      endpoint = ServerURLs.ACTIVATE_FREEHAND.replace(':id', id)
      break
    case RHOMBUS:
      endpoint = ServerURLs.ACTIVATE_RHOMBUS.replace(':id', id)
      break
    case SPEC:
      endpoint = ServerURLs.ACTIVATE_SPEC.replace(':id', id)
      break
    default:
      break
  }

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'POST'
    })

    if (error) {
      yield put(serverActions.activateDocument.failure({ type, id, error }))
    } else {
      yield put(serverActions.activateDocument.success({ type, id, response }))
    }
  } else {
    yield put(serverActions.activateDocument.failure({ type, id, error: { msg: 'No XSRF Token provided' } }))
  }
}

export function * deleteDocument (action) {
  const { type, id } = action.data

  let endpoint = ''

  switch (type) {
    case PROTOTYPE:
      endpoint = ServerURLs.DELETE_PROTOTYPE.replace(':id', id)
      break
    case BOARD:
      endpoint = ServerURLs.DELETE_BOARD.replace(':id', id)
      break
    case FREEHAND:
      endpoint = ServerURLs.DELETE_FREEHAND.replace(':id', id)
      break
    case PRESENTATION:
      endpoint = ServerURLs.DELETE_PRESENTATION.replace(':id', id)
      break
    case SPEC:
      endpoint = ServerURLs.DELETE_SPEC.replace(':id', id)
      break
    case HARMONY:
      endpoint = ServerURLs.DELETE_HARMONY.replace(':id', id)
      break
    default:
      endpoint = ServerURLs.DELETE_EXTERNAL.replace(':id', id).replace(':type', type)
      break
  }

  const XSRFToken = getCookie('XSRF-TOKEN')

  if (XSRFToken) {
    const { error, response } = yield call(request, endpoint, {
      method: 'DELETE',
      noBody: true
    })

    if (error) {
      yield put(serverActions.deleteDocument.failure({ type, id, error }))
    } else {
      yield put(serverActions.deleteDocument.success({ type, id, response }))
    }
  } else {
    yield put(serverActions.deleteDocument.failure({ type, id, error: { msg: 'No XSRF Token provided' } }))
  }
}

export function * watchArchiveDocumentRequest () {
  yield * takeLatest(ActionTypes.API_ARCHIVE_DOCUMENT.REQUEST, archiveDocument)
}

export function * watchActivateDocumentRequest () {
  yield * takeLatest(ActionTypes.API_ACTIVATE_DOCUMENT.REQUEST, activateDocument)
}

export function * watchDeleteDocumentRequest () {
  yield * takeLatest(ActionTypes.API_DELETE_DOCUMENT.REQUEST, deleteDocument)
}

export function * watchGetArchivedSpaceDocumentsRequest () {
  yield * takeLatest(ActionTypes.API_GET_ARCHIVED_SPACE_DOCUMENTS.REQUEST, getArchivedSpaceDocuments)
}

export default function * documentSaga () {
  yield [
    fork(watchArchiveDocumentRequest),
    fork(watchActivateDocumentRequest),
    fork(watchDeleteDocumentRequest),
    fork(watchGetArchivedSpaceDocumentsRequest)
  ]
}
