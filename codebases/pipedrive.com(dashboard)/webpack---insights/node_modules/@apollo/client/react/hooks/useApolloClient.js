import React from 'react';
import { invariant } from 'ts-invariant';
import { getApolloContext } from "../context/index.js";
export function useApolloClient() {
    var client = React.useContext(getApolloContext()).client;
    process.env.NODE_ENV === "production" ? invariant(client, 33) : invariant(client, 'No Apollo Client instance can be found. Please ensure that you ' +
        'have called `ApolloProvider` higher up in your tree.');
    return client;
}
//# sourceMappingURL=useApolloClient.js.map