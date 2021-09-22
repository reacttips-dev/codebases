import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "ItemActions"*/ './lazyIndex'));

export let AddReactionButton = createLazyComponent(lazyModule, m => m.AddReactionButton);

export let ReactionActionButton = createLazyComponent(lazyModule, m => m.ReactionActionButton);

export let ReactionsOnMessageContainer = createLazyComponent(
    lazyModule,
    m => m.ReactionsOnMessageContainer
);

export let ReactionsContainer = createLazyComponent(lazyModule, m => m.ReactionsContainer);
