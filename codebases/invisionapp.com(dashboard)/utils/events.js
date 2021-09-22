import * as ActionTypes from '../constants/ActionTypes'
import * as TrackingEvents from '../constants/TrackingEvents'

// The events object below contains all tracking events triggered
// by redux actions. The dot notation used in the 'args' object refers to
// either the action's 'response' or the state's 'analytics' object.
// Event template:
/*
'REDUX_ACTION_NAME': {
  name: 'The.Name.Sent.To.Analytics',
  args: {
    propertyName: 'analytics.property', // A value from the store is prefixed with 'analytics'
    propertyName: 'response.property // A value returned in the response is prefixed with 'response'
  },
  criteria: (data) => data.type === 'something' // Refine trigger to use an event's data
}
*/

const events = {
  [ActionTypes.ANALYTICS_TRACK_CREATE_CLICK]: {
    name: TrackingEvents.APP_CREATE_SELECTED,
    args: {
      createContext: 'analytics.documentContext',
      documentType: 'documentType'
    }
  },
  [ActionTypes.API_ARCHIVE_DOCUMENT.SUCCESS]: {
    name: TrackingEvents.APP_DOCUMENT_ARCHIVED,
    args: {
      documentId: 'analytics.document.cuid',
      documentType: 'analytics.documentType',
      documentContext: 'analytics.documentContext',
      page: 'analytics.page'
    }
  },
  [ActionTypes.API_DELETE_DOCUMENT.SUCCESS]: {
    name: TrackingEvents.APP_DOCUMENT_DELETED,
    args: {
      documentId: 'analytics.document.cuid',
      documentType: 'analytics.documentType',
      documentContext: 'analytics.documentContext',
      page: 'analytics.page'
    }
  },
  [ActionTypes.API_ACTIVATE_DOCUMENT.SUCCESS]: {
    name: TrackingEvents.APP_DOCUMENT_RESTORED,
    args: {
      documentId: 'analytics.document.cuid',
      documentType: 'analytics.documentType',
      documentContext: 'analytics.documentContext',
      page: 'analytics.page'
    }
  },
  [ActionTypes.API_CREATE_SPACE.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_CREATED,
    args: {
      spaceId: 'response.data.cuid',
      spaceType: 'response.data.isPublic',
      spaceContext: 'analytics.spaceContext'
    }
  },
  [ActionTypes.API_REMOVE_DOCUMENT_AND_CREATE_SPACE.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_CREATED,
    args: {
      spaceId: 'response.data.cuid',
      spaceType: 'response.data.isPublic',
      spaceContext: 'analytics.spaceContext'
    }
  },
  [ActionTypes.API_DELETE_SPACE.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_DELETED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      spaceContext: 'analytics.spaceContext'
    }
  },
  [ActionTypes.API_LEAVE_SPACE.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_LEFT,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      spaceContext: 'analytics.spaceContext'
    }
  },
  [ActionTypes.API_ADD_DOCUMENTS_TO_SPACE.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_DOCUMENT_ADDED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      spaceDocumentContext: 'analytics.spaceDocumentContext',
      documentType: 'analytics.documentType'
    }
  },

  [ActionTypes.API_MOVE_DOCUMENT_TO_SPACE.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_DOCUMENT_MOVED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      spaceDocumentContext: 'analytics.spaceDocumentContext',
      documentType: 'analytics.documentType'
    }
  },
  [ActionTypes.API_REMOVE_DOCUMENT_FROM_SPACE.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_DOCUMENT_REMOVED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      spaceDocumentContext: 'analytics.spaceDocumentContext',
      documentType: 'analytics.documentType'
    }
  },
  [ActionTypes.UPDATE_FILTERS]: {
    name: TrackingEvents.APP_HOME_FILTERED,
    args: {
      filterType: 'value',
      filterContext: 'analytics.filterContext',
      page: 'analytics.page'
    },
    criteria: (data) => {
      const noTrack = data.opts && data.opts.noTrack
      return data.type === 'type' && !noTrack
    }
  },
  [ActionTypes.GOTO_PAGE]: {
    name: TrackingEvents.APP_HOME_PAGINATION_CLICKED,
    args: {
      filterType: 'analytics.filterType',
      filterContext: 'analytics.filterContext',
      page: 'analytics.page'
    }
  },
  [ActionTypes.PAGE_OPENED]: {
    name: TrackingEvents.APP_HOME_OPENED,
    args: {
      page: 'analytics.page',
      homeView: 'analytics.homeView',
      sidebarEnabled: 'analytics.sidebarEnabled'
    }
  },

  // Space Descriptions
  [ActionTypes.DESCRIPTION_LINK_CLICKED]: {
    name: TrackingEvents.APP_SPACE_DESCRIPTIONLINK_CLICKED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic'
    }
  },

  [ActionTypes.API_UPDATE_DESCRIPTION.SUCCESS]: {
    name: TrackingEvents.APP_SPACE_DESCRIPTION_EDIT_SAVED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      contentState: 'analytics.contentState',
      charCount: 'analytics.charCount',
      hasLink: 'analytics.hasLink'
    }
  },

  // Space Batch Add Modal
  [ActionTypes.OPEN_BATCH_ADD_MODAL]: {
    name: TrackingEvents.APP_SPACE_ADDEXISTING_OPENED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      addContext: 'addContext'
    }
  },

  [ActionTypes.REMOVE_SELECTED_DOCUMENT]: {
    name: TrackingEvents.APP_SPACE_ADDEXISTING_DOCUMENT_REMOVED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      documentType: 'analytics.documentType'
    }
  },

  [ActionTypes.SELECT_ACTIVE_DOCUMENT]: {
    name: TrackingEvents.APP_SPACE_ADDEXISTING_DOCUMENT_ADDED,
    args: {
      spaceId: 'analytics.space.cuid',
      spaceType: 'analytics.space.isPublic',
      documentType: 'analytics.documentType'
    }
  }
}

export default events
