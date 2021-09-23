import Immutable from 'immutable'
import { createSelector } from 'reselect'
import { ANNOUNCEMENTS } from '../constants/mapping_types'
import { selectLastAnnouncementSeen } from './gui'

export const selectAnnouncements = state => state.json.get(ANNOUNCEMENTS, Immutable.Map())
export const selectNotifications = state => state.json.get('notifications', Immutable.Map())

export const selectPropsNotificationId = (state, props) => props.notificationId

// Memoized selectors
export const selectAnnouncement = createSelector(
  [selectAnnouncements], announcements =>
    (announcements.size && announcements.first()) || Immutable.Map(),
)

// Properties on the announcement
export const selectAnnouncementBody = createSelector(
  [selectAnnouncement], announcement => announcement.get('body'),
)

export const selectAnnouncementCTACaption = createSelector(
  [selectAnnouncement], announcement => announcement.get('ctaCaption', 'Learn More'),
)

export const selectAnnouncementCTAHref = createSelector(
  [selectAnnouncement], announcement => announcement.get('ctaHref'),
)

export const selectAnnouncementId = createSelector(
  [selectAnnouncement], announcement => announcement.get('id'),
)

export const selectAnnouncementImage = createSelector(
  [selectAnnouncement], announcement => announcement.getIn(['image', 'hdpi', 'url']),
)

export const selectAnnouncementTitle = createSelector(
  [selectAnnouncement], announcement => announcement.get('header'),
)

export const selectAnnouncementIsStaffPreview = createSelector(
  [selectAnnouncement], announcement => announcement.get('isStaffPreview', false),
)

// Derived or additive properties
export const selectAnnouncementIsEmpty = createSelector(
  [selectAnnouncement], announcement => announcement.isEmpty(),
)

export const selectAnnouncementIsUnread = createSelector(
  [selectAnnouncements], announcements => !!(announcements && announcements.size),
)

export const selectAnnouncementHasBeenViewed = createSelector(
  [selectAnnouncementId, selectAnnouncementIsUnread, selectLastAnnouncementSeen],
  (announcementId, isUnread, lastAnnouncementSeen) =>
    !isUnread || announcementId === lastAnnouncementSeen,
)

export const selectNotification = createSelector(
  [selectNotifications, selectPropsNotificationId],
  (notifications, id) => notifications.get(id, Immutable.Map()),
)
