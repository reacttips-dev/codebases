import createLazyPlugin, { LazyPlugin } from 'owa-editor-lazy-plugin/lib/utils/createLazyPlugin';
import { LazyModule, LazyImport, LazyAction } from 'owa-bundling';
import { PluginEventType } from 'roosterjs-editor-types';
import type { MessageExtensionCardPlugin } from './plugin/MessageExtensionCardPlugin';
import PluginNames from 'owa-editor-lazy-plugin/lib/utils/PluginNames';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MessageExtensionCards" */ './lazyIndex')
);

export const LazyMessageExtensionCardPluginClass = createLazyPlugin(
    lazyModule,
    m => m.MessageExtensionCardPlugin,
    PluginNames.MessageExtension,
    event => event.eventType == PluginEventType.EditorReady
);

export type LazyMessageExtensionCardPlugin = LazyPlugin<MessageExtensionCardPlugin>;
export { default as createMessageExtensionCardViewState } from './utils/createMessageExtensionCardViewState';
export { MESSAGE_EXTENSION_CARD_PLACEHOLDER_PREFIX } from './common/constants';
export { RenderingMode } from './common/enums';
export const lazyHydrateCard = new LazyImport(lazyModule, m => m.hydrateCard);
export const lazyHydrateCardFromJson = new LazyImport(lazyModule, m => m.hydrateCardFromJson);
export const lazyInitializeMessageExtensionCards = new LazyAction(
    lazyModule,
    m => m.initializeMessageExtensionCards
);
