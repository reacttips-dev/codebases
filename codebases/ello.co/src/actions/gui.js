import moment from 'moment'
import { GUI } from '../constants/action_types'

export function setIsCategoryDrawerOpen({ isOpen }) {
  return {
    type: GUI.SET_IS_CATEGORY_DRAWER_OPEN,
    payload: {
      isCategoryDrawerOpen: isOpen,
    },
  }
}

export function setIsNavbarHidden({ isHidden }) {
  return {
    type: GUI.SET_IS_NAVBAR_HIDDEN,
    payload: {
      isNavbarHidden: isHidden,
    },
  }
}

export function setIsProfileMenuActive({ isActive }) {
  return {
    type: GUI.SET_IS_PROFILE_MENU_ACTIVE,
    payload: {
      isProfileMenuActive: isActive,
    },
  }
}

export function setIsProfileRolesActive({ isActive }) {
  return {
    type: GUI.SET_IS_PROFILE_ROLES_ACTIVE,
    payload: {
      isProfileRolesActive: isActive,
    },
  }
}

export function setIsLightBoxActive({ isActive }) {
  return {
    type: GUI.SET_IS_LIGHT_BOX_ACTIVE,
    payload: {
      isLightBoxActive: isActive,
    },
  }
}

export function setLastAnnouncementSeen({ id }) {
  return {
    type: GUI.SET_LAST_ANNOUNCEMENT_SEEN,
    payload: {
      id,
    },
  }
}

export function setLastDiscoverBeaconVersion({ version }) {
  return {
    type: GUI.SET_LAST_DISCOVER_BEACON_VERSION,
    payload: {
      version,
    },
  }
}

export function setLastFollowingBeaconVersion({ version }) {
  return {
    type: GUI.SET_LAST_FOLLOWING_BEACON_VERSION,
    payload: {
      version,
    },
  }
}

export function setNotificationScrollY(category, scrollY) {
  return {
    payload: {
      category,
      scrollY,
    },
    type: GUI.SET_NOTIFICATION_SCROLL_Y,
  }
}

export function setViewportSizeAttributes(resizeAttributes) {
  return {
    type: GUI.SET_VIEWPORT_SIZE_ATTRIBUTES,
    payload: {
      ...resizeAttributes,
    },
  }
}

export function setSignupModalLaunched(launched = true) {
  return {
    type: GUI.SET_SIGNUP_MODAL_LAUNCHED,
    payload: {
      hasLaunchedSignupModal: launched,
    },
  }
}

export function toggleNotifications({ isActive }) {
  return {
    type: GUI.TOGGLE_NOTIFICATIONS,
    payload: {
      isNotificationsActive: isActive,
    },
  }
}

export function acceptDataPolicy() {
  const now = moment().toDate()
  return {
    type: GUI.ACCEPT_DATA_POLICY,
    payload: { now },
  }
}

export function closePromoAlert() {
  const now = moment().toDate();
  return {
    type: GUI.CLOSED_PROMO_ALERT,
    payload: { now },
  };
}

export function resetPromoAlert() {
  return {
    type: GUI.RESET_PROMO_ALERT,
  };
}
