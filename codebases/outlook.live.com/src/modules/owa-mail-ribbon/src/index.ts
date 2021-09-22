import { LazyModule } from 'owa-bundling';
import { createLazyApolloComponent } from 'owa-apollo-component';

export let LazyMailRibbon = createLazyApolloComponent(
    new LazyModule(() => import(/* webpackChunkName: "MailRibbon" */ './lazyIndex')),
    m => m.MailRibbon
);
