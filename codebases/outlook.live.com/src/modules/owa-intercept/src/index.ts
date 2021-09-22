import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import('./lazyIndex'));
export const lazyShowCustomerFeedbackIntercept = new LazyAction(
    lazyModule,
    m => m.showCustomerFeedbackIntercept
);
