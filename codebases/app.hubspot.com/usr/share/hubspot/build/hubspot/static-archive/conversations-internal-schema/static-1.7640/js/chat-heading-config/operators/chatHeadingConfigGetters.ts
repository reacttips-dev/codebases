import getIn from 'transmute/getIn';
import { COMPANY_LOGO, FALLBACK, CUSTOM_CHAT_NAME, TEAM_IDS, TYPE, USER_IDS, USE_CUSTOM_BRANDING_ALIAS } from './../constants/keyPaths';
export var getCustomChatName = getIn(CUSTOM_CHAT_NAME);
export var getFallback = getIn(FALLBACK);
export var getTeamIds = getIn(TEAM_IDS);
export var getType = getIn(TYPE);
export var getUserIds = getIn(USER_IDS);
export var getCompanyLogo = getIn(COMPANY_LOGO);
export var getUseCustomBrandingAsAgentAlias = getIn(USE_CUSTOM_BRANDING_ALIAS);