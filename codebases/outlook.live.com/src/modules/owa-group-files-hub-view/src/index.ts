import { LazyModule, createLazyComponent } from 'owa-bundling';
import type * as imports from './lazyIndex';

const lazyModule = new LazyModule<typeof imports>(
    () => import(/* webpackChunkName: "GroupFilesHub" */ './lazyIndex')
);

export const LazyGroupFilesHub = createLazyComponent(lazyModule, m => m.FilesHub);

export const LazyGroupFilesHubCommandBar = createLazyComponent(
    lazyModule,
    m => m.FilesHubCommandBar
);

export const LazyGroupFilesHubSxSLayerView = createLazyComponent(
    lazyModule,
    m => m.GroupFilesHubSxSLayerView
);
