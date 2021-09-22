import getFolderData from 'owa-mail-actions/lib/getFolderData';
import { LazyModule, registerLazyOrchestrator } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FolderOrchestration" */ './lazyIndex')
);

registerLazyOrchestrator(getFolderData, lazyModule, m => m.getFolderDataOrchestrator);
