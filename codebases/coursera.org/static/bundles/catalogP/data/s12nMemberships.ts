import { memoizedCatalogData } from 'bundles/catalogP/api/api.promise';
import S12nMembership from 'bundles/catalogP/models/s12nMembership';
import catalogUrl from 'bundles/catalogP/lib/catalogUrl';
import memoize from 'js/lib/memoize';

const s12nMembershipData = function (options: $TSFixMe) {
  return memoizedCatalogData(catalogUrl.build(S12nMembership.prototype.resourceName, options));
};

export default s12nMembershipData;
export const memoizedS12nMembershipData = memoize(s12nMembershipData);
