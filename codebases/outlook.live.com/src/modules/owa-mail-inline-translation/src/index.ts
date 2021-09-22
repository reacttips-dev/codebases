import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "InlineTranslation"*/ './lazyIndex')
);

export let lazySetItemLocale = new LazyAction(lazyModule, m => m.setItemLocale);
export let lazyTranslateItem = new LazyAction(lazyModule, m => m.translateItem);
export let lazyUntranslateItem = new LazyAction(lazyModule, m => m.untranslateItem);
export let lazySetWrongLanguage = new LazyAction(lazyModule, m => m.setWrongLanguage);
export let TranslationFeedbackRibbon = createLazyComponent(
    lazyModule,
    m => m.TranslationFeedbackRibbon
);
