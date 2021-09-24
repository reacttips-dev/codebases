import * as ChatHeadingConfigTypes from '../constants/ChatHeadingConfigTypes';
import CompanyChatHeadingConfig from '../records/CompanyChatHeadingConfig';
import UsersAndTeamsChatHeadingConfig from '../records/UsersAndTeamsChatHeadingConfig';
import OwnerChatHeadingConfig from '../records/OwnerChatHeadingConfig';
export function buildChatHeadingConfigFromType(chatHeadingConfig, options) {
  switch (chatHeadingConfig) {
    case ChatHeadingConfigTypes.USERS_AND_TEAMS:
      return new UsersAndTeamsChatHeadingConfig(options);

    case ChatHeadingConfigTypes.OWNER:
      return new OwnerChatHeadingConfig(options);

    case ChatHeadingConfigTypes.COMPANY:
    default:
      return new CompanyChatHeadingConfig(options);
  }
}