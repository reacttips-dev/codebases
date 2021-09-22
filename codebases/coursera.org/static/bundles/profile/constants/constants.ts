import _t from 'i18n!nls/profile';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { answers } from 'bundles/discussions/constants';

const exported = {
  discussionsActivityPaginationConfig: {
    limit: answers.limitPerPage,
    defaultSort: 'createdAtDesc',
  },

  savingStates: {
    UNCHANGED: 'UNCHANGED',
    UNSAVED_CHANGES: 'UNSAVED_CHANGES',
    SAVING: 'SAVING',
    SAVED: 'SAVED',
    ERROR: 'ERROR',
  },

  privacyStates: {
    NOT_SET: 'NOT_SET',
    PUBLIC: 'public', // lowercase because this is what the server returns
    PRIVATE: 'private',
  },

  Actions: {
    INIT_PROFILE_DATA: 'initProfileData',
    INIT_PROGRESS_DATA: 'initProgressData',
    INIT_DISCUSSIONS_STATS_DATA: 'initDiscussionsStatsData',
    INIT_USER_POSTS: 'initUserPosts',
    INIT_COURSE_ROLE: 'initCourseRole',
  },

  Sources: {
    SERVER: 'server',
    VIEW: 'view',
  },

  SocialSites: [
    {
      get name() {
        return _t('LinkedIn');
      },
      profileAttr: 'linkedin',
      // LinkedIn field contains the whole URL, without a prefix
      linkPrefix: '',
      iconId: 'linkedin',
    },
    {
      get name() {
        return _t('Facebook');
      },
      profileAttr: 'facebook',
      linkPrefix: 'https://facebook.com',
      iconId: 'facebook',
    },
    {
      get name() {
        return _t('GitHub');
      },
      profileAttr: 'github',
      linkPrefix: 'https://github.com',
      iconId: 'github',
    },
    {
      get name() {
        return _t('Google+');
      },
      profileAttr: 'gPlus',
      linkPrefix: 'https://plus.google.com',
      iconId: 'googleplus',
    },
    {
      get name() {
        return _t('Twitter');
      },
      profileAttr: 'twitter',
      linkPrefix: 'https://twitter.com',
      iconId: 'twitter',
    },
  ],

  profileApi: '/api/profiles.v1',
  externalPublicProfileApi: '/api/userExternalPublicProfiles.v1',
  defaultPhotoUrl: 'https://coursera-profile-photos.s3.amazonaws.com/18/44206023dd11e4a371d9d7bccf5822/avatar.png',
};

export default exported;

export const {
  discussionsActivityPaginationConfig,
  savingStates,
  privacyStates,
  Actions,
  Sources,
  SocialSites,
  profileApi,
  externalPublicProfileApi,
  defaultPhotoUrl,
} = exported;
