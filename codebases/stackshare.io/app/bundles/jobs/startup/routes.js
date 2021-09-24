import {CATCH_ALL_ROUTE, SIGN_IN_ROUTE, SLUG_CAPTURE} from '../../../shared/constants/routes';

export const routes = {
  [SIGN_IN_ROUTE]: (match, props, prevRouteContext) => ({
    ...prevRouteContext,
    signin: true
  }),
  [`^/jobs/${SLUG_CAPTURE}$`]: match => ({
    slug: match[1]
  }),
  [CATCH_ALL_ROUTE]: () => ({slug: null})
};
