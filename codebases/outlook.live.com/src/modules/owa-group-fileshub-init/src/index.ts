import { LazyAction, LazyModule } from 'owa-bundling';
import type * as imports from './lazyIndex';

const lazyModule = new LazyModule<typeof imports>(
    () => import(/* webpackChunkName: "GroupFilesHubInit" */ './lazyIndex')
);

export const lazySetGroupFilesHubCallbacks = new LazyAction(
    lazyModule,
    m => m.setGroupFilesHubCallbacks
);
