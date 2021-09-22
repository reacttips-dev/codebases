import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import SignatureTrackProfile from 'bundles/catalogP/models/signatureTrackProfile';

const SignatureTrackProfiles = CatalogCollection.extend({
  model: SignatureTrackProfile,
  resourceName: 'signatureTrackProfiles.v1',
});

export default SignatureTrackProfiles;
