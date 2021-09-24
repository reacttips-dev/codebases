import moment from 'moment'
import { createSelector } from 'reselect'
import { selectParamsUsername } from './params'
import {
  selectPathname,
  selectPropsQueryType,
  selectViewNameFromRoute,
} from './routing'
import { selectIsLoggedIn } from './authentication'
import {
  selectLastDiscoverBeaconVersion as discoverBeaconVersion,
  selectLastFollowingBeaconVersion as followingBeaconVersion,
} from './gui'
import { selectCategoryForPath } from '../selectors/categories'
import { DISCOVER, FOLLOWING } from '../constants/locales/en'

// state.gui.xxx
export const selectActiveNotificationsType = state => state.gui.get('activeNotificationsType')
export const selectColumnCount = state => state.gui.get('columnCount')
export const selectDiscoverKeyType = state => state.gui.get('discoverKeyType')
export const selectHasLaunchedSignupModal = state => state.gui.get('hasLaunchedSignupModal')
export const selectInnerHeight = state => state.gui.get('innerHeight')
export const selectInnerWidth = state => state.gui.get('innerWidth')
export const selectIsCategoryDrawerOpenBase = state => state.gui.get('isCategoryDrawerOpen')
export const selectIsCompleterActive = state => state.gui.get('isCompleterActive')
export const selectIsGridMode = state => state.gui.get('isGridMode')
export const selectIsNavbarHidden = state => state.gui.get('isNavbarHidden')
export const selectIsNotificationsActive = state => state.gui.get('isNotificationsActive')
export const selectIsNotificationsUnread = state => state.gui.get('isNotificationsUnread')
export const selectIsProfileMenuActive = state => state.gui.get('isProfileMenuActive')
export const selectIsProfileRolesActive = state => state.gui.get('isProfileRolesActive')
export const selectIsLightBoxActive = state => state.gui.get('isLightBoxActive')
export const selectIsTextToolsActive = state => state.gui.get('isTextToolsActive')
export const selectLastAnnouncementSeen = state => state.gui.get('lastAnnouncementSeen')
export const selectLastDiscoverBeaconVersion = state => state.gui.get('lastDiscoverBeaconVersion') // eslint-disable-line
export const selectLastFollowingBeaconVersion = state => state.gui.get('lastFollowingBeaconVersion') // eslint-disable-line
export const selectLastNotificationCheck = state => state.gui.get('lastNotificationCheck')
export const selectNotificationScrollPositions = state => state.gui.get('notificationScrollPositions')
export const selectSaidHelloTo = state => state.gui.get('saidHelloTo')
export const selectTextToolsCoordinates = state => state.gui.get('textToolsCoordinates')
export const selectTextToolsStates = state => state.gui.get('textToolsStates')
export const selectOnboardToArtistInvite = state => state.gui.get('onboardToArtistInvite')
export const selectIsCompletingOnboardingWithArtistInvite = state => state.gui.get('isCompletingOnboardToArtistInvite')
export const selectAcceptedDataPolicy = state => state.gui.get('acceptedDataPolicy')
export const selectDidClosePromoAlert = state => state.gui.get('closedPromoAlert')

// Memoized selectors
export const selectActiveNotificationScrollPosition = createSelector(
  [selectActiveNotificationsType, selectNotificationScrollPositions], (type, positions) =>
    positions.get(type, 0),
)

export const selectDeviceSize = createSelector(
  [selectColumnCount, selectInnerWidth], (columnCount, innerWidth) => {
    // deviceSize could be anything: baby, momma, poppa bear would work too.
    if (innerWidth > 959) {
      return 'desktop'
    } else if (innerWidth >= 640 && innerWidth <= 959) {
      return 'tablet'
    }
    return 'mobile'
  },
)

export const selectIsMobile = createSelector(
  [selectDeviceSize], deviceSize =>
    deviceSize === 'mobile',
)

export const selectIsMobileGridStream = createSelector(
  [selectDeviceSize, selectIsGridMode], (deviceSize, isGridMode) =>
    deviceSize === 'mobile' && isGridMode,
)

export const selectPaddingOffset = createSelector(
  [selectDeviceSize, selectColumnCount], (deviceSize, columnCount) => {
    if (deviceSize === 'mobile') { return 10 }
    return columnCount >= 4 ? 40 : 20
  },
)

export const selectCommentOffset = createSelector(
  [selectDeviceSize], deviceSize =>
    (deviceSize === 'mobile' ? 40 : 60),
)

export const selectColumnWidth = createSelector(
  [selectColumnCount, selectInnerWidth, selectPaddingOffset], (columnCount, innerWidth, padding) =>
    Math.round((innerWidth - ((columnCount + 1) * padding)) / columnCount),
)

export const selectContentWidth = createSelector(
  [selectInnerWidth, selectPaddingOffset], (innerWidth, padding) =>
    Math.round(innerWidth - (padding * 2)),
)

export const selectIsCategoryDrawerOpen = createSelector(
  [selectIsCategoryDrawerOpenBase, selectPathname, selectCategoryForPath],
  (isCategoryDrawerOpen, pathname, category) =>
    category.get('brandAccountId') ||
    (
      isCategoryDrawerOpen &&
      pathname.includes('/discover') &&
      !(
        pathname.includes('/discover/subscribed') ||
        pathname === '/discover' ||
        pathname === '/discover/trending/' ||
        pathname === '/discover/recent' ||
        pathname === '/discover/shop'
      )
    ),
)

// This is very rudimentary. needs things like 1x, 2x calculating the set
// Primarily used for background images in Heros
export const selectDPI = createSelector(
  [selectInnerWidth], (innerWidth) => {
    if (innerWidth <= 400) {
      return 'mdpi'
    }
    return 'hdpi'
  },
)

export const selectHeroDPI = createSelector(
  [selectInnerWidth], (innerWidth) => {
    if (innerWidth <= 1200) {
      return 'hdpi'
    }
    return 'xhdpi'
  },
)

export const selectHasSaidHelloTo = createSelector(
  [selectSaidHelloTo, selectParamsUsername], (saidHelloTo, username) =>
    saidHelloTo.includes(username),
)

export const selectScrollOffset = createSelector(
  [selectInnerHeight], innerHeight => Math.round(innerHeight - 80),
)

const NO_LAYOUT_TOOLS = [
  /^\/$/,
  /^\/[\w-]+\/post\/.+/,
  /^\/discover\/all\b/,
  /^\/notifications\b/,
  /^\/settings\b/,
  /^\/onboarding\b/,
  /^\/[\w-]+\/following\b/,
  /^\/[\w-]+\/followers\b/,
]

export const selectIsLayoutToolHidden = createSelector(
  [selectPathname, selectPropsQueryType], (pathname, queryType) => {
    const isUserSearch = queryType === 'users' && /^\/search\b/.test(pathname)
    return isUserSearch || NO_LAYOUT_TOOLS.some(pagex => pagex.test(pathname))
  },
)

export const selectBroadcast = createSelector(
  [selectIsLoggedIn, selectViewNameFromRoute, discoverBeaconVersion, followingBeaconVersion],
  (isLoggedIn, viewName, lastDiscoverBeaconVersion, lastFollowingBeaconVersion) => {
    if (!isLoggedIn) { return null }
    if (viewName === 'discover') {
      return lastDiscoverBeaconVersion !== DISCOVER.BEACON_VERSION ? DISCOVER.BEACON_TEXT : null
    } else if (viewName === 'following') {
      return lastFollowingBeaconVersion !== FOLLOWING.BEACON_VERSION ? FOLLOWING.BEACON_TEXT : null
    }
    return null
  },
)

export const selectShouldShowDataPolicy = createSelector(
  [selectAcceptedDataPolicy],
  acceptedDataPolicy => !acceptedDataPolicy,
)

export const selectShouldShowPromoAlert = createSelector(
  [selectDidClosePromoAlert],
  (closedPromoAlert) => {
    const showDate = moment('2021-05-13')
    const hideDate = moment('2021-05-28')
    if (moment().isBefore(showDate) || moment().isAfter(hideDate)) {
      return false
    }

    return !closedPromoAlert
  },
)
