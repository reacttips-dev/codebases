import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import SpecializationMembership from 'bundles/catalogP/models/specializationMembership';

const SpecializationMemberships = CatalogCollection.extend({
  model: SpecializationMembership,
  resourceName: 'specializationMemberships.v1',

  includes: {},

  filterWithSpecializationCertificates() {
    return new SpecializationMemberships(
      this.filter(function (specializationMembership: $TSFixMe) {
        return specializationMembership.hasSpecializationCertificate();
      })
    );
  },

  getByCertificateCode(code: $TSFixMe) {
    return this.find(function (membership: $TSFixMe) {
      return membership.getCertificateCode() === code;
    });
  },
});

export default SpecializationMemberships;
