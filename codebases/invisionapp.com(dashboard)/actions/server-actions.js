import * as ActionTypes from '../constants/action-types'
import createServerAction from '../utils/create-server-action'

export const createProject = createServerAction(ActionTypes.API_CREATE_PROJECT, ['spaceId', 'title', 'shape', 'color', 'context'])
export const createSpace = createServerAction(ActionTypes.API_CREATE_SPACE, ['title', 'isPublic', 'teamId', 'userId'])
export const deleteProject = createServerAction(ActionTypes.API_DELETE_PROJECT_SIDEBAR, ['projectId', 'spaceId'])
export const getConfig = createServerAction(ActionTypes.API_GET_CONFIG, [])
export const getAccount = createServerAction(ActionTypes.API_GET_ACCOUNT, [])
export const getMySpaces = createServerAction(ActionTypes.API_GET_MY_SPACES, [])
export const getSpaceResources = createServerAction(ActionTypes.API_GET_SPACE_RESOURCES, ['reset', 'cursor', 'frameSize', 'userId'])
export const getPermissions = createServerAction(ActionTypes.API_GET_PERMISSIONS, [])
export const getProject = createServerAction(ActionTypes.API_GET_PROJECT_SIDEBAR, ['projectId'])
export const getProjects = createServerAction(ActionTypes.API_GET_PROJECTS, ['spaceId'])
export const getSubscription = createServerAction(ActionTypes.API_GET_SUBSCRIPTION)
export const moveDocumentsToSpace = createServerAction(ActionTypes.API_MOVE_DOCUMENTS_TO_SPACE, ['documents', 'spaceId'])
export const moveDocumentsToProject = createServerAction(ActionTypes.API_MOVE_DOCUMENTS_TO_PROJECT, ['documents', 'space', 'projectId', 'projectTitle'])
export const updateProject = createServerAction(ActionTypes.API_UPDATE_PROJECT, ['spaceId', 'projectId', 'title', 'shape', 'color'])
export const updateProjectSidebar = createServerAction(ActionTypes.API_UPDATE_PROJECT_SIDEBAR, ['spaceId', 'projectId', 'title', 'description', 'shape', 'color'])
