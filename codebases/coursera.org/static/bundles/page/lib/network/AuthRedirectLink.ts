import { ApolloLink } from 'apollo-link';
import { onError, ErrorHandler } from 'apollo-link-error';
import { DocumentNode } from 'graphql/language/ast';
import { RedirectError } from 'bundles/ssr/lib/errors/directives';
import inServerContext from 'bundles/ssr/util/inServerContext';
import redirect from 'js/lib/coursera.redirect';

const DIRECTIVE_VALUE = 'redirectToLogin';

export const queryContainsRedirectToLoginDirective = (query: DocumentNode): boolean => {
  return query.definitions.some((queryDef) => {
    return (
      queryDef.kind === 'OperationDefinition' &&
      queryDef.directives?.some((directive) => directive.name.value === DIRECTIVE_VALUE)
    );
  });
};

export const errorHandler: ErrorHandler = ({ operation, networkError }) => {
  if (
    queryContainsRedirectToLoginDirective(operation.query) &&
    networkError &&
    'statusCode' in networkError &&
    networkError.statusCode === 403
  ) {
    if (inServerContext) {
      // the networkError.response object contains the url that resulted in the 403
      /* eslint-disable no-console */
      console.error(
        'redirect to login page from 403 error failed because of SSR with the following response and query',
        networkError.response,
        operation.query
      );
      throw new RedirectError(302, '/?authMode=login');
    } else {
      // redirect the user to the login page when there is a 403 response
      // the networkError.response object contains the url that resulted in the 403
      /* eslint-disable no-console */
      console.warn(
        'redirect to login page from 403 error with the following response and query',
        networkError.response,
        operation.query
      );
      redirect.setLocation(`/?authMode=login&redirectTo=${window.location.pathname}`);
    }
  }
};
/**
 * This is a apollo link that would redirect the user to the login page
 * if the network response is 403 in a CSR environment
 */
const AuthRedirectLink: ApolloLink = onError(errorHandler);

export default AuthRedirectLink;
