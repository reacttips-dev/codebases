import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ChannelReadyNotification"*/ './lazyIndex')
);

export const lazySubscribeToChannelReadyNotification = new LazyAction(
    lazyModule,
    m => m.subscribeToChannelReadyNotification
);
