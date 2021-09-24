import { getType } from '../operators/chatHeadingConfigGetters';
import { buildChatHeadingConfigFromType } from './buildChatHeadingConfigFromType';
export var buildChatHeadingConfig = function buildChatHeadingConfig(options) {
  var chatConfigType = getType(options);
  return buildChatHeadingConfigFromType(chatConfigType, options);
};