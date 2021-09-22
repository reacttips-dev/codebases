import { LazyModule } from 'owa-bundling';
import { createLazyApolloComponent } from 'owa-apollo-component';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "MailModule"*/ './lazyIndex'));

// Delay loaded components
// Need to be wrapped with lazy apollo component so that the component is wrapped with the apollo provider
// and apollo client instance is available in the apollo hooks
export const MailLeftPaneAsOverlay = createLazyApolloComponent(
    lazyModule,
    m => m.MailLeftPaneAsOverlay
);
