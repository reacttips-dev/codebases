import { LazyModule, LazyAction, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Options" */ './lazyIndex'));

export let lazyConfirmOptionNavigation = new LazyAction(lazyModule, m => m.confirmOptionNavigation);
export let OptionsEditor = createLazyComponent(lazyModule, m => m.OptionsEditor);

export type { default as Option, CoreOption, LazyOption } from './store/schema/Option';
export type { default as OptionCategory } from './store/schema/OptionCategory';
export type { default as OptionSubCategory } from './store/schema/OptionSubCategory';
export type {
    default as OptionComponentSettings,
    OptionComponentCallbackProps,
} from './store/schema/OptionComponentSettings';
export { default as SubCategoryState } from './store/schema/SubCategoryState';
export type {
    default as OptionQuickComponentSettings,
    OptionQuickComponentSettingsWithKey,
    OptionQuickCustomRenderComponentProps,
    OptionQuickToggleProps,
    OptionQuickCustomRenderProps,
    QuickSettingTooltip,
} from './store/schema/OptionQuickComponentSettings';
export { default as QuickSettingOrder } from './store/schema/QuickSettingOrder';

// Export service helpers
export { default as setMailboxMessageConfiguration } from './services/setMailboxMessageConfiguration';

// Export utils
export { default as getFallbackValueIfNull } from './utils/getFallbackValueIfNull';
export { createLazyOption } from './utils/createLazyOption';
export { tryLoadAllFullOptionsSync, FullOption } from './utils/tryLoadAllFullOptionsSync';

// Export public actions
export { hideFullOptions } from './actions/publicActions';
export type { ExternalMessageEditorProps } from './components/OptionsEditor';
