/* eslint-disable @trello/export-matches-filename */

import { TrelloStorage } from '@trello/storage';
import { matches, currentLocale } from '@trello/locale';

/*
 * Manually testing Announcements is a pain due to the long time
 * it takes to verify the full functionality. Example:
 * (It polls the API every 10 minutes. Taco hides after an hour.)
 * This convenience switch allows us fast-forward the feature by
 * changing the base time variable. Setting the localStorage flag
 * to 10, for example, will turn one hour into one minute.
 */
// eslint-disable-next-line @trello/no-module-logic
const TacoTimeOverride: number = parseInt(TrelloStorage.get('tacoTimeMs'), 10);

export const ONE_SECOND = !isNaN(TacoTimeOverride) ? TacoTimeOverride : 1000;
export const THIRTY_SECONDS = ONE_SECOND * 30;
export const ONE_MINUTE = THIRTY_SECONDS * 2;
export const TEN_MINUTES = ONE_MINUTE * 10;
export const ONE_HOUR = ONE_MINUTE * 60;

export enum TacoPosition {
  Up = 'up',
  Crouched = 'crouched',
  Hidden = 'hidden',
}

export enum TacoStyle {
  Normal = 'normal',
  Maintenance = 'maintenance',
}

export interface Announcement {
  id: string;
  url?: string | null;
  locale: string;
  title: string;
  html: string;
  type: string;
}

const announcementsKey = (id: string) => {
  return `announcement-${id}-read`;
};

export const isUnread = (id: string) =>
  !TrelloStorage.get(announcementsKey(id));

export const markAsRead = (id: string) =>
  TrelloStorage.set(announcementsKey(id), 'true');

/**
 * Filter the results of the announcements API to announcements that
 * are relevant to your current locale, and have not been marked as
 * read in localStorage
 */
export const getUnreadAnnouncements = (
  announcements: Announcement[] = [],
): Announcement[] =>
  announcements.filter(
    (announcement) =>
      matches(announcement.locale, currentLocale) && isUnread(announcement.id),
  );

/**
 * Combine and dedupe the results of the announcements API and the
 * results of the all-announcements API, filtering out announcements
 * that are not relevant for your current locale
 */
export const concatAnnouncements = (
  unreadAnnouncements: Announcement[] = [],
  allAnnouncements: Announcement[] = [],
): Announcement[] => {
  const unreadIds = unreadAnnouncements.map((a) => a.id);
  const readAnnouncements = allAnnouncements.filter(
    (announcement) =>
      matches(announcement.locale, currentLocale) &&
      !unreadIds.includes(announcement.id),
  );
  return unreadAnnouncements.concat(readAnnouncements);
};
