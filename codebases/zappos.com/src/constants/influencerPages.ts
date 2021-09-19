// Influencer page urls
export const INFLUENCER_LANDING_PAGE = '/influencer-home';
export const INFLUENCER_ENROLL_SUCCESS_PAGE = '/influencer/enroll/success';
export const INFLUENCER_ADD_PROFILE_CALLBACK_PAGE = '/influencer/callback';
export const INFLUENCER_ENROLL_PAGE = '/influencer/signup';
export const INFLUENCER_SIGNUP_PAGE = '/influencer/signup';
export const INFLUENCER_ELIGIBILITY_PAGE = '/influencer/eligibility';
export const INFLUENCER_HUB_PAGE = '/influencer/hub';
export const INFLUENCER_ENROLL_CALLBACK = '/influencer/enroll';

export const INFLUENCER_PAGES_DETAILS = {
  [INFLUENCER_LANDING_PAGE]: {
    pageName: 'influencer-home',
    isLandingPage: true,
    needsAuthentication: false
  },
  [INFLUENCER_SIGNUP_PAGE]: {
    pageName: 'influencer-enroll',
    isLandingPage: false,
    needsAuthentication: false
  },
  [INFLUENCER_ENROLL_SUCCESS_PAGE]: {
    pageName: 'influencer-enroll-success',
    isLandingPage: false,
    needsAuthentication: true
  },
  [INFLUENCER_ELIGIBILITY_PAGE]: {
    pageName: 'influencer-eligibility',
    isLandingPage: false,
    needsAuthentication: true
  }
};
