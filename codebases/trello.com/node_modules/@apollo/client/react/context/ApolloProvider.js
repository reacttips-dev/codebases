import React from 'react';
import { invariant } from 'ts-invariant';
import { getApolloContext } from "./ApolloContext.js";
export var ApolloProvider = function (_a) {
    var client = _a.client, children = _a.children;
    var ApolloContext = getApolloContext();
    return React.createElement(ApolloContext.Consumer, null, function (context) {
        if (context === void 0) { context = {}; }
        if (client && context.client !== client) {
            context = Object.assign({}, context, { client: client });
        }
        process.env.NODE_ENV === "production" ? invariant(context.client, 28) : invariant(context.client, 'ApolloProvider was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
        return (React.createElement(ApolloContext.Provider, { value: context }, children));
    });
};
//# sourceMappingURL=ApolloProvider.js.map