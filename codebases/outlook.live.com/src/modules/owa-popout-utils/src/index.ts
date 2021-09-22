import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PopoutUtils" */ './lazyIndex')
);

export const lazyPopoutReadingPane = new LazyAction(lazyModule, m => m.popoutReadingPane);
export const lazyOpenTableRowInPopout = new LazyAction(lazyModule, m => m.openTableRowInPopout);
