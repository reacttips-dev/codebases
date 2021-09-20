import { getUrlParts } from '../../utils/NavigationUtil';
import { MODAL, RIGHT_OVERLAY_MODAL, EDITOR_TAB, WORKSPACE, COLLECTION_BROWSER, EDITOR_SUB_VIEW, HOME, OPEN_INTEGRATIONS_HOME_URL } from '../../constants/ViewHierarchyConstants.js';

/**
 * This module is used for keeping track of the view that is active
 * For now, we have the `'workspace-builder-view`, `workspace-browser-view` and `modal` as possible active views
 */
class URLViewManager {
  constructor () {
    this.views = {
      [HOME]: {
        url: null,
        parent: null
      },
      [OPEN_INTEGRATIONS_HOME_URL]: {
        url: null,
        parent: null
      },
      [WORKSPACE]: {
        url: null,
        parent: null
      },
      [EDITOR_TAB]: {
        url: null,
        parent: WORKSPACE,
        index: 0
      },
      [EDITOR_SUB_VIEW]: {
        url: null,
        parent: EDITOR_TAB,
        index: 0
      },
      [RIGHT_OVERLAY_MODAL]: {
        url: null,
        parent: EDITOR_TAB,
        index: 1
      },
      [COLLECTION_BROWSER]: {
        url: null,
        parent: WORKSPACE,
        index: 1
      },
      [MODAL]: {
        url: null,
        parent: WORKSPACE,
        index: 2
      }
    };
  }

  updateURLForViews (url, routes) {
    let { queryString } = getUrlParts(url);
    let urlForView = '';

    routes.forEach((route) => {
      let view = route.view;
      urlForView = urlForView ? urlForView + '/' + route.url : route.url;

      if (!this.isSimilar(this.views[view].url, urlForView)) {
        this.clearURLForSubView(view);
      }
      this.views[view].url = urlForView;
    });

    if (routes.length > 0) {
      // append query params for the last view
      let lastView = routes[routes.length - 1].view;
      this.views[lastView].url = queryString ? url + '?' + queryString : url;
    }

  }

  closeView (closedView) {
     for (let view in this.views) {
      if (view == closedView) {
        this.views[view].url = null;
        this.clearURLForSubView(closedView);
      }
    }
  }

  getViewInFocus () {
    if (this.views[MODAL].url != null) {
      return MODAL;
    }
    if (this.views[COLLECTION_BROWSER].url != null) {
      return COLLECTION_BROWSER;
    }
    if (this.views[RIGHT_OVERLAY_MODAL].url != null) {
      return RIGHT_OVERLAY_MODAL;
    }
    if (this.views[EDITOR_SUB_VIEW].url != null) {
      return EDITOR_SUB_VIEW;
    }
    if (this.views[EDITOR_TAB].url != null) {
      return EDITOR_TAB;
    }
    if (this.views[WORKSPACE].url != null) {
      return WORKSPACE;
    }
    if (this.views[HOME].url !== null) {
      return HOME;
    }
    if (this.views[OPEN_INTEGRATIONS_HOME_URL].url !== null) {
      return OPEN_INTEGRATIONS_HOME_URL;
    }
    return null;
  }

  isSimilar (url1, url2) {
    const pattern = /\/.*~/g;

    // Remove the friendly slug for comparison
    let nonFriendlyUrl1 = url1 && url1.replace(pattern, '/');
    let nonFriendlyUrl2 = url2 && url2.replace(pattern, '/');
    let [pureUrl1 = ''] = nonFriendlyUrl1 ? nonFriendlyUrl1.split('?') : ['', ''];
    let [pureUrl2 = ''] = nonFriendlyUrl2 ? nonFriendlyUrl2.split('?') : ['', ''];

    return pureUrl1 === pureUrl2;
  }

  clearURLForSubView (view) { // EDITOR_TAB
    if (!view) {
      return;
    }
    this.views[view].url = null;
    for (let subView in this.views) {
      if (this.views[subView].parent === view) {
        this.clearURLForSubView(subView);
      }
    }
  }


}

export default new URLViewManager();
