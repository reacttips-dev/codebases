import _ from 'underscore';

import user from 'js/lib/user';
import epic from 'bundles/epic/client';
import CourseRoles from 'bundles/common/constants/CourseRoles';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { legacyHydrate } from 'bundles/discussions/utils/hydrate';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

const SERIALIZED_PROPS: Array<keyof ClassmatesProfileStore$DehydratedState> = [
  'profiles',
  'learnerCount',
  'instructorIds',
  'staffSocialProfiles',
];

type Profile = {
  id: string;
  courseProgressPercentage: number;
  isCourseCompleted: boolean;
  'onDemandSocialProfiles.v1': any;
  postsCount: number;
  userId: number;
  votesReceivedCount: number;
};

type NormalizedProfile = {
  id: string;
  courseProgressPercentage: number;
  isCourseCompleted: boolean;
  'onDemandSocialProfiles.v1': any;
  postsCount: number;
  userId: number;
  votesReceivedCount: number;
  countryCode: number;

  courseRole: string;
  externalId: string;
  fullName: string;
  photoUrl: string;
};

type ClassmatesProfileStore$DehydratedState = {
  profiles: Array<Profile>;
  learnerCount: number;
  instructorIds: Array<string>;
  staffSocialProfiles: Array<any>;
};

const normalizeProfiles = (profiles: Array<Profile>): Array<NormalizedProfile> => {
  return profiles.map((profile) => {
    const profileWithExternalId = { ...profile, externalId: profile.id };
    return Object.assign({}, profileWithExternalId, profile['onDemandSocialProfiles.v1']);
  });
};

class ClassmatesProfileStore extends BaseStore {
  static storeName = 'ClassmatesProfileStore';

  profiles: Array<NormalizedProfile>;

  learnerCount: number;

  instructorIds: Array<string>;

  staffSocialProfiles: Array<any>;

  profilesRequested: Array<string>;

  emitChange!: () => void;

  static handlers = {
    LOAD_CLASSMATES_PROFILES: 'onLoadClassmatesProfiles',
    LOAD_LEARNER_COUNT: 'onLoadLearnerCount',
    LOAD_STAFF_SOCIAL_PROFILES: 'onLoadStaffSocialProfiles',
    LOAD_COURSE_MATERIALS: 'onLoadCourseMaterials',
    PROFILE_REQUESTED: 'onProfileRequested',
  };

  onLoadClassmatesProfiles(response: any) {
    const newProfiles = normalizeProfiles(legacyHydrate(response));

    const privacyList: Array<string> = epic.get('featureBlacklist', 'privacyUsers');
    const filteredProfiles = _(newProfiles).filter((profile) => !_(privacyList).contains(profile.id));

    this.profiles = _(filteredProfiles.concat(this.profiles)).uniq((profile) => profile.userId);
    this.emitChange();
  }

  onLoadLearnerCount(count: number) {
    this.learnerCount = count;
    this.emitChange();
  }

  onLoadStaffSocialProfiles(response: any) {
    this.staffSocialProfiles = response.elements;
    this.combineSocialProfilesAndInstructors();
    this.emitChange();
  }

  onLoadCourseMaterials({ courseMaterials }: { courseMaterials: any }) {
    const course = courseMaterials.get('course');
    this.instructorIds = course.get('instructors').map((instructor: $TSFixMe) => instructor.get('id'));

    this.combineSocialProfilesAndInstructors();
    this.emitChange();
  }

  onProfileRequested(externalId: string) {
    if (!this.profilesRequested.includes(externalId)) {
      this.profilesRequested.push(externalId);
    }

    this.emitChange();
  }

  constructor(dispatcher: any) {
    super(dispatcher);

    this.profiles = [];
    this.learnerCount = 0;
    this.instructorIds = [];
    this.staffSocialProfiles = [];
    this.profilesRequested = [];
  }

  dehydrate(): ClassmatesProfileStore$DehydratedState {
    return _(this).pick(...SERIALIZED_PROPS);
  }

  rehydrate(state: ClassmatesProfileStore$DehydratedState) {
    Object.assign(this, _(state).pick(...SERIALIZED_PROPS));
  }

  getStaffProfiles() {
    return this.staffSocialProfiles.slice();
  }

  get10Profiles(countryCode: number): Array<Profile> {
    return _(this.profiles)
      .chain()
      .filter((profile) => {
        // Filter out the user's own profile if they are logged in, since the intention is to fetch classmates.
        if (user.isAuthenticatedUser() && profile.userId === user.get().id) {
          return false;
        } else if (countryCode && profile.countryCode !== countryCode) {
          return false;
        } else {
          return true;
        }
      })
      .first(10)
      .value();
  }

  /*
   * Called whenever staff social profile or instructors are updated. Instructors could have a higher CourseRole than
   * instructor, such as UNIVERSITY_ADMIN. For the purposes of this store, we don't care about that information but
   * instead want to accurately tell whether a user is an instructor or not. Therefore overwite courseRole with
   * INSTRUCTOR when the user is in the course instructors object from the course API.
   */
  combineSocialProfilesAndInstructors() {
    this.staffSocialProfiles = this.staffSocialProfiles.map((staffSocialProfile) => {
      const isInstructor =
        staffSocialProfile.courseRole === CourseRoles.INSTRUCTOR ||
        _(this.instructorIds).contains(staffSocialProfile.userId + '');

      return Object.assign(staffSocialProfile, {
        courseRole: isInstructor ? CourseRoles.INSTRUCTOR : staffSocialProfile.courseRole,
      });
    });
  }
}

export default ClassmatesProfileStore;
