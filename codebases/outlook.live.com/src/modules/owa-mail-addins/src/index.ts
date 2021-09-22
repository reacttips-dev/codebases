import { SendFeedbackContainer } from 'owa-addins-core';
import { LazyImport, LazyModule } from 'owa-bundling';
import sendFeedbackCallback from './utils/createSendFeedbackCallback';

export { default as readItemSupportsAddins } from './utils/ReadItemSupportsAddins';
export { default as updateAddinOnItemNavigation } from './utils/updateAddinOnItemNavigation';
export { default as updateAddinOnNavigationToEmptyNullReadingPane } from './utils/updateAddinOnNavigationToEmptyNullReadingPane';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Addins" */ './lazyIndex'));

export const lazyCreateMailReadAdapter = new LazyImport(lazyModule, m => m.createMailReadAdapter);
export const lazyCreateMailComposeAdapter = new LazyImport(
    lazyModule,
    m => m.createMailComposeAdapter
);

SendFeedbackContainer.sendFeedback = sendFeedbackCallback;
