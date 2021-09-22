import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import S12nMembership from 'bundles/catalogP/models/s12nMembership';

const S12nMemberships = CatalogCollection.extend({
  model: S12nMembership,
  resourceName: 'onDemandSpecializationMemberships.v1',

  includes: {},

  filterWithS12nCertificates() {
    return new S12nMemberships(
      this.filter(function (s12nMembership: $TSFixMe) {
        return s12nMembership.hasS12nCertificate();
      })
    );
  },

  getByCertificateCode(code: $TSFixMe) {
    return this.find(function (membership: $TSFixMe) {
      return membership.getCertificateCode() === code;
    });
  },
});

export default S12nMemberships;
