import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SmileyFeedback"*/ './lazyIndex')
);

export const KnownIssuesFeedbackFormHeader = createLazyComponent(
    lazyModule,
    m => m.KnownIssuesFeedbackFormHeader
);
export const KnownIssuesFeedbackForm = createLazyComponent(
    lazyModule,
    m => m.KnownIssuesFeedbackForm
);

export const lazyUpdateFeedbackArea = new LazyAction(lazyModule, m => m.updateFeedBackArea);
