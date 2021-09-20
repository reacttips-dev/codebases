import { validViews } from '../../common/constants/views.js';

const validViewsSet = new Set(validViews);

/**
 * This module is used for keeping track of the view that is active
 * For now, we have the `'workspace-builder-view`, `workspace-browser-view` and `modal` as possible active views
 */
class ActiveViewManager {
  views = [];

  pushActiveView (activeView) {
    if (!validViewsSet.has(activeView)) {
      pm.logger.warn('ActiveViewManager~pushActiveView: Ignoring since the value is not supported', activeView);
      return;
    }

    this.views.push(activeView);
  }

  popActiveView () {
    if (_.size(this.views) <= 1) {
      pm.logger.warn('ActiveViewManager~popActiveView: Cannot pop the last active view');
      return;
    }

    this.views.pop();
  }

  updateActiveView (activeView) {
    if (!validViewsSet.has(activeView)) {
      pm.logger.warn('ActiveViewManager~updateActiveView: Ignoring since the value is not supported', activeView);
      return;
    }

    this.views = [activeView];
  }

  get activeView () {
    return _.last(this.views) || 'workspace-builder-view';
  }
}

export default new ActiveViewManager();
