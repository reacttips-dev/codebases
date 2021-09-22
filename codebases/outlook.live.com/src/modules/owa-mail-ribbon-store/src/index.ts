export { default as loadMailRibbonConfiguration } from './actions/loadMailRibbonConfiguration';
export { default as setSelectedTab } from './actions/saveSelectedTab';
export { getStore, default as getMailRibbonConfigStore } from './store/store';
export { MailRibbonConfigStore } from './store/schema/mailRibbonConfigStore';
export { RibbonId } from './util/ribbonId';
export { LabelPreferenceId } from './util/labelPreferencesIds';
export { getStringRibbonId } from './util/getStringRibbonId';
export type { MailRibbonGroup } from './store/schema/mailRibbonGroup';
export { isEncryptionAvailable } from './util/isEncryptionAvailable';
export { getDefaultConfig } from './util/defaultConfig';
export { TabScalingAndLayoutConfig } from './store/schema/tabScalingAndLayoutConfig';
export { defaultGroupStringMap } from './util/getDefaultGroupStringMap';
import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "MailRibbon"*/ './lazyIndex'));

export const lazySaveMailRibbonConfiguration = new LazyAction(
    lazyModule,
    m => m.saveMailRibbonConfiguration
);

export const lazySaveSelectedTab = new LazyAction(lazyModule, m => m.saveSelectedTab);

import './mutators/loadMailRibbonConfigurationMutator';
