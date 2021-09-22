// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/m... Remove this comment to see the full error message
import Specialization from 'js/models/specialization';
import { memoizedSpecializationData } from 'bundles/s12n-common/service/data/specialization';

export default function (id: $TSFixMe, options = {}) {
  options = Object.assign({ preview: false }, options); // eslint-disable-line

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'preview' does not exist on type '{}'.
  return memoizedSpecializationData(id, options.preview, options).then(function (data) {
    return new Specialization(Object.assign({ has_full_data: true }, data));
  });
}
