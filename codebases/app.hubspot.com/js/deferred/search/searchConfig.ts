import * as oldSearch from 'unified-navigation-ui/deferred/search/new';
import * as newSearch from 'unified-navigation-ui/deferred/search/newSearch/app';
export function setupSearch(_ref) {
  var scopes = _ref.scopes,
      gates = _ref.gates,
      userId = _ref.userId,
      userEmail = _ref.userEmail;
  return gates.includes('search:global-search-ui') ? newSearch.setupSearch() : oldSearch.setupSearch(scopes, gates, userId, userEmail);
}