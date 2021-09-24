'use es6';

import get from 'transmute/get';
import { List } from 'immutable';
import UsersAndTeamsChatHeadingConfig from '../records/UsersAndTeamsChatHeadingConfig';
export var buildDefaultChatHeadingConfig = function buildDefaultChatHeadingConfig(currentUser) {
  if (currentUser) {
    return new UsersAndTeamsChatHeadingConfig({
      userIds: List([get('user_id', currentUser)])
    });
  }

  return new UsersAndTeamsChatHeadingConfig();
};