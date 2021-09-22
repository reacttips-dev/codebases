import _ from 'lodash';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import { savingStates } from 'bundles/profile/constants/constants';

const SERIALIZED_PROPS = ['profile', 'savingStates', 'loaded'];

const normalizeProfile = (profile: $TSFixMe) => {
  profile.photoUrl = profile.photos.size120;
  return profile;
};

class ProfileStore extends BaseStore {
  static storeName = 'ProfileStore';

  static handlers = {
    INIT_PROFILE_STORE(response: $TSFixMe) {
      try {
        const profile = response.elements[0];
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
        this.profile = normalizeProfile(profile);
      } catch (e) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
        this.profile = {};
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'loaded' does not exist on type '{ INIT_P... Remove this comment to see the full error message
      this.loaded = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ IN... Remove this comment to see the full error message
      this.emitChange();
    },

    UPDATE_LOCATION_START(location: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'savingStates' does not exist on type '{ ... Remove this comment to see the full error message
      this.savingStates.location = savingStates.SAVING;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
      this.profile.location = location;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ IN... Remove this comment to see the full error message
      this.emitChange();
    },

    UPDATE_LOCATION_SUCCESS(response: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'savingStates' does not exist on type '{ ... Remove this comment to see the full error message
      this.savingStates.location = savingStates.SAVED;

      try {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
        this.profile.location = response.elements[0].location;
      } catch (e) {
        return;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ IN... Remove this comment to see the full error message
      this.emitChange();
    },

    RECEIVE_USER_PROFILE(response: $TSFixMe) {
      try {
        const profile = response.elements[0];
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
        this.profile = normalizeProfile(profile);
      } catch (e) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
        this.profile = {};
      }
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ IN... Remove this comment to see the full error message
      this.emitChange();
    },

    RECEIVE_SOCIAL_PROFILE(response: $TSFixMe) {
      try {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
        this.profile = Object.assign({}, this.profile, response.elements[0]);
      } catch (e) {
        return;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ IN... Remove this comment to see the full error message
      this.emitChange();
    },

    UPDATE_PROFILE_IMAGE_SUCCESS(photoData: $TSFixMe) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
      this.profile.photos = photoData;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type '{ INIT_... Remove this comment to see the full error message
      this.profile.photoUrl = photoData.size120;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'emitChange' does not exist on type '{ IN... Remove this comment to see the full error message
      this.emitChange();
    },
  };

  constructor(dispatcher: $TSFixMe) {
    super(dispatcher);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type 'Profile... Remove this comment to see the full error message
    this.profile = {
      location: {},
    };

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'savingStates' does not exist on type 'Pr... Remove this comment to see the full error message
    this.savingStates = {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'savingStates' does not exist on type 'Pr... Remove this comment to see the full error message
    this.savingStates.location = savingStates.UNCHANGED;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'loaded' does not exist on type 'ProfileS... Remove this comment to see the full error message
    this.loaded = false;
  }

  dehydrate() {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: $TSFixMe) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
  }

  getLocationSavedState() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'savingStates' does not exist on type 'Pr... Remove this comment to see the full error message
    return this.savingStates.location;
  }

  hasLoaded() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'loaded' does not exist on type 'ProfileS... Remove this comment to see the full error message
    return this.loaded;
  }

  getProfileImage() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type 'Profile... Remove this comment to see the full error message
    return this.profile.photos && (this.profile.photos.size120 || null);
  }
}

export default ProfileStore;
