import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Options" */ './lazyIndex'));

export let lazySaveReadingPaneOption = new LazyAction(
    lazyModule,
    m => m.saveReadingPaneOptionQuick
);
export { saveReadingPanePositionOption } from './actions/saveReadingPanePositionOption';
