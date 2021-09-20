/* eslint-disable @trello/disallow-filenames */
export enum ViewType {
  TIMELINE = 'timeline',
  CALENDAR = 'calendar',
  TABLE = 'table',
}

export enum NavigationDirection {
  PREV = 'PREV',
  NEXT = 'NEXT',
  TODAY = 'TODAY',
}

export enum ZoomLevel {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export enum GroupByOption {
  LIST = 'list',
  MEMBER = 'member',
  LABEL = 'label',
  NONE = 'none',
}

export interface DropdownOption {
  value: string;
  isSelected?: boolean;
  label: string;
}

export interface Member {
  id: string;
  name: string;
  avatarSource?: string;
  avatarUrl?: string;
}

export interface Label {
  id: string;
  name?: string;
  color?: string | null;
  fullName?: never;
}

export enum BetaPhase {
  LATE = 'late stage',
  OUT = 'out of beta',
}

export enum AddNewType {
  CARD = 'card',
  LIST = 'list',
}

export enum AddCardTrigger {
  BUTTON = 'button',
  LANE = 'lane',
}
