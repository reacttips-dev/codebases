import { BASE_PATH } from '../../appsdk/navigation/constants';

export const OPEN_API_URL = 'api/:apiId';
export const NEW_API_IDENTIFIER = 'api.new';
export const NEW_API_URL = 'api/new';
export const OPEN_API_WITH_WS_SELECT = 'api.openWithWorkspaceSelect';
export const OPEN_API_WITH_WS_SELECT_URL = `${BASE_PATH}${OPEN_API_URL}`;
export const COLLECTION_SCHEMA_SYNC_URL = OPEN_API_URL + '/relation/update';
export const CONNECT_API_TO_REPOSITORY_URL = OPEN_API_URL + '/:gitService/connect-repository/';
export const OPEN_API_VERSION_URL = 'api/:apiId/version/:versionId';
export const OPEN_RELEASE_URL = 'api/:apiId/version/:versionId/release/:releaseId';
