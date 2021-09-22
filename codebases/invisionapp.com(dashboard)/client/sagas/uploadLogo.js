import { call, put, takeLatest } from 'redux-saga/effects'
import API from '../api'
import { UPLOAD_LOGO, uploadLogo } from '../stores/logo'
import { teamLogoUpdate } from '../stores/team'

/**
 * Handles the sequence of asynchronous calls required to complete
 * the logo upload process:
 * 1. Delete the existing logo
 * 2. Fetch the new logo urls (S3 upload endpoint and new logo GUID)
 * 3. Upload the file to S3
 * @param {*} action The incoming FSA-compliant action
 */
export function* uploadSaga(action) {
  const notification = action?.payload?.notification ?? null
  try {
    // Delete the existing logo so we can get a fresh file GUID
    yield call(API.delete, 'team/logo')

    // Fetch the S3 URLs and generate the new logo file GUID
    const logoUrls = yield call(API.get, 'team/logo')

    // Upload the file to S3
    yield call(API.postFile, logoUrls.previewPutUrl, action.payload.file, {
      timeout: 15000
    })

    yield put(uploadLogo.success(logoUrls))
    yield put(teamLogoUpdate(logoUrls))
  } catch (error) {
    yield put(uploadLogo.failure(error.message, notification))
  }
}

function* watch() {
  yield takeLatest(UPLOAD_LOGO.REQUEST, uploadSaga)
}

export default watch
