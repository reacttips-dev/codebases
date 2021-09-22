import { LazyAction, LazyModule, LazyImport } from 'owa-bundling';
export { default as SkypeNotificationOption } from './SkypeNotificationOption';
export { default as SkypeNotificationType } from './data/store/schema/SkypeNotificationType';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SkypeOptions"*/ './lazyIndex')
);

export const lazyInitializeNotificationSettings = new LazyAction(
    lazyModule,
    m => m.initializeNotificationSettings
);

export const lazyGetUserSkypeOptions = new LazyImport(lazyModule, m => m.getUserSkypeOptions);
