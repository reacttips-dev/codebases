import user from 'js/lib/user';
import localStorageEx from 'bundles/common/utils/localStorageEx';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { isDesktopOrSmaller } from 'bundles/phoenix/utils/matchMedia';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const uiPanelVisibilityPreferenceKey = () => `${user.get().id}~HighlightingUIPanelVisibilityPreference`;

class HighlightingUIPanelVisibilityPreferenceStore extends BaseStore {
  static storeName = 'HighlightingUIPanelVisibilityPreferenceStore';

  static handlers = {
    setHighlightingUIPanelVisibilityPreference: 'onSetHighlightingUIPanelVisibilityPreference',
    setHighlightingUIPanelEnabled: 'onSetHighlightingUIPanelEnabled',
    setHighlightsCount: 'onSetHighlightsCount',
  };

  onSetHighlightingUIPanelVisibilityPreference(value: boolean) {
    this.uiPanelVisibilityPreference = value;
    localStorageEx.setItem(uiPanelVisibilityPreferenceKey(), value, String);

    this.emitChange();
  }

  onSetHighlightingUIPanelEnabled(value: boolean) {
    this.uiPanelEnabled = value;
    this.emitChange();
  }

  onSetHighlightsCount(value: number) {
    this.highlightsCount = value;
    this.emitChange();
  }

  uiPanelEnabled: boolean;

  uiPanelVisibilityPreference: boolean;

  highlightsCount: number;

  emitChange!: () => void;

  constructor(dispatcher: $TSFixMe) {
    super(dispatcher);

    const item = localStorageEx.getItem(uiPanelVisibilityPreferenceKey(), String, undefined);

    this.uiPanelEnabled = true;
    this.uiPanelVisibilityPreference = (!item || item === 'true') && !isDesktopOrSmaller();
    this.highlightsCount = 0;
  }

  hasLoaded() {
    return true;
  }

  getUIPanelVisibilityPreference() {
    return this.uiPanelVisibilityPreference;
  }

  getUIPanelEnabled() {
    return this.uiPanelEnabled;
  }

  getHighlightsCount() {
    return this.highlightsCount;
  }
}

export default HighlightingUIPanelVisibilityPreferenceStore;
