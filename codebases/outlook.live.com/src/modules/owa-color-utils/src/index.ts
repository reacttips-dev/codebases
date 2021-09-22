import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "ColorUtils" */ './lazyIndex'));

export const lazyGenerateColorScheme = new LazyAction(lazyModule, m => m.generateColorScheme);
export const lazyGetOptimalTextColorString = new LazyAction(
    lazyModule,
    m => m.getOptimalTextColorString
);
