import createLazyPlugin, { LazyPlugin } from 'owa-editor-lazy-plugin/lib/utils/createLazyPlugin';
import { LazyAction, LazyModule } from 'owa-bundling';
import type SmartComposePlugin from './plugin/SmartComposePlugin';
import smartComposePluginTrigger from './utils/smartComposePluginTrigger';
import PluginNames from 'owa-editor-lazy-plugin/lib/utils/PluginNames';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SmartComposePlugin" */ './lazyIndex')
);

export type LazySmartComposePlugin = LazyPlugin<SmartComposePlugin>;

export let LazySmartComposePluginClass = createLazyPlugin(
    lazyModule,
    m => m.Plugin.default,
    PluginNames.SmartCompose,
    smartComposePluginTrigger
);

export let updateRecipientsForSmartCompose = new LazyAction(
    lazyModule,
    m => m.Plugin.updateRecipientsForSmartCompose
);
