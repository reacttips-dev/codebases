import { LazyAction, LazyModule } from 'owa-bundling';

export { isWorkLifeViewEnabledForUser } from './utils/isWorkLifeViewEnabledForUser';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CalendarWorkLifeViewOption" */ './lazyIndex')
);

export const lazyEnableWorkView = new LazyAction(lazyModule, m => m.enableWorkView);
export const lazyDisableWorkView = new LazyAction(lazyModule, m => m.disableWorkView);
export const lazyEnableLifeView = new LazyAction(lazyModule, m => m.enableLifeView);
export const lazyDisableLifeView = new LazyAction(lazyModule, m => m.disableLifeView);
