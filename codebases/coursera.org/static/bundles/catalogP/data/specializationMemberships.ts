import { memoizedCatalogData } from 'bundles/catalogP/api/api.promise';
import SpecializationMemberships from 'bundles/catalogP/models/specializationMemberships';
import catalogUrl from 'bundles/catalogP/lib/catalogUrl';

export default function (options: $TSFixMe) {
  return memoizedCatalogData(catalogUrl.build(SpecializationMemberships.prototype.resourceName, options || {}));
}
