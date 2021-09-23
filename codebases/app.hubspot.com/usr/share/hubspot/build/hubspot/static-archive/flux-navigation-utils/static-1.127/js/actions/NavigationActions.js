'use es6';

import { parse } from 'hub-http/helpers/params';
import dispatcher from 'dispatcher/dispatcher';
import { NAVIGATE } from './NavigationActionTypes';
import { getPathname } from '../getPathname';
import { getSearch } from '../getSearch';
export var getHubSpotBasename = function getHubSpotBasename() {
  var hubspotBasePathnameRegex = /^\/[\w-]+\/\d+/;
  var parts = getPathname().match(hubspotBasePathnameRegex);
  return parts ? parts[0] : null;
};
export function navigate(pathName, params) {
  var fragment = getPathname().replace(getHubSpotBasename(), '');
  var queryParams = parse(getSearch().substring(1));
  return dispatcher.dispatch({
    actionType: NAVIGATE,
    data: {
      fragment: fragment,
      params: params,
      pathName: pathName,
      queryParams: queryParams
    }
  });
}