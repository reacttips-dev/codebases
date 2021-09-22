import { ActionContext } from 'js/lib/ActionContext';

import { compose } from 'recompose';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

export const setUIPanelVisibilityPreference = (actionContext: ActionContext, value: boolean) => {
  actionContext.dispatch('setHighlightingUIPanelVisibilityPreference', value);
};

export const setUIPanelEnabled = (actionContext: ActionContext, value: boolean) => {
  actionContext.dispatch('setHighlightingUIPanelEnabled', value);
};

export const setHighlightsCount = (actionContext: ActionContext, value: number) => {
  actionContext.dispatch('setHighlightsCount', value);
};

export const getUIPanelVisibilityPreference = (Component: React.ComponentType<any>) =>
  compose(
    // TODO: connectToStores<Props, InputProps, Stores>
    connectToStores<any, any>(
      ['HighlightingUIPanelVisibilityPreferenceStore'],
      ({ HighlightingUIPanelVisibilityPreferenceStore }) => ({
        expanded: HighlightingUIPanelVisibilityPreferenceStore.getUIPanelVisibilityPreference(),
        highlightsCount: HighlightingUIPanelVisibilityPreferenceStore.getHighlightsCount(),
      })
    )
  )(Component);

export default {
  setUIPanelVisibilityPreference,
  setUIPanelEnabled,
  setHighlightsCount,
  getUIPanelVisibilityPreference,
};
