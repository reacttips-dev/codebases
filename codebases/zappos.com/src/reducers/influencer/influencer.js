import {
  REQUEST_INFLUENCER_DETAILS,
  SET_INFLUENCER_APP_CONFIG,
  SET_INFLUENCER_DETAILS,
  SET_INFLUENCER_TOKEN,
  SET_IS_INFLUENCER_STATUS
} from 'constants/reduxActions';
import { InfluencerStatus } from 'types/influencer';

const initialState = {
  status: InfluencerStatus.UNKNOWN,
  socialMediaProfiles: {},
  name: '',
  isLoading: false,
  isInfluencer:false,
  influencerToken: ''
};

export default function influencer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_INFLUENCER_DETAILS:
      return { ...state, isLoading: true };
    case SET_INFLUENCER_APP_CONFIG:
      const { appConfig } = action;
      return { ...state, appConfig };
    case SET_IS_INFLUENCER_STATUS:
      const { status } = action;
      const isInfluencer = status === InfluencerStatus.ACTIVE;
      return { ...state, status, isLoading: false, isInfluencer };
    case SET_INFLUENCER_DETAILS:
      const { influencerDetails } = action;
      const socialMediaProfileMap = {};
      if (influencerDetails && influencerDetails.details) {
        influencerDetails.details.socialMediaProfiles.forEach(profile => {
          socialMediaProfileMap[profile.profileType] = profile;
        });
      }
      return {
        ...state,
        socialMediaProfiles: socialMediaProfileMap,
        name: influencerDetails.details.name,
        status: influencerDetails.details.status,
        isLoading:false
      };
    case SET_INFLUENCER_TOKEN:
      const { influencerToken } = action;
      return { ...state, influencerToken };
    default:
      return state;
  }
}
