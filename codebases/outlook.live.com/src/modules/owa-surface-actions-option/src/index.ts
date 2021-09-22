import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SurfaceActionsOption" */ './lazyIndex')
);

export const lazyPinLikeSurfaceAction = new LazyAction(lazyModule, m => m.pinLikeSurfaceAction);
export { default as getHoverSurfaceAction } from './utils/hoverSurfaceActionHelper';
export { default as getStore } from './store/store';
