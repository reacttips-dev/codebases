import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "EvaluateSafeLink" */ './lazyIndex')
);

export const lazyEvaluateSafeLink = new LazyImport(lazyModule, m => m.evaluateSafeLink);
export const lazyEvaluateSafeLinks = new LazyImport(lazyModule, m => m.evaluateSafeLinks);

export const lazyIsSafeLink = new LazyImport(lazyModule, m => m.isSafeLink);
export const lazyIsSafeLinkUrl = new LazyImport(lazyModule, m => m.isSafeLinkUrl);

export {
    ORIGINALSRC_ATTTIBUTE_NAME,
    SHASH_ATTTIBUTE_NAME,
    DATA_AUTH_ATTTIBUTE_NAME,
    RESERVED_PARAM,
    VERIFIED_SAFE_LINK,
} from './utils/constants';
