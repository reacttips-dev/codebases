import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFocusManager" */ './lazyIndex')
);
export const lazyRegisterComponent = new LazyAction(lazyModule, m => m.registerComponent);
export const lazyResetFocus = new LazyAction(lazyModule, m => m.resetFocus);
export const lazySetFocusToSynchronous = new LazyAction(lazyModule, m => m.setFocusToSynchronous);

export { tabIndex } from './tabIndex';
export { FocusComponent } from './types/FocusComponent';
