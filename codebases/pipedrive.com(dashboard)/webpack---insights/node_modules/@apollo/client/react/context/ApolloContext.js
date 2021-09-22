import React from 'react';
import { canUseWeakMap } from "../../utilities/index.js";
var cache = new (canUseWeakMap ? WeakMap : Map)();
export function getApolloContext() {
    var context = cache.get(React.createContext);
    if (!context) {
        context = React.createContext({});
        context.displayName = 'ApolloContext';
        cache.set(React.createContext, context);
    }
    return context;
}
export { getApolloContext as resetApolloContext };
//# sourceMappingURL=ApolloContext.js.map