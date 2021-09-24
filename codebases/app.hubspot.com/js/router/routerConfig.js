'use es6';

import * as NavigationActions from 'flux-navigation-utils/actions/NavigationActions';
import { history } from './history';
export var routerConfig = {
  navigate: function navigate(url, state) {
    if (typeof url === 'string' && !url.startsWith('/')) {
      // react router just uses the normal browser history API, which assumes
      // that any URL not prefixed with a slash is a relative URL. this
      // is currently always undesired. we can revisit this API hwen the need
      // arises.
      url = "/" + url;
    }

    history.push(url, state); // on navigate we need to forcefully update the navigation store so it
    // picks up the new URL path/query state

    NavigationActions.navigate(function () {
      return null;
    }, state);
  }
};