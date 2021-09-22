import { SocialProfilesQuery } from './__types__';

const SocialProfilesAPI = {
  api: 'onDemandSocialProfiles.v1',
  params: [],
  fields: ['userId', 'externalUserId', 'fullName', 'photoUrl', 'courseRole'],
  toQuery: () => `${SocialProfilesAPI.api}(${SocialProfilesAPI.fields.join('%2C')})`,
} as SocialProfilesQuery;

export default SocialProfilesAPI;
