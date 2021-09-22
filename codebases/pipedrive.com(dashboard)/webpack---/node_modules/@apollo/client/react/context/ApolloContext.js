import React from 'react';
var contextSymbol = typeof Symbol === 'function' && Symbol.for ?
    Symbol.for('__APOLLO_CONTEXT__') :
    '__APOLLO_CONTEXT__';
export function resetApolloContext() {
    Object.defineProperty(React, contextSymbol, {
        value: React.createContext({}),
        enumerable: false,
        configurable: true,
        writable: false,
    });
}
export function getApolloContext() {
    if (!React[contextSymbol]) {
        resetApolloContext();
    }
    return React[contextSymbol];
}
//# sourceMappingURL=ApolloContext.js.map