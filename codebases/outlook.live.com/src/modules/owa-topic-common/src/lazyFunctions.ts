import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TopicCommon" */ './lazyIndex')
);

export const lazyGetTopicsSdkAsync = new LazyAction(lazyModule, m => m.getTopicsSdkAsync);

export const lazyGetManualTopicsByConversationId = new LazyAction(
    lazyModule,
    m => m.getManualTopicsByConversationId
);
export const lazyGetManualTopicsByItem = new LazyAction(lazyModule, m => m.getManualTopicsByItem);
export const lazyGetTopicsByConversationId = new LazyAction(
    lazyModule,
    m => m.getTopicsByConversationId
);
export const lazyGetTopicsByItem = new LazyAction(lazyModule, m => m.getTopicsByItem);
export const lazyGetTopicAnnotationsFromItem = new LazyAction(
    lazyModule,
    m => m.getTopicAnnotationsFromItem
);

export const TopicManualAnnotation = createLazyComponent(lazyModule, m => m.TopicManualAnnotation);
