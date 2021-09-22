import createLazyPlugin, { LazyPlugin } from 'owa-editor-lazy-plugin/lib/utils/createLazyPlugin';
import { LazyModule, LazyImport } from 'owa-bundling';
import type AtMentionPickerPlugin from './plugin/AtMentionPickerPlugin';
import { PluginEventType } from 'roosterjs-editor-types';
import PluginNames from 'owa-editor-lazy-plugin/lib/utils/PluginNames';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "HtmlEditorMentionsPlugin" */ './lazyIndex')
);
export type LazyAtMentionsPickerPlugin = LazyPlugin<AtMentionPickerPlugin>;

export let LazyAtMentionsPickerPluginClass = createLazyPlugin(
    lazyModule,
    m => m.AtMentionPickerPlugin,
    PluginNames.AtMentionsPicker,
    event => event.eventType == PluginEventType.EditorReady
);

export const lazyLoadAtMentionsData = new LazyImport(lazyModule, m => m.loadAtMentionsData);
