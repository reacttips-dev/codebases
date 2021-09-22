import { LazyModule, LazyAction } from 'owa-bundling';

// lazy loaded modules
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FetchTaggedEmail"*/ './lazyIndex')
);

export { TAG_EMAIL_HASHTAG } from './utils/constants';

export const lazyInitializeTaggedEmailsFetch = new LazyAction(
    lazyModule,
    m => m.initializeTaggedEmailsFetch
);
