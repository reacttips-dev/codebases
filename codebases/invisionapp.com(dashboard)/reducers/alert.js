import * as ActionTypes from '../constants/ActionTypes'
import errorMessages from '../constants/ErrorMessages'
import * as AlertMessages from '../constants/AlertMessages'

export const initialState = {
  documentTitle: '',
  message: '',
  type: 'info',
  timeout: 5000,
  retryLink: false,
  spaceID: '',
  spaceIsPublic: true,
  spaceName: '',
  spaceURL: ''
}

export default function alertReducer (state = initialState, action) {
  const { type, data } = action

  switch (type) {
    // Server Actions
    case ActionTypes.API_MOVE_DOCUMENTS_TO_SPACE.SUCCESS:
      return documentMovedSuccess(state, data)

    case ActionTypes.API_MOVE_DOCUMENTS_TO_SPACE.FAILURE:
      return documentMovedFailure(state, data)

    case ActionTypes.API_MOVE_DOCUMENTS_TO_PROJECT.SUCCESS:
      return documentMovedSuccess(state, data, true)

    case ActionTypes.API_MOVE_DOCUMENTS_TO_PROJECT.FAILURE:
      return documentMovedFailure(state, data)

    case ActionTypes.API_ARCHIVE_DOCUMENT.SUCCESS:
      return setAlert(state, { type: 'success', message: `${data.response.title ? data.response.title : 'Document was'} successfully archived`, retryLink: false })

    case ActionTypes.API_ARCHIVE_DOCUMENT.FAILURE:
      return setAlert(state, { type: 'danger', message: 'Could not archive document', retryLink: false })

    case ActionTypes.API_ACTIVATE_DOCUMENT.FAILURE:
      return setAlert(state, { type: 'danger', message: 'Could not restore document', retryLink: false })

    case ActionTypes.API_LEAVE_SPACE.SUCCESS:
      return setAlert(state, { type: 'success', message: 'Successfully left the Space', retryLink: false })

    case ActionTypes.API_LEAVE_SPACE.FAILURE:
      return setAlert(state, { type: 'danger', message: 'There was an error leaving the space. Please try again.', retryLink: false })

    case ActionTypes.API_UPDATE_SPACE.FAILURE: {
      const match = (action.data.response) ? action.data.response.message.match(/"INVALID_SPACE_TITLE: (([A-Z]|_)+)"/) : null
      const errorCode = (match !== null) ? match[1] : ''
      const message = errorMessages[errorCode] || 'There was an error updating your space. Please try again.'

      return setAlert(state, { message, type: 'danger', retryLink: false })
    }

    // View Actions
    case ActionTypes.SHOW_ALERT:
      return setAlert(state, data)

    case ActionTypes.START_DOCUMENT_DRAG:
      return Object.assign({}, state, {
        documentTitle: data.first.title
      })

    // Move a document to a space
    case ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.SUCCESS:
      let count = data.data.documents ? data.data.documents.length : 0
      return setAlert(state, {
        type: 'success',
        message: AlertMessages.ADD_DOCUMENTS_TO_SPACE_SUCCESS
          .replace('{count}', count)
          .replace('{spaceTitle}', data.spaceTitle)
          .replace('{s}', (count) !== 1 ? 's' : '')
      })

    case ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.FAILURE:
      count = data.documents ? data.documents.length : 0
      return setAlert(state, {
        type: 'danger',
        message: AlertMessages.ADD_DOCUMENTS_TO_SPACE_FAILURE
          .replace('{count}', count)
          .replace('{spaceTitle}', data.spaceTitle)
          .replace('{s}', (count) !== 1 ? 's' : '')
      })

    case ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.SUCCESS:
      count = data.successCount || 0
      const errorCount = data.errorCount || 0
      const toAlert = data.alert

      if (!toAlert) {
        return state
      }

      let message = AlertMessages.ADD_DOCUMENTS_TO_SPACE_SUCCESS
        .replace('{count}', count)
        .replace('{containerTitle}', data.containerTitle)
        .replace('{s}', (count) !== 1 ? 's' : '')

      if (errorCount > 0) {
        message = message.concat(AlertMessages.ADD_DOCUMENTS_TO_SPACE_PARTIAL_FAILURE
          .replace('{count}', errorCount)
          .replace('{s}', errorCount !== 1 ? 's' : '')
        )
      }

      return setAlert(state, {
        type: 'success',
        message
      })

    case ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER.FAILURE:
      count = data.errorCount || 0
      return setAlert(state, {
        type: 'danger',
        message: AlertMessages.ADD_DOCUMENTS_TO_SPACE_PERMISSIONS_FAILURE
          .replace('{count}', count)
          .replace('{containerTitle}', data.containerTitle)
          .replace('{s}', (count) !== 1 ? 's' : '')
      })

    default:
      return state
  }
}

function documentMovedFailure (state, data) {
  return setAlert(state, { type: 'danger', message: `${data.documentCount} document${data.documentCount !== 1 ? 's' : ''} could not be moved.` })
}

function documentMovedSuccess (state, data, isProject = false) {
  let message, url
  const { title, id, cuid, isPublic, documents, disableAlert } = data

  if (data && !disableAlert && title && cuid && documents) {
    const editedTitle = title.replace(/ /g, '-').replace(/[^A-Za-z0-9-]/g, '')
    url = `${isProject ? '/projects' : '/spaces'}/${editedTitle}-${isProject ? id : cuid}`

    if (documents.length === 1) {
      message = state.documentTitle !== '' ? `${state.documentTitle} was added to ` : '1 document was added to '
    } else {
      message = `${documents.length} documents were added to `
    }
  }

  if (message && url) {
    return setAlert(state, {
      type: isProject ? 'project-success' : 'space-success',
      message,
      id,
      isPublic,
      title,
      url,
      timeout: 15000
    })
  } else {
    return state
  }
}

function setAlert (state, data) {
  const { message, type, retryLink, timeout, ...rest } = data

  return Object.assign({}, state, {
    message,
    type,
    retryLink: !!retryLink,
    timeout: typeof timeout === 'number' ? timeout : state.timeout,
    ...rest
  })
}
