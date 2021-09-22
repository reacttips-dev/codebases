import Uri from 'jsuri';
import { config } from 'bundles/phoenix/constants';
import requestCountry from 'js/lib/requestCountry';
import API from 'js/lib/api';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import prices from 'js/lib/prices';
import path from 'js/lib/path';
import memoize from 'js/lib/memoize';

import Q from 'q';

const maestroApi = API(config.url.api);

const specializationData = function (id: $TSFixMe, preview: $TSFixMe, options: $TSFixMe) {
  const requestCountryCode = requestCountry.get();
  const uri = new Uri()
    .setPath(path.join('specialization', preview ? 'preview_info' : 'info', id))
    .addQueryParam('currency', prices.getCurrencyFromCountry(requestCountryCode))
    .addQueryParam('origin', requestCountryCode)
    .toString();

  return Q(maestroApi.get(uri));
};
export default specializationData;
export const memoizedSpecializationData = memoize(specializationData);
