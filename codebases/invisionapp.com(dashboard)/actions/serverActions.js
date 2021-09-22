import * as ActionTypes from '../constants/ActionTypes'
import createServerAction from '../utils/create-server-action'

// Home Actions
export const activateDocument = createServerAction(ActionTypes.API_ACTIVATE_DOCUMENT, ['type', 'id'])
export const archiveDocument = createServerAction(ActionTypes.API_ARCHIVE_DOCUMENT, ['type', 'id'])
export const createDocument = createServerAction(ActionTypes.API_CREATE_DOCUMENT, ['type', 'data', 'projectId'])
export const createSpace = createServerAction(ActionTypes.API_CREATE_SPACE, ['data', 'includeMembers', 'includePermissions'])
export const deleteDocument = createServerAction(ActionTypes.API_DELETE_DOCUMENT, ['type', 'id'])
export const deleteSpace = createServerAction(ActionTypes.API_DELETE_SPACE, ['cuid'])
export const getAccount = createServerAction(ActionTypes.API_GET_ACCOUNT)
export const getAccountPermissions = createServerAction(ActionTypes.API_GET_ACCOUNT_PERMISSIONS)
export const getSubscription = createServerAction(ActionTypes.API_GET_SUBSCRIPTION)
export const getConfig = createServerAction(ActionTypes.API_GET_CONFIG)
export const getSpacesResource = createServerAction(ActionTypes.API_GET_SPACES_RESOURCE, ['reset', 'sortOrder', 'viewFilter', 'cursor', 'userId'])

// Space Detail Actions
export const addDocumentToContainer = createServerAction(ActionTypes.API_ADD_DOCUMENT_TO_CONTAINER, ['documentType', 'documentID', 'type', 'id'])
export const addDocumentsToSpace = createServerAction(ActionTypes.API_ADD_DOCUMENTS_TO_SPACE, ['documents', 'spaceID', 'spaceTitle'])
export const getArchivedSpaceDocuments = createServerAction(ActionTypes.API_GET_ARCHIVED_SPACE_DOCUMENTS, ['spaceID'])
export const getProjects = createServerAction(ActionTypes.API_GET_PROJECTS, ['spaceId', 'limit', 'includeDetails'])
export const getSpace = createServerAction(ActionTypes.API_GET_SPACE, ['cuid', 'joined', 'forceReload'])
export const getSpaceV2 = createServerAction(ActionTypes.API_GET_SPACE_V2, ['spaceId', 'autoJoin', 'forceReload'])
export const getSpacesSearchResource = createServerAction(ActionTypes.API_GET_SPACES_SEARCH_RESOURCE, ['reset', 'searchTerm', 'searchView', 'filterType', 'cursor', 'spaceId', 'frameSize', 'forceReload'])
export const getSpaceMembersDetail = createServerAction(ActionTypes.API_GET_SPACE_MEMBERS_DETAIL, ['spaceId', 'forceReload'])
export const getSpacesDetail = createServerAction(ActionTypes.API_GET_SPACES_DETAIL, ['spaceIds', 'forceReload'])
export const leaveSpace = createServerAction(ActionTypes.API_LEAVE_SPACE, ['cuid', 'isPublic'])
export const updateDescription = createServerAction(ActionTypes.API_UPDATE_DESCRIPTION, ['data', 'cuid'])
export const updateSpace = createServerAction(ActionTypes.API_UPDATE_SPACE, ['data', 'cuid'])

// Projects
export const getProject = createServerAction(ActionTypes.API_GET_PROJECT, ['id'])
export const getProjectsDetail = createServerAction(ActionTypes.API_GET_PROJECTS_DETAIL, ['projectIds', 'forceReload'])
export const updateProject = createServerAction(ActionTypes.API_UPDATE_PROJECT, ['id', 'spaceId', 'data'])
export const deleteProject = createServerAction(ActionTypes.API_DELETE_PROJECT, ['id', 'spaceId'])

// Discover API

export const getFreehandMetadata = {
  request: (documents, analyticsData) => ({
    type: ActionTypes.API_GET_FREEHAND_METADATA.REQUEST,
    data: { documents, analyticsData }
  })
}

export const getDocumentsMetadata = {
  request: (documents, analyticsData) => {
    return {
      type: ActionTypes.API_GET_DOCUMENT_METADATA.REQUEST,
      data: { documents, analyticsData }
    }
  },
  permissionsSuccess: response => {
    return {
      type: ActionTypes.API_GET_DOCUMENT_METADATA.PERMISSIONS_SUCCESS,
      data: response
    }
  },
  permissionsFailure: response => {
    return {
      type: ActionTypes.API_GET_DOCUMENT_METADATA.PERMISSIONS_FAILURE,
      data: response
    }
  },
  thumbnailsSuccess: response => {
    return {
      type: ActionTypes.API_GET_DOCUMENT_METADATA.THUMBNAILS_SUCCESS,
      data: response
    }
  },
  thumbnailsFailure: response => {
    return {
      type: ActionTypes.API_GET_DOCUMENT_METADATA.THUMBNAILS_FAILURE,
      data: response
    }
  },
  freehandMetadataSuccess: response => {
    return {
      type: ActionTypes.API_GET_DOCUMENT_METADATA.FREEHAND_METADATA_SUCCESS,
      data: response
    }
  },
  freehandMetadataFailure: response => {
    return {
      type: ActionTypes.API_GET_DOCUMENT_METADATA.FREEHAND_METADATA_FAILURE,
      data: response
    }
  }
}

export const getInitialDocuments = createServerAction(ActionTypes.API_GET_INITIAL_DOCUMENTS, ['externalDocFilterEntries', 'isExternalDocType', 'docType', 'enableFreehandXFilteringSorting'])

// Leaving this as "V2" before we move all of the calls to this new endpoint
export const moveDocumentsToContainer = createServerAction(ActionTypes.API_MOVE_DOCUMENTS_TO_CONTAINER, ['containerType', 'containerId', 'containerTitle', 'documents', 'alert'])
