import type { ApolloError } from '@apollo/client';
import type { GraphQLError } from 'graphql';
import type { TraceErrorObject } from './index';

export function tryGetTraceObjectErrorFromApolloError(
    errorIn: Error | undefined
): TraceErrorObject | Error | undefined {
    if (!errorIn) {
        return undefined;
    }

    // We don't currently call into GraphQL APIs directly, so we don't get any network errors.
    // So look through the GraphQLErrors to find one.
    const error = getGraphQLErrorToUse(errorIn as ApolloError);
    if (error) {
        error.extensions &&
            Object.keys(error.extensions).forEach(key => {
                if (error.extensions![key] != undefined) {
                    error[key] = error.extensions![key];
                }
            });
        return error;
    } else {
        // If we couldn't find any graphQLError, then use the input error.
        return errorIn;
    }
}

function getGraphQLErrorToUse(error: ApolloError): GraphQLError | undefined {
    // Custom information added to TraceObjectError thrown in our resolvers are reported in
    // the extensions property of the GraphQLError (this is idiomatically
    // how extended information is reported in GraphQL).
    // So look for a GraphQLError with an extensions property.
    if (error.graphQLErrors) {
        // Not using a forEach here because we can't early return from it.
        for (let graphQLError of error.graphQLErrors) {
            if (graphQLError.extensions) {
                return graphQLError;
            }
        }
    }

    // If we couldn't find a graphQL error with an extensions object, use the first graphQLError.
    return error.graphQLErrors?.[0];
}
