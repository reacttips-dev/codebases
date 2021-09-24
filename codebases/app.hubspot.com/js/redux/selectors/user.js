'use es6';

import { createSelector } from 'reselect';
import { SCOPES } from '../../lib/constants';
import enviro from 'enviro';
import { createTruthySelector } from 'truthy-selector';
import { getInitialQuery } from './initialQuery';
import PortalIdParser from 'PortalIdParser';
var BIGLYTICS_PORTAL_IDS = enviro.isQa() ? [100541125] : [1976760, 4572628];
export var getUser = function getUser(state) {
  return state.user;
};
export var getUserId = createTruthySelector([getUser], function (user) {
  return user.user_id;
});
export var getScopes = createTruthySelector([getUser], function (user) {
  return user.scopes;
});
export var getUserIsPublisher = createTruthySelector([getScopes], function (userScopes) {
  var expectedScopes = [SCOPES.socialOwnedAccountsPublish, SCOPES.socialSharedAccountsPublish, SCOPES.socialAllAccountsPublish];
  return expectedScopes.some(function (es) {
    return userScopes.includes(es);
  });
});
export var getUserCanConfigureGlobalSettings = getUserIsPublisher;
export var getCampaignsEnabled = createTruthySelector([getScopes], function (scopes) {
  return scopes.includes(SCOPES.campaignsAccess);
});
export var getCampaignsWriteEnabled = createTruthySelector([getScopes], function (scopes) {
  return scopes.includes(SCOPES.campaignsWrite);
});
export var getHasBlogPostsReadAccess = createTruthySelector([getScopes], function (scopes) {
  return scopes.includes(SCOPES.blogPostRead);
});
export var getHasLandingPagesAccess = createTruthySelector([getScopes], function (scopes) {
  return scopes.includes(SCOPES.landingPagesAccess);
});
export var getHasAdsReadAccess = createTruthySelector([getScopes], function (scopes) {
  return scopes.includes(SCOPES.adsRead) || BIGLYTICS_PORTAL_IDS.includes(PortalIdParser.get());
});
export var getAdCreationEnabled = createTruthySelector([getScopes], function (scopes) {
  return scopes.includes(SCOPES.adsWrite) && scopes.includes(SCOPES.adsRoiReporting) || BIGLYTICS_PORTAL_IDS.includes(PortalIdParser.get());
});
export var getUserScopes = createTruthySelector([getUser], function (user) {
  return user.scopes;
});
export var getUserIsJita = createTruthySelector([getUserScopes], function (userScopes) {
  return userScopes.includes(SCOPES.jitaUser);
});
export var getUserIsHubspotter = createTruthySelector([getUser], function (user) {
  return user.email.endsWith('@hubspot.com');
});
export var getUserRoleName = createSelector([getUserScopes], function (scopes) {
  if (scopes.includes(SCOPES.jitaUser)) {
    return 'jita';
  }

  if (scopes.includes(SCOPES.socialAllAccountsConfigure)) {
    return 'super admin';
  } else if (scopes.includes(SCOPES.socialSharedAccountsPublish)) {
    return 'shared publisher';
  } else if (scopes.includes(SCOPES.socialOwnedAccountsPublish)) {
    return 'personal publisher';
  } else if (scopes.includes(SCOPES.socialDraftOnlyUserAccess)) {
    return 'draft only';
  }

  return '';
});
export var getUserIsDraftOnly = function getUserIsDraftOnly(state) {
  var roleName = getUserRoleName(state);
  return roleName === 'draft only';
};
export var getHasFileManagerWriteAccess = createSelector([getUser], function (user) {
  return user.scopes.includes(SCOPES.fileManagerWrite);
});
export var getHasYoutubeReportsAccess = createSelector([getInitialQuery, getUser], function (initialQuery, user) {
  if (initialQuery && initialQuery.secretBeta) {
    return true;
  }

  return user.scopes.includes(SCOPES.youtubeAccess);
});
export var getUserIsAdmin = createSelector([getUserScopes], function (scopes) {
  return scopes.includes(SCOPES.socialAllAccountsConfigure);
});
export var getUserCanConfigureSharedAccounts = createSelector([getUserScopes], function (scopes) {
  return scopes.includes(SCOPES.socialSharedAccountsConfigure);
});
export var getUserHasAllAccountsRead = createSelector([getUserScopes], function (scopes) {
  return scopes.includes(SCOPES.socialAllAccountsRead);
});
export var getUserCanConnectAccounts = createSelector([getUserScopes], function (userScopes) {
  return userScopes.includes(SCOPES.socialAccountsConnect);
});