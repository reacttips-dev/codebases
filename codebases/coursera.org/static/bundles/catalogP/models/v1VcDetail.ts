import moment from 'moment';
import CatalogModel from 'bundles/catalogP/models/catalogModel';

/**
 * @class v1VcDetail
 * @property {boolean} [vcRegistrationOpen] - Whether or not registration is still open.
 * @property {boolean} [eligibleForFlexJoin] - Whether or not flexjoin is available for this session.
 */
const v1VcDetail = CatalogModel.extend({
  fields: ['vcRegistrationOpen', 'eligibleForFlexJoin', 'vcRefundDeadline'],

  includes: {},

  resourceName: 'v1VcDetails.v1',

  getRefundDeadline() {
    const refundDeadline = this.get('vcRefundDeadline');
    if (this.get('vcRegistrationOpen') && refundDeadline) {
      return moment(refundDeadline).format('LL');
    }
    return null;
  },
});

export default v1VcDetail;
