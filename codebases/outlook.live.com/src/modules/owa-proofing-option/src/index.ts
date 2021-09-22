import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ProofingOptions" */ './lazyIndex')
);

export const lazyShowEditorOptions = new LazyAction(lazyModule, m => m.showEditorOptions);
export const lazyGetUserOptions = new LazyAction(lazyModule, m => m.getUserOptions);
export const lazyUpdateSettingDirectly = new LazyAction(lazyModule, m => m.updateSettingDirectly);
export const lazyTryStartTrial = new LazyAction(lazyModule, m => m.tryStartTrial);
export const lazyStartPremiumPreviewTimeBased = new LazyAction(
    lazyModule,
    m => m.startPremiumPreviewTimeBased
);
export const lazyGetDefaultOptions = new LazyAction(lazyModule, m => m.getDefaultOptions);
export const lazyGetDefaultUIOptions = new LazyAction(lazyModule, m => m.getDefaultUIOptions);
export const lazyGetAllOverriddenOptions = new LazyAction(
    lazyModule,
    m => m.getAllOverriddenOptions
);
export const lazyOpenUpsellUrlFromSettingsDialog = new LazyAction(
    lazyModule,
    m => m.openUpsellUrlFromSettingsDialog
);
export { UPSELL_CLICKED } from './constants';
export { isProofingSupportLocale } from './utils/isProofingSupportLocale';
