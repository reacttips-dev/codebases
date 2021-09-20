import { isServedFromPublicWorkspaceDomain } from '../utils/commonWorkspaceUtils';

export const OPEN_GLOBAL_SETTINGS = 'settings.open';
export const OPEN_GLOBAL_SETTINGS_URL = 'settings';
export const PUBLIC_ROUTE_PARAM = ':publicHandle';
export const BASE_PATH = isServedFromPublicWorkspaceDomain() ? `${PUBLIC_ROUTE_PARAM}/` : '';
export const SCRATCHPAD = 'scratchpad';
export const OFFLINE = 'offline';
