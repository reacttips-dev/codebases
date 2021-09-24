/* eslint-disable no-constant-condition */
import React from 'react'
import get from 'lodash/get'
import { camelizeKeys } from 'humps'
import {
  actionChannel,
  call,
  fork,
  put,
  select,
  take,
} from 'redux-saga/effects'
import { fetchCredentials, getHeaders, sagaFetch } from './api'
import { openAlert } from '../actions/modals'
import { temporaryEditorAssetCreated } from '../actions/editor'
import { temporaryAssetCreated } from '../actions/profile'
import {
  imageGuid,
  isValidFileType,
  processImage,
  SUPPORTED_IMAGE_TYPES,
} from '../helpers/file_helper'
import { s3CredentialsPath } from '../networking/api'
import { AUTHENTICATION, EDITOR, PROFILE } from '../constants/action_types'
import DialogContainer from '../containers/DialogContainer'

const uploadTypes = [
  PROFILE.SAVE_AVATAR,
  PROFILE.SAVE_COVER,
  EDITOR.SAVE_ASSET,
]

export function* fetchS3Credentials(accessToken) {
  const response = yield call(sagaFetch, s3CredentialsPath().path, {
    method: 'GET',
    headers: getHeaders(accessToken),
  })
  return response.json
}

function* popAlertsForFile({ fileType, isValid }, { type }) {
  if (isValid) {
    if (fileType === SUPPORTED_IMAGE_TYPES.GIF &&
        (type === PROFILE.SAVE_AVATAR ||
         type === PROFILE.SAVE_COVER)) {
      yield put(openAlert(
        <DialogContainer
          title="Looks like you uploaded a .gif."
          body="If it’s animated people will only see the animation on your profile page."
        />,
      ))
    }
  } else {
    yield put(openAlert(
      <DialogContainer
        title="Invalid file type"
        body="We support .jpg, .gif, .png, and .bmp files."
      />,
    ))
    throw new Error('Invalid file type')
  }
}

function getFilename(type) {
  return `ello-${imageGuid() + type.replace('image/', '.')}`
}

function getFileKey(prefix, filename) {
  return `${prefix}/${encodeURIComponent(filename)}`
}

function getAssetUrl(endpoint, key) {
  return `${endpoint}/${key}`
}

function getUploadData(key, credentials, file, fileData) {
  const data = new FormData()
  data.append('key', key)
  data.append('AWSAccessKeyId', credentials.access_key)
  data.append('acl', 'public-read')
  data.append('success_action_status', '201')
  data.append('policy', credentials.policy)
  data.append('signature', credentials.signature)
  data.append('Content-Type', file.type)
  data.append('file', fileData || file)
  return data
}

function* performUpload(action) {
  const { payload, type, meta } = action
  const { endpoint, file } = payload
  const REQUEST = `${type}_REQUEST`
  const SUCCESS = `${type}_SUCCESS`
  const FAILURE = `${type}_FAILURE`
  let tokenJSON = null
  if (action.type === AUTHENTICATION.REFRESH) {
    // access token not needed for refreshing the existing token.
    // This shortcuts a request to get a public token.
    tokenJSON = { token: { access_token: null } }
  } else {
    tokenJSON = yield call(fetchCredentials)
  }
  const accessToken = get(tokenJSON, 'token.access_token')
  let assetUrl
  let uid

  function* postAsset(credentials, fileData) {
    const filename = getFilename(file.type)
    const { prefix, endpoint: assetEndpoint } = credentials
    const key = getFileKey(prefix, filename)
    assetUrl = getAssetUrl(assetEndpoint, key)

    const response = yield call(sagaFetch, assetEndpoint, {
      method: 'POST',
      body: getUploadData(key, credentials, file, fileData),
    })
    const { serverResponse } = response
    return serverResponse
  }


  // Dispatch start of request
  yield put({ type: REQUEST, payload, meta })

  try {
    const fileData = yield call(isValidFileType, file)
    yield call(popAlertsForFile, fileData, action)
    // TODO: add max width/height for avatars
    // TODO: figure out a cool way to display the initial image before processing
    const objectURL = URL.createObjectURL(file)
    if (fileData.fileType === SUPPORTED_IMAGE_TYPES.GIF) {
      if (type === EDITOR.SAVE_ASSET) {
        const { editorId } = payload
        yield put(temporaryEditorAssetCreated(objectURL, editorId))
        uid = yield select(state => state.editor.getIn([editorId, 'uid']) - 2)
      } else if (type === PROFILE.SAVE_AVATAR) {
        yield put(temporaryAssetCreated(PROFILE.TMP_AVATAR_CREATED, objectURL))
      } else if (type === PROFILE.SAVE_COVER) {
        yield put(temporaryAssetCreated(PROFILE.TMP_COVER_CREATED, objectURL))
      }
      const { credentials } = yield call(fetchS3Credentials, accessToken)
      yield call(postAsset, credentials)
    } else {
      const imageData = yield call(processImage, { ...fileData, file: objectURL })
      if (type === EDITOR.SAVE_ASSET) {
        const { editorId } = payload
        yield put(temporaryEditorAssetCreated(imageData.objectURL, editorId))
        // The - 2 should always be consistent. The reason is that when a tmp image
        // gets created at say uid 1 an additional text block is added to the bottom
        // of the editor at uid 2 and the uid of the editor is now sitting at 3
        // since it gets incremented after a block is added. So the - 2 gets us from
        // the 3 back to the 1 where the image should reconcile back to.
        uid = yield select(state => state.editor.getIn([editorId, 'uid']) - 2)
      } else if (type === PROFILE.SAVE_AVATAR) {
        yield put(temporaryAssetCreated(PROFILE.TMP_AVATAR_CREATED, imageData.objectURL))
      } else if (type === PROFILE.SAVE_COVER) {
        yield put(temporaryAssetCreated(PROFILE.TMP_COVER_CREATED, imageData.objectURL))
      }
      const { credentials } = yield call(fetchS3Credentials, accessToken)
      yield call(postAsset, credentials, imageData.blob)
    }

    // this should only happen when adding assets to an editor
    // on the page since we don't hit the API directly for that
    if (!endpoint) {
      payload.response = { url: assetUrl }
      payload.uid = uid
      yield put({ meta, payload, type: SUCCESS })
      return
    }

    // the rest of the below should only happen when uploading
    // avatars and cover images as they need to save to our API
    // profile after successful upload to s3
    const saveLocationToApi = function* saveLocationToApi() {
      const vo = (type === PROFILE.SAVE_AVATAR) ?
        { remote_avatar_url: assetUrl } :
        { remote_cover_image_url: assetUrl }
      const response = yield call(sagaFetch, endpoint.path, {
        method: 'PATCH',
        headers: getHeaders(accessToken),
        body: JSON.stringify(vo),
      })
      return response.json
    }
    const response = yield call(saveLocationToApi)
    payload.response = camelizeKeys(response)
    yield put({ meta, payload, type: SUCCESS })
  } catch (error) {
    yield put({ error, meta, payload, type: FAILURE })
  }
}

function* handleUpload(uploadChannel) {
  while (true) {
    const action = yield take(uploadChannel)
    yield fork(performUpload, action)
  }
}

export default function* uploader() {
  const uploadChannel = yield actionChannel(uploadTypes)
  yield fork(handleUpload, uploadChannel)
}
