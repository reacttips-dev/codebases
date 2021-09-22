import type LinkPlugin from './plugin/LinkPlugin';
import linkPluginTrigger from './utils/linkPluginTrigger';
import { LazyModule } from 'owa-bundling';
import createLazyPlugin, { LazyPlugin } from 'owa-editor-lazy-plugin/lib/utils/createLazyPlugin';
import PluginNames from 'owa-editor-lazy-plugin/lib/utils/PluginNames';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "HtmlEditorLinkPlugin" */ './lazyIndex')
);

// exported types and interfaces
export type LazyLinkPlugin = LazyPlugin<LinkPlugin>;

export const LazyLinkPluginClass = createLazyPlugin(
    lazyModule,
    m => m.LinkPlugin,
    PluginNames.Link,
    linkPluginTrigger,
    true /* reusable when switching from inline compose to full compose */
);

// Actions. Subscribbed to so it cannot be lazy
export { removeSharingLinks } from './actions/publicActions';
