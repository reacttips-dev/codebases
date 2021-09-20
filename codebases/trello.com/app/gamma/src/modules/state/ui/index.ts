/* eslint-disable import/no-default-export */
import { combineReducers } from 'redux';

import boardsMenu, { BoardsMenuState } from './boards-menu';
import closedBoards, { ClosedBoardsState } from './closed-boards';
import createMenu, { CreateMenuState } from './create-menu';
import notificationsPane, {
  NotificationsPaneState,
} from './notifications-pane';
import overlay, { OverlayState } from './overlay';

export interface UiState {
  boardsMenu: BoardsMenuState;
  closedBoards: ClosedBoardsState;
  createMenu: CreateMenuState;
  notificationsPane: NotificationsPaneState;
  overlay: OverlayState;
}

export default combineReducers({
  boardsMenu,
  closedBoards,
  createMenu,
  notificationsPane,
  overlay,
});
