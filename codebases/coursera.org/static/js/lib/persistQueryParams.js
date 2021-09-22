import _ from 'underscore';
import store from 'js/lib/coursera.store';
import URI from 'jsuri';

/**
 * Persist a specified list of query params in a given url using local storage
 * Note: Values will only be persisted if the query parameter exists in the url
 * @param  {String} url         Any url
 * @param  {Array} queryParams  a list of query parameters to persist
 * @return {Object}             Hash containing key value pairs persisted
 */
export default function (url, queryParams) {
  const urlObj = new URI(url);
  const persistedValuesHash = _(queryParams).reduce(function (memo, queryParam) {
    const value = urlObj.getQueryParamValue(queryParam);
    if (value !== undefined) {
      memo[queryParam] = value;
      store.setUnserialized(queryParam, value);
    }
    return memo;
  }, {});

  return persistedValuesHash;
}
