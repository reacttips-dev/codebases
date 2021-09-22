// Action Types
import * as ActionTypes from '../constants/ActionTypes'

export const initialState = {
  // The URL to be displayed on the frontend
  imageURL: '',

  // The signed URL from the uploader request
  // (used during the upload process)
  signedURL: ''
}

export default function iconReducer (state = initialState, action) {
  var { type, data } = action

  switch (type) {
    // Server actions
    // case ActionTypes.API_LOAD_SPACE.SUCCESS:
    // return updateImageURL(state, data.response.iconURL);

    case ActionTypes.UPLOAD_ICON.REQUEST_UPLOAD_SUCCESS:
      return updateSignedURL(state, data.response[0].signedurl)

    case ActionTypes.UPLOAD_ICON.REQUEST_UPLOAD_FAILURE:
      return updateSignedURL(state, '')

    case ActionTypes.LOAD_TEMP_IMAGE.SUCCESS:
      return updateImageURL(state, data.url)

    case ActionTypes.LOAD_TEMP_IMAGE.FAILURE:
    case ActionTypes.API_DELETE_ICON.SUCCESS:
      return updateImageURL(state, '')

      //  TODO: Activate with live API
      //  case ActionTypes.UPLOAD_ICON.PUT_FILE_SUCCESS :
      //  return updateImageURL(state, data.signedURLs);

      // View actions

    default:
      return state
  }
}

function updateImageURL (state, url) {
  return Object.assign({}, state, {
    imageURL: url
  })
}

function updateSignedURL (state, url) {
  return Object.assign({}, state, {
    signedURL: url
  })
}
