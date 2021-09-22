import catalogData from 'bundles/catalogP/api/api.promise';
import S12n from 'bundles/catalogP/models/s12n';
import catalogUrl from 'bundles/catalogP/lib/catalogUrl';

export default function (options: $TSFixMe) {
  return catalogData(catalogUrl.build(S12n.prototype.resourceName, options));
}
