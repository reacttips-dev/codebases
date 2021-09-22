import { LazyAction, LazyImport, LazyModule } from 'owa-bundling';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaFluidLink" */ './lazyIndex')
);

// Delay loaded utility functions
export const lazyProcessFluidPlaceholder = new LazyImport(
    lazyModule,
    m => m.processFluidPlaceholder
);

export const lazyProcessCollabSpaceShareLink = new LazyAction(
    lazyModule,
    m => m.processCollabSpaceShareLink
);

// non-delay loaded actions
export {
    onFluidFileInserted,
    onFluidFileCreationFailed,
    onFluidPlaceholderCreated,
    onFluidFileLoadFailure,
} from './actions/publicActions';

// Types
export type { ComposeLinkParameters } from './types/ComposeLinkParameters';
