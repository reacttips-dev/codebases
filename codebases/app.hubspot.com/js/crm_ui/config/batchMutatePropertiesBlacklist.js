'use es6';

var BLACKLISTED_PROPERTIES = {
  CONTACT: ['email', 'firstname', 'lastname', 'phone', 'mobilephone', 'linkedinbio', 'linkedinconnections', 'twitterbio', 'twitterprofilephoto', 'twitterhandle'],
  COMPANY: ['name', 'domain', 'website', 'facebook_company_page', 'facebookfans', 'googleplus_page', 'linkedinbio', 'linkedin_company_page', 'twitterbio', 'twitterhandle'],
  DEAL: ['dealname'],
  TASK: ['metadata.body', 'relatesTo', 'engagement.type']
};
export default BLACKLISTED_PROPERTIES;