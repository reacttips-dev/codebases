import { UpdateNavigationItem } from 'tribe-api/interfaces'

interface TopNavigationState {
  displayMainSidebar: boolean
  items: Array<UpdateNavigationItem>
  activeItem: UpdateNavigationItem | null
  activeIndex: number
}

export const TopNavigationActions = {
  showNewNavItem: 'SHOW_NEW_NAV_ITEM',
  hideNavItem: 'HIDE_NAV_ITEM',
  addNavItem: 'ADD_ITEM',
  updateNavItemInit: 'UPDATE_NAV_ITEM_INIT',
  updateNavItemComplete: 'UPDATE_NAV_ITEM_COMPLETE',
  deleteNavItem: 'DELETE_NAV_ITEM',
  reorderNavItems: 'RORDER_NAV_ITEMS',
} as const

export const INITIAL_TOP_NAVIGATION_STATE: Partial<TopNavigationState> = {
  displayMainSidebar: true,
  activeItem: null,
  activeIndex: -1,
}

export const topNavigationReducer = (state, action) => {
  switch (action?.type) {
    case TopNavigationActions.showNewNavItem:
      return {
        ...state,
        displayMainSidebar: false,
        activeItem: null,
        activeIndex: -1,
      }
    case TopNavigationActions.hideNavItem:
      return {
        ...state,
        ...INITIAL_TOP_NAVIGATION_STATE,
      }
    case TopNavigationActions.addNavItem:
      return {
        ...INITIAL_TOP_NAVIGATION_STATE,
        items: [...state.items, { ...action.payload }],
      }
    case TopNavigationActions.updateNavItemInit:
      return {
        ...state,
        displayMainSidebar: false,
        activeItem: action?.payload?.item,
        activeIndex: action?.payload?.index,
      }
    case TopNavigationActions.updateNavItemComplete:
      // eslint-disable-next-line no-case-declarations
      const itemsUpdated = [...state.items]
      itemsUpdated[state?.activeIndex] = action?.payload
      return {
        ...INITIAL_TOP_NAVIGATION_STATE,
        items: itemsUpdated,
      }
    case TopNavigationActions.deleteNavItem:
      return {
        ...INITIAL_TOP_NAVIGATION_STATE,
        items: [
          ...state?.items?.slice(0, state?.activeIndex),
          ...state?.items?.slice(state?.activeIndex + 1),
        ],
      }

    case TopNavigationActions.reorderNavItems:
      return {
        ...state,
        items: [...action?.payload],
      }

    default:
      return state
  }
}
