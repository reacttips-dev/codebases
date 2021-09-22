import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "LinkPreview" */ './lazyIndex')
);

export const lazyAddInteractiveElementsForReadingPane = new LazyAction(
    lazyModule,
    m => m.addInteractiveElementsForReadingPane
);
