import { addNewMiddleWare } from 'owa-middleware';
import { promiseMiddleware } from 'satcheljs/lib/legacy/promise';
import { addDatapointMiddleware } from 'owa-analytics';
import { hasQueryStringParameter } from 'owa-querystring';
import { traceMiddleware, legacyTraceMiddleware } from 'owa-trace/lib/middleware';
import { isBootFeatureEnabled } from 'owa-metatags';

export default function initializeSatchelMiddleware() {
    // Add the framework middleware to any middleware the app might want bootstrapped
    const legacyMiddleware = isBootFeatureEnabled('disablemiddleware') ? [] : [promiseMiddleware];
    const middleware = [addDatapointMiddleware];

    if (process.env.NODE_ENV !== 'production') {
        /**
         * Get URL params and check that "enableTracing" is non-null (i.e. it's
         * present) before enabling tracing.
         */
        if (hasQueryStringParameter('enableTracing')) {
            // turn on tracing
            middleware.push(traceMiddleware);
            legacyMiddleware.push(legacyTraceMiddleware);
        }
    }

    addNewMiddleWare(middleware, legacyMiddleware);
}
