import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TimePanelTaskDetails" */ './lazyIndex')
);

// Delay loaded actions
export const lazyUpdateSelectedTaskId = new LazyAction(lazyModule, m => m.updateSelectedTaskId);

// Delayed loaded components
export const TaskDetailsView = createLazyComponent(lazyModule, m => m.TaskDetailsView);
