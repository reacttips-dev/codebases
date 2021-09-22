import { InvariantError } from 'ts-invariant';
export var checkFetcher = function (fetcher) {
    if (!fetcher && typeof fetch === 'undefined') {
        throw process.env.NODE_ENV === "production" ? new InvariantError(22) : new InvariantError("\n\"fetch\" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor. For example:\n\nimport fetch from 'cross-fetch';\nimport { ApolloClient, HttpLink } from '@apollo/client';\nconst client = new ApolloClient({\n  link: new HttpLink({ uri: '/graphql', fetch })\n});\n    ");
    }
};
//# sourceMappingURL=checkFetcher.js.map