import { BASE_PATH, PUBLIC_ROUTE_PARAM } from '../../appsdk/navigation/constants';

export const OPEN_WORKSPACE_IDENTIFIER = 'workspace.open',

  OPEN_WORKSPACE_ROUTE_PARAM_SLUG = 'wid',
  OPEN_WORKSPACE_URL = window.SDK_PLATFORM === 'browser' ? `${BASE_PATH}workspace/:${OPEN_WORKSPACE_ROUTE_PARAM_SLUG}` : `workspace/:${OPEN_WORKSPACE_ROUTE_PARAM_SLUG}`,
  OPEN_WORKSPACE_PUBLIC_ALIAS_IDENTIFIER = window.SDK_PLATFORM === 'desktop' && 'workspace.openPublicAlias',
  OPEN_WORKSPACE_PUBLIC_ALIAS_URL = window.SDK_PLATFORM === 'desktop' && `${PUBLIC_ROUTE_PARAM}/workspace/:${OPEN_WORKSPACE_ROUTE_PARAM_SLUG}`,

  CREATE_WORKSPACE_IDENTIFIER = 'workspace.create',
  CREATE_WORKSPACE_URL = 'workspace/create',

  EDIT_WORKSPACE_IDENTIFIER = 'workspace.edit',
  EDIT_WORKSPACE_URL = 'edit',

  DETAILS_WORKSPACE_IDENTIFIER = 'workspace.details',
  DETAILS_WORKSPACE_URL = 'details',

  INVITE_WORKSPACE_IDENTIFIER = 'workspace.invite',
  INVITE_WORKSPACE_URL = 'invite',

  WORKSPACE_NOT_FOUND_IDENTIFIER = 'workspace.notFound',
  WORKSPACE_NOT_FOUND_URL = 'workspaces/not-found',

  WORKSPACE_FORBIDDEN_IDENTIFIER = 'workspace.forbidden',
  WORKSPACE_FORBIDDEN_URL = 'workspaces/forbidden',

  WORKSPACE_ERROR_IDENTIFIER = 'workspace.error',
  WORKSPACE_ERROR_URL = 'workspaces/error',

  WORKSPACE = 'workspace',

  WORKSPACE_OVERVIEW_ROUTE = 'overview',

  ALL_WORKSPACES_URL = 'workspaces',
  ALL_WORKSPACES_IDENTIFIER = 'workspaces',

  SHARE_IDENTIFIER = 'dependency.share',
  SHARE_URL = 'share',
  SELECT_WORKSPACE_URL = 'select-workspace',
  SELECT_WORKSPACE_IDENTIFIER = 'workspace.select',

  ACCESS_REQUEST_CREATE_IDENTIFIER = 'access-request.create',
  ACCESS_REQUEST_CREATE_URL = 'request-access/create',
  ACCESS_REQUEST_APPROVE_IDENTIFIER = 'access-request.approve',
  ACCESS_REQUEST_APPROVE_URL = 'request-access/approve',
  ACCESS_REQUEST_CREATE_BUILD_IDENTIFIER = 'build.access-request.create',

  BUILD_URL_REGEX = /^[\/]?build\/?/;
