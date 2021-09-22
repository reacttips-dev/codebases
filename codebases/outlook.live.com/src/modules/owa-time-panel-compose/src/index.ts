import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TimePanelCompose"*/ './lazyIndex')
);

export const ComposeForm = createLazyComponent(lazyModule, m => m.ComposeForm);

export const lazyShouldShowComposeFormInline = new LazyAction(
    lazyModule,
    m => m.shouldShowComposeFormInline
);

export const lazyOpenComposeFormInline = new LazyAction(lazyModule, m => m.openComposeFormInline);

export * from './actions/publicActions';
