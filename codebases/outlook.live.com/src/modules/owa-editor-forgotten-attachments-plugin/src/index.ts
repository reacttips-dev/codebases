import { LazyModule } from 'owa-bundling';
import createLazyPlugin, { LazyPlugin } from 'owa-editor-lazy-plugin/lib/utils/createLazyPlugin';
import type { ForgottenAttachmentsPlugin } from './plugins/ForgottenAttachmentsPlugin';
import { forgottenAttachmentsPluginTrigger } from './utils/forgottenAttachmentsPluginTrigger';
import PluginNames from 'owa-editor-lazy-plugin/lib/utils/PluginNames';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ForgottenAttachments" */ './lazyIndex')
);

export type LazyForgottenAttachmentsPlugin = LazyPlugin<ForgottenAttachmentsPlugin>;

export const LazyForgottenAttachmentsPluginClass = createLazyPlugin(
    lazyModule,
    m => m.ForgottenAttachmentsPlugin,
    PluginNames.ForgottenAttachments,
    forgottenAttachmentsPluginTrigger,
    true /* reusable when switching from inline compose to full compose */
);

// Exported non-lazy utils
export { getCountOfAttachmentTriggerKeywords } from './utils/getCountOfAttachmentTriggerKeywords';
export { createForgottenAttachmentsPluginViewState } from './utils/createForgottenAttachmentsPluginViewState';
