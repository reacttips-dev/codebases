import type { ApolloError } from '@apollo/client';

export function apolloErrorToResponseCode(error: ApolloError): string {
    let responseCode: string = '';

    if (error.graphQLErrors) {
        error.graphQLErrors.forEach(graphQlError => {
            if (graphQlError.extensions?.responseCode) {
                responseCode = graphQlError.extensions.responseCode;
            }
        });
    }

    return responseCode;
}
