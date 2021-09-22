import { LazyModule } from 'owa-bundling';
import wrapLazy from './utils/wrapLazy';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailComposeCommand"*/ './lazyIndex')
);

export const send = wrapLazy(lazyModule, 'send');
export const save = wrapLazy(lazyModule, 'save');
export const runPostOpenTasks = wrapLazy(lazyModule, 'runPostOpenTasks');
export const switchBodyType = wrapLazy(lazyModule, 'switchBodyType');
export const discard = wrapLazy(lazyModule, 'discard');
export const upConvert = wrapLazy(lazyModule, 'upConvert');
export const insertSignature = wrapLazy(lazyModule, 'insertSignature');
export const popoutCompose = wrapLazy(lazyModule, 'popoutCompose');
export const createAttachments = wrapLazy(lazyModule, 'createAttachments');
export const clickAttachButton = wrapLazy(lazyModule, 'clickAttachButton');
export const showMessageOptionsDialog = wrapLazy(lazyModule, 'showMessageOptionsDialog');
