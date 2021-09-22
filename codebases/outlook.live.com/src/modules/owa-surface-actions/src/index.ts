import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SurfaceActions" */ './lazyIndex')
);

export const lazySetAddinOptionSurfaceItems = new LazyAction(
    lazyModule,
    m => m.setAddinOptionSurfaceItems
);

// Export synchronous utils and types
export { default as getAddinOptionSurfaceItems } from './utils/getAddinOptionSurfaceItems';
export {
    getComposeActionDisplayName,
    getReadActionDisplayName,
    getHoverActionDisplayName,
    DIVIDER_DISPLAY_NAME,
} from './utils/getDisplayNameFromKey';
export { getComposeActionIconName, getReadActionIconName } from './utils/getIconNameFromKey';
export {
    getComposeStaticActions,
    getReadStaticActions,
    shouldAddActionToEnd,
    shouldActionBeOnReadingPaneSurface,
    isReadingPaneSurfaceActionPinnedByUser,
} from './utils/getStaticActions';
export type { default as SurfaceActionItem } from './store/schema/SurfaceActionItem';
export type { default as StaticAction } from './store/schema/StaticAction';
export type { default as ReadStaticAction } from './store/schema/ReadStaticAction';
export {
    logUserAction,
    onCommandBarDataReduced,
    onCommandBarDataGrown,
} from './utils/telemetryUtils';

export type { default as AddinOptionSurfaceItems } from './store/schema/AddinOptionSurfaceItems';
