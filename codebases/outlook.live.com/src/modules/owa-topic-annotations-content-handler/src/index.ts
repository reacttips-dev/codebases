import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TopicAnnotations" */ './lazyIndex')
);

// Constants
export const TOPIC_CONTENT_HANDLER_NAME = 'TopicContentHandler';
export const MANUAL_TOPIC_CONTENT_HANDLER_NAME = 'ManualTopicContentHandler';

// Lazy utils
export const lazyCreateTopicContentHandler = new LazyImport(
    lazyModule,
    m => m.createTopicContentHandler
);

export const lazyManualTopicContentHandler = new LazyImport(
    lazyModule,
    m => m.ManualTopicContentHandler
);
