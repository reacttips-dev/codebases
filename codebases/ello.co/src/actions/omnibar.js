import { OMNIBAR } from '../constants/action_types'

export function openOmnibar(classList = '') {
  return {
    type: OMNIBAR.OPEN,
    payload: {
      classList,
      isActive: true,
    },
  }
}

export function closeOmnibar() {
  return {
    type: OMNIBAR.CLOSE,
    payload: {
      classList: null,
      isActive: false,
    },
  }
}

