import React from 'react';
import { ApolloProvider as DefaultApolloProvider } from 'react-apollo';
import { ApolloProvider as DefaultApolloHooksProvider } from '@apollo/react-hooks';
export var ApolloProvider = function (props) {
    var children = props.children, client = props.client;
    return (React.createElement(DefaultApolloProvider, { client: client },
        React.createElement(DefaultApolloHooksProvider, { client: client }, children)));
};
//# sourceMappingURL=default.js.map