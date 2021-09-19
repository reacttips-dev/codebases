import {
  SET_HF_DESKTOP_NAV_POSITIONING,
  SET_HF_MOBILE_NAV_POSITIONING,
  SET_HF_OPENED_NAV,
  SET_HF_OPENED_SUBNAV
} from 'constants/reduxActions';
import { toggleMobileHeaderExpand } from 'actions/headerfooter';

export function setOpenedNav(openedNav = null) {
  return {
    type: SET_HF_OPENED_NAV,
    openedNav
  };
}

export function setOpenedSubNav(openedSubNav = null) {
  return {
    type: SET_HF_OPENED_SUBNAV,
    openedSubNav
  };
}

export function handleDocClickForNav(e) {
  return (dispatch, getState) => {
    const state = getState();
    const { headerFooter: { openedNav, isMobileHeaderExpanded } } = state;
    const hfDropdownToggleSelectors = '[data-headercategory], [data-shyguy], [data-hfdropdown]';
    const isDropdown = !!e.target.closest(hfDropdownToggleSelectors);
    const isHeader = !!e.target.closest('[data-header-container]');
    if (!isHeader && isMobileHeaderExpanded) {
      dispatch(toggleMobileHeaderExpand());
    }
    if (openedNav && !isDropdown) {
      // If a nav is opened and we click off a dropdown close nav
      dispatch(closeAllNavs());
    }
  };
}

// Close both top level and sub nav level
export function closeAllNavs() {
  return (dispatch, getState) => {
    const { headerFooter: { openedSubNav } } = getState();
    dispatch(setOpenedNav());
    // And then close any subnavs if there are any open
    if (openedSubNav) {
      dispatch(setOpenedSubNav());
    }
  };
}

export function handleTopNavCloseClick(e) {
  return dispatch => {
    e.preventDefault();
    dispatch(closeAllNavs());
  };
}

// Handle top level nav clicks
export function handleTopNavClick(e) {
  return (dispatch, getState) => {
    e.preventDefault();
    const { target } = e;
    const { headerFooter: { openedNav } } = getState();
    const shyGuyId = target.dataset.shyguy;

    if (shyGuyId === openedNav) {
      // If we click on the toggle and it's already opened let's close it
      dispatch(closeAllNavs());
    } else if (shyGuyId) {
      // Open toggle
      dispatch(setOpenedNav(shyGuyId));
    }
  };
}

export function handleSubNavClick(e) {
  return (dispatch, getState) => {
    const { headerFooter: { openedSubNav, isMobile } } = getState();

    // Only preventDefault & toggle subnavs in the mobile view where it's necesssary
    if (isMobile) {
      e.preventDefault();
      const { target } = e;
      const subNavId = target.dataset.hfsubnav;

      // Close if already opened
      if (openedSubNav === subNavId) {
        dispatch(setOpenedSubNav());
      } else if (subNavId) {
        // Open
        dispatch(setOpenedSubNav(subNavId));
        // Scroll to top
        const catEl = target.closest('[data-headercategory]');
        if (catEl) {
          catEl.scrollTop = 0;
        }
      }
    }
  };
}

export function handleSubNavClose(e) {
  return dispatch => {
    e.preventDefault();
    dispatch(setOpenedSubNav());
  };
}

// Handle nav dropdown positioning
export function setMobileNavPositioning(marginTop, subCatHeight) {
  return {
    type: SET_HF_MOBILE_NAV_POSITIONING,
    marginTop,
    subCatHeight
  };
}

export function setDesktopNavPositioning(categories) {
  return {
    type: SET_HF_DESKTOP_NAV_POSITIONING,
    categories
  };
}

export function setNavPositioning() {
  return (dispatch, getState) => {
    const { isMobile } = getState().headerFooter;
    const header = document.querySelector('header');

    if (header && isMobile) {
      // Position nav dropdown right below main nav items
      const marginTop = header.offsetHeight + header.offsetTop;

      // Get subnav height for scrolling
      let subNavHeight = '';
      const closeBox = document.querySelector('[data-headercategory] > [data-close]');
      if (closeBox) {
        const closeHeight = closeBox.getBoundingClientRect().height;
        subNavHeight = window.innerHeight - marginTop - closeHeight;
      }
      return dispatch(setMobileNavPositioning(marginTop, subNavHeight));

    } else if (header) {
      // Reset navs before calculating
      dispatch(setDesktopNavPositioning([]));
      const categories = [];
      // Make sure we're fully scrolled left that we don't have any extra space while calculating our nav position
      window.scrollTo(0, window.scrollY);
      // Ensure headercategory doesn't extend past viewport
      const topLevelNavItems = document.querySelectorAll('[data-headernav] > ul > li');
      const viewportWidth = document.documentElement.offsetWidth;
      for (let i = 0; i < topLevelNavItems.length; ++i) {
        const catBox = topLevelNavItems[i].querySelector('[data-headercategory]');
        const catBoxPositionRight = catBox?.getBoundingClientRect().right;
        if (catBoxPositionRight > viewportWidth) {
          const left = viewportWidth - catBoxPositionRight;
          categories.push({ left });
        } else {
          categories.push(null);
        }
      }
      dispatch(setDesktopNavPositioning(categories));
    }
  };
}
