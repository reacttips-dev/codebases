import { Record } from 'immutable';
import { COMPANY } from '../constants/ChatHeadingConfigTypes';
export default Record({
  '@type': COMPANY,
  companyLogoUrl: '',
  customChatName: '',
  useCustomBrandingAsAgentAlias: false
}, 'CompanyChatHeadingConfig');