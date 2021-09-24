'use es6';

import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
import { getStatus } from './threadGetters';
export function isClosed(conversation) {
  return getStatus(conversation) === ChatFilterOptions.ENDED;
}