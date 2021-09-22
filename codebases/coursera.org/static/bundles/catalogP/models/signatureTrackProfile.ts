import CatalogModel from 'bundles/catalogP/models/catalogModel';
import concatName from 'bundles/catalogP/lib/concatName';

/**
 * @class SignatureTrackProfile
 * @property {string} [firstName] - Learner's firstName
 * @property {string} [middleName] - Learner's middleName
 * @property {string} [lastName] - Learner's lastName
 */
const SignatureTrackProfile = CatalogModel.extend({
  resourceName: 'signatureTrackProfiles.v1',

  fields: ['firstName', 'middleName', 'lastName'],

  getFullName() {
    return concatName({
      first: this.get('firstName'),
      middle: this.get('middleName'),
      last: this.get('lastName'),
    });
  },
});

export default SignatureTrackProfile;
