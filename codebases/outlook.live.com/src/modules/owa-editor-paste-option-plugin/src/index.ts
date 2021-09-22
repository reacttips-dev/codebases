import type PasteOptionPlugin from './plugin/PasteOptionPlugin';
import createLazyPlugin, { LazyPlugin } from 'owa-editor-lazy-plugin/lib/utils/createLazyPlugin';
import pasteOptionPluginTrigger from './utils/pasteOptionPluginTrigger';
import { LazyModule } from 'owa-bundling';
import PluginNames from 'owa-editor-lazy-plugin/lib/utils/PluginNames';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "HtmlEditorLazyPlugins" */ './lazyIndex')
);

export type LazyPasteOptionPlugin = LazyPlugin<PasteOptionPlugin>;

export let LazyPasteOptionPluginClass = createLazyPlugin(
    lazyModule,
    m => m.PasteOptionPlugin,
    PluginNames.PasteOption,
    pasteOptionPluginTrigger
);

// Types
export { default as createPasteOptionViewState } from './utils/createPasteOptionViewState';
