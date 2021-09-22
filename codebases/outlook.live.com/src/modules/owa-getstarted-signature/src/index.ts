import { LazyModule, LazyAction } from 'owa-bundling';

const getStartedSignatureEditorLazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GetStartedSignatureEditor" */ './lazyIndex')
);

export let lazyLoadSignatureEditorWizard = new LazyAction(
    getStartedSignatureEditorLazyModule,
    m => m.loadSignatureEditorWizardUtil
);
