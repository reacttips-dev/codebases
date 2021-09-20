/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';

import actions, { ActionsState } from './actions';
import boardStars, { BoardStarState } from './board-stars';
import boards, { BoardState } from './boards';
import cards, { CardState } from './cards';
import enterprises, { EnterpriseState } from './enterprises';
import labels, { LabelState } from './labels';
import lists, { ListState } from './lists';
import members, { MemberState } from './members';
import notifications, { NotificationsState } from './notifications';
import reactions, { ReactionState } from './reactions';
import savedSearches, { SavedSearchState } from './saved-searches';
import search, { SearchState } from './search';
import session, { SessionState } from './session';
import shortLinkMap, { ShortLinkMapState } from './shortLinkMap';
import teams, { TeamState } from './teams';

export interface ModelState {
  actions: ActionsState;
  boardStars: BoardStarState;
  boards: BoardState;
  cards: CardState;
  enterprises: EnterpriseState;
  labels: LabelState;
  lists: ListState;
  members: MemberState;
  notifications: NotificationsState;
  reactions: ReactionState;
  savedSearches: SavedSearchState;
  search: SearchState;
  session: SessionState;
  shortLinkMap: ShortLinkMapState;
  teams: TeamState;
}

export default combineReducers({
  actions,
  boardStars,
  boards,
  cards,
  enterprises,
  labels,
  lists,
  members,
  notifications,
  reactions,
  savedSearches,
  search,
  session,
  shortLinkMap,
  teams,
});
