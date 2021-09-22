import { createLazyComponent, LazyModule } from 'owa-bundling';
const lazyModule = new LazyModule(() => import('./lazyIndex'));
export const OpenAnotherMailboxDialog = createLazyComponent(
    lazyModule,
    m => m.OpenAnotherMailboxDialog
);
