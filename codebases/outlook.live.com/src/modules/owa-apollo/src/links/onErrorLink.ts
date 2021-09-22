import { onError } from '@apollo/client/link/error';
import * as trace from 'owa-trace';
import { logUsage } from 'owa-analytics';
import { scrubForPii } from 'owa-config';

export const onErrorLink = onError(({ operation, graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(error => {
            if (!error.extensions?.fetchErrorType) {
                // This wasn't a known error type we generate. e.g. ServerFailure, RequestTimeout.
                // So we've failed because some other unhandled exception in the resolvers,
                // e.g. in validation, or mapping from OWS to GQL schema, or when calling into Hx.
                // We don't always alert on this, but rather preserve current behavior of
                // allowing the calling scenario decide whether to alert.
                // So we are just adding a logUsage and a debug trace.
                logUsage('onErrorLink_GraphQLError', {
                    message: scrubForPii(error.message),
                    path: error.path?.toString(),
                    stack: scrubForPii(error.stack),
                    operationName: operation.operationName,
                });
                trace.debugErrorThatWillShowErrorPopupOnly(
                    `[GraphQL error]: Message: ${error.message}, OperationName:${operation.operationName} Location: ${error.locations}, Path: ${error.path}`,
                    error // so the correct stack trace is displayed
                );
            }
        });
    }
});
