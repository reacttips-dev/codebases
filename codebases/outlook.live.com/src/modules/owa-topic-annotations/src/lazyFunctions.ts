import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TopicAnnotations" */ './lazyIndex')
);

export const lazyGetTopicDefinition = new LazyAction(lazyModule, m => m.getTopicDefinition);
export const lazyGetTopicAnnotations = new LazyAction(lazyModule, m => m.getTopicAnnotations);
export const lazyGetMyTopics = new LazyAction(lazyModule, m => m.getMyTopics);
export const lazyGetTopicsByName = new LazyAction(lazyModule, m => m.getTopicsByName);
export const lazyLogEvent = new LazyAction(lazyModule, m => m.logEvent);
export const lazyGetTopicsSdkAsync = new LazyAction(lazyModule, m => m.getTopicsSdkAsync);
