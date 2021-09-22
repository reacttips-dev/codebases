import user from 'js/lib/user';

import 'js/app/setupEnvironment';

import courseV2Routes from 'bundles/course-v2/routes';
import loggedOutOndemandRoute from 'bundles/ondemand/loggedOutOndemandRoute';

import 'css!pages/open-course/index';
import 'css!bundles/ondemand/styl/index';

export default function () {
  return user.isAuthenticatedUser() ? courseV2Routes : loggedOutOndemandRoute;
}
