import type { FluidPlugin } from './plugin/FluidPlugin';
import { preloadFluid } from 'owa-fluid-tenantconfig';
import createLazyPlugin, { LazyPlugin } from 'owa-editor-lazy-plugin/lib/utils/createLazyPlugin';
import { LazyModule, LazyImport, LazyAction, registerLazyOrchestrator } from 'owa-bundling';
import { PluginEventType } from 'roosterjs-editor-types';
import PluginNames from 'owa-editor-lazy-plugin/lib/utils/PluginNames';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Fluid" */ './lazyIndex'));

export type LazyFluidPlugin = LazyPlugin<FluidPlugin>;

export const LazyFluidPluginClass = createLazyPlugin(
    lazyModule,
    m => m.FluidPlugin,
    PluginNames.Fluid,
    event => event.eventType == PluginEventType.EditorReady
);

export const lazyMountFluidComponent = new LazyImport(
    lazyModule,
    m => m.mountFluidComponentExternal
);

export const lazyTryGetFluidDriverForUrl = new LazyImport(
    lazyModule,
    m => m.tryGetFluidDriverForUrl
);

export const lazyCreateNewFluidComponent = new LazyImport(
    lazyModule,
    m => m.createNewFluidComponent
);

export const lazyGetAgendaCodeDetails = new LazyImport(lazyModule, m => m.getAgendaCodeDetails);

export const lazyRenderFluidHeroMenu = new LazyAction(lazyModule, m => m.renderFluidHeroMenu);

// Lazy orchestrator
registerLazyOrchestrator(preloadFluid, lazyModule, m => m.preloadFluidOrchestrator);

export const lazyPreloadFluidInCollabSpace = new LazyAction(
    lazyModule,
    m => m.preloadFluidInCollabSpace
);

export const lazyIsPreloadFluidInCollabSpaceComplete = new LazyAction(
    lazyModule,
    m => m.isPreloadFluidInCollabSpaceComplete
);

export const lazyCopyFluidComponent = new LazyAction(lazyModule, m => m.copyFluidComponent);

export type {
    FluidContainerConfigForEditor,
    FluidContainerConfigForDiv,
} from './store/schema/FluidContainerConfig';

export { onFluidComponentRendered } from './actions/publicActions';
