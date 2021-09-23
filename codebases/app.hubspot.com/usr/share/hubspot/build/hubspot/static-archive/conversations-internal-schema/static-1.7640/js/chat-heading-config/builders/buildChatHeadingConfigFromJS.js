'use es6';

import { buildChatHeadingConfig } from './buildChatHeadingConfig';
import { buildDefaultChatHeadingConfig } from './buildDefaultChatHeadingConfig';
export var buildChatHeadingConfigFromJS = function buildChatHeadingConfigFromJS(payload) {
  if (!payload) {
    return buildDefaultChatHeadingConfig();
  }

  return buildChatHeadingConfig(payload);
};