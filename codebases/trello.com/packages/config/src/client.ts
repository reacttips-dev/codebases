import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

export enum AppId {
  Desktop = 'desktop',
}

export interface ClientConfigInit {
  readonly appId?: AppId;
  readonly dontDismissNotifications?: boolean;
  readonly limitMemoryUsage?: boolean;
  readonly desktopVersion?: string;
}

const config = window.init_config || {};

export const appId = config.appId || null;
export const dontDismissNotifications = config.dontDismissNotifications || null;
export const limitMemoryUsage = config.limitMemoryUsage || null;
export const desktopVersion = config.desktopVersion || '0';
