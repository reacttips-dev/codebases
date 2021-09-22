import Q from 'q';
import URI from 'jsuri';
import _ from 'underscore';

import catalogApiFactory from 'bundles/catalogP/api/api';
import memoize from 'js/lib/memoize';

/**
 * @param  {String} path         Example: '/api/courses.v1?q=search&query=python'
 * @param  {Object} [apiConfig]  Used to extend the given API path
 * @param  {Object} [options]    {
 *   [concatenatePages]: {Boolean},
 * }
 * @return {Promise} API response
 */
const api = function (path: $TSFixMe, apiConfig?: $TSFixMe, options?: $TSFixMe) {
  const catalogApi = catalogApiFactory(apiConfig);

  return Q(catalogApi.get(path)).then((data) => {
    const concatenatePages = !_(data.paging).isEmpty() && options && options.concatenatePages;

    if (concatenatePages) {
      const pageSize = parseInt(data.paging.next, 10);
      const limitString = new URI(path).getQueryParamValue('limit');
      const limit = limitString ? parseInt(limitString, 10) : null;
      const total = limit ? Math.min(limit, data.paging.total) : data.paging.total;

      const startIndexes = [];
      for (let startIndex = 0; startIndex < total; startIndex += pageSize) {
        // @ts-ignore ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        startIndexes.push(startIndex);
      }

      return Q.all(
        startIndexes.map(function (start) {
          const currentPath = new URI(path).addQueryParam('start', start).toString();
          return Q(catalogApi.get(currentPath));
        })
      ).then((listOfData) => {
        const linkedKeys = _(listOfData)
          .chain()
          .pluck('linked')
          .map((linkedObject) => Object.keys(linkedObject))
          .flatten()
          .union()
          .uniq()
          .value();

        const linked = {};
        linkedKeys.forEach((linkedKey) => {
          // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          linked[linkedKey] = _(listOfData)
            .chain()
            .pluck('linked')
            .pluck(linkedKey)
            .flatten()
            .union()
            .uniq(false, (item) => item.id)
            .sortBy('id')
            .value();
        });

        const ret = {
          elements: _(listOfData).chain().pluck('elements').flatten().value(),
          paging: null,
          linked,
        };

        return ret;
      });
    } else {
      return data;
    }
  });
};

export default api;
export const memoizedCatalogData = memoize(api);
