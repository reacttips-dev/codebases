import { memoizedCatalogData } from 'bundles/catalogP/api/api.promise';
import Specializations from 'bundles/catalogP/models/specializations';
import catalogUrl from 'bundles/catalogP/lib/catalogUrl';
import memoize from 'js/lib/memoize';

const specializationsData = function (options: $TSFixMe) {
  return memoizedCatalogData(catalogUrl.build(Specializations.prototype.resourceName, options || {}));
};

export default specializationsData;
export const memoizedSpecializationsData = memoize(specializationsData);
