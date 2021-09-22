import { call, put, takeLatest } from 'redux-saga/effects'
import _get from 'lodash/get'
import API from '../api'
import { UPDATE_PROFILE, updateUserProfile } from '../stores/user'
import { ERROR_PROFILE } from '../helpers/errorMessages'

/**
 * Handles the sequence of asynchronous calls required to complete
 * the avatar upload process:
 * 1. Delete the existing avatar
 * 2. Fetch the new avatar urls (S3 upload endpoint and new avatar GUID)
 * 3. Upload the file to S3
 * @param {*} action The incoming FSA-compliant action
 */
export function* updateUserProfileSaga(action) {
  const notification = action?.payload?.notification ?? null
  try {
    let userProfile = {
      name: action.payload.data.name
    }
    if (action.payload.data.avatar) {
      // Handle the avatar upload / delete in a separate try / catch
      // This allows us to display a more accurate error message for avatar failures
      try {
        // Delete the existing logo so we can get a fresh file GUID
        yield call(API.delete, 'user/avatar')
        if (!action.payload.data.avatar.delete) {
          // Fetch the S3 URLs and generate the new avatar file GUID
          const avatarResponse = yield call(API.get, 'user/avatar')

          // Upload the file to assets api
          yield call(API.postFile, avatarResponse.putUrl, action.payload.data.avatar.file, {
            timeout: 15000
          })
          userProfile = {
            ...userProfile,
            avatarID: avatarResponse.id,
            avatarURL: avatarResponse.getUrl
          }
        }
      } catch (error) {
        const avatarErrorMessage = `
        Your avatar couldn't be ${
          action.payload.data.avatar.delete ? 'removed' : 'updated'
        }, sorry about that! Try again.`
        throw Error(avatarErrorMessage)
      }
    }

    yield call(API.update, 'user/profile', null, userProfile)

    yield put(updateUserProfile.success())
  } catch (error) {
    let message = _get(error, 'response.data.message.name') || ERROR_PROFILE

    if (Array.isArray(message)) {
      message = message.join(' ')
    }

    yield put(updateUserProfile.failure(message, notification))
  }
}

function* watch() {
  yield takeLatest(UPDATE_PROFILE.REQUEST, updateUserProfileSaga)
}

export default watch
