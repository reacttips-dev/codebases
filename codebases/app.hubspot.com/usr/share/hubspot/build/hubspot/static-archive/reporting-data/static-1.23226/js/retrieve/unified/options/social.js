'use es6';

import prefix from '../../../lib/prefix';
var translate = prefix('reporting-data.properties.unified.options');
export var channels = function channels() {
  return {
    FacebookPage: translate('social-channels.facebookpage'),
    Instagram: translate('social-channels.instagram'),
    Twitter: translate('social-channels.twitter'),
    LinkedInStatus: translate('social-channels.linkedinstatus'),
    LinkedInCompanyPage: translate('social-channels.linkedincompanypage'),
    YouTube: translate('social-channels.youtube')
  };
};
export var accounts = function accounts() {
  return {
    Facebook: translate('social-accounts.facebook'),
    Instagram: translate('social-accounts.instagram'),
    Twitter: translate('social-accounts.twitter'),
    LinkedIn: translate('social-accounts.linkedin'),
    YouTube: translate('social-accounts.youtube')
  };
};