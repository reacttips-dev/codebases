import NaptimeResource from './NaptimeResource';

class BasicProfile extends NaptimeResource {
  static RESOURCE_NAME = 'basicProfiles.v1';

  static me({ fields = [] } = {}) {
    const fieldsIsMissingIsPoweruser = fields.includes('isSuperuser') && !fields.includes('isPoweruser');
    return this.finder(
      'me',
      {
        params: {},
        fields: fieldsIsMissingIsPoweruser ? [...fields, 'isPoweruser'] : fields,
      },
      (profiles) => {
        const profile = profiles[0];
        if (profile && 'isSuperuser' in profile) {
          profile.isSuperuser = profile.isSuperuser || profile.isPoweruser;
        }
        return profile;
      }
    );
  }
}

export default BasicProfile;
