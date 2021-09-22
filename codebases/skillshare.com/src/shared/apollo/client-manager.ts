var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import ApolloClient, { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { isFunction, merge, pick } from 'lodash';
import { Defaults, Resolvers, Types } from '../../schema';
export var fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
        __schema: {
            types: [
                {
                    kind: 'OBJECT',
                    name: 'SubscriptionCoupon',
                    possibleTypes: [
                        {
                            name: 'PercentageOffCoupon',
                        },
                        {
                            name: 'ScholarshipCoupon',
                        },
                        {
                            name: 'FreeTrialCoupon',
                        },
                    ],
                },
                {
                    kind: 'INTERFACE',
                    name: 'ContentSection',
                    possibleTypes: [
                        {
                            name: 'WelcomeClassesSection',
                        },
                        {
                            name: 'BasicContentSection',
                        },
                    ],
                },
                {
                    kind: 'UNION',
                    name: 'ContentSectionItem',
                    possibleTypes: [
                        {
                            name: 'Class',
                        },
                    ],
                },
            ],
        },
    },
});
var ApolloClientManager = (function () {
    function ApolloClientManager() {
    }
    ApolloClientManager.createClient = function (config, context, initialState) {
        var createCache = config.createCache || ApolloClientManager.createDefaultCache;
        var cache = createCache().restore(initialState || {});
        cache.writeData({
            data: Defaults,
        });
        var safeConfig = __assign({ fetch: ApolloClientManager.getFetcher(context), resolvers: Resolvers, typeDefs: Types, cache: cache }, config);
        return new ApolloClient(safeConfig);
    };
    ApolloClientManager.getFetcher = function (context) {
        if (!process.browser) {
            return function (input, init) {
                var prevHeaders = pick((context && context.request.headers) || {}, 'cookie');
                var headers = merge({}, init.headers, prevHeaders);
                return fetch(input, __assign(__assign({}, init), { headers: headers }));
            };
        }
        return undefined;
    };
    ApolloClientManager.getClient = function (config, context, initialState) {
        var safeConfig = isFunction(config) ? config(context) : config;
        if (!process.browser) {
            return ApolloClientManager.createClient(safeConfig, context, initialState);
        }
        if (!ApolloClientManager.client) {
            ApolloClientManager.client = ApolloClientManager.createClient(safeConfig, context, initialState);
        }
        return ApolloClientManager.client;
    };
    ApolloClientManager.createDefaultCache = function () {
        return new InMemoryCache({
            fragmentMatcher: fragmentMatcher,
        });
    };
    return ApolloClientManager;
}());
export { ApolloClientManager };
//# sourceMappingURL=client-manager.js.map