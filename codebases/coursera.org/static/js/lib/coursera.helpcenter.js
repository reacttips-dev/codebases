// TODO: Update this file to use static/bundles/common/utils/salesforceUrlBuilder.ts

export default {
  // note: we need to keep this as long as class.coursera.org/mooc is around
  /* jshint ignore:start */
  isNewHelpCenter() {
    if (typeof courseraEnableNewHelpCenter === 'undefined') {
      courseraEnableNewHelpCenter = false;
    }
    return courseraEnableNewHelpCenter;
  },

  /* jshint ignore:end */

  baseWithAuth: 'https://learner.coursera.help/hc', // for now, relying on Zendesk -> Salesforce redirect to detect auth and use SSO if appropriate, until the owning team has a chance to update this to SF URLs

  baseWithoutAuth: 'https://learner.coursera.help/hc',

  _linkWrapper(oldLink, newLink) {
    if (this.isNewHelpCenter()) {
      return this.baseWithAuth + newLink;
    }
    return oldLink;
  },

  _articleBaseUrl(isAuthenticated) {
    return (isAuthenticated ? this.baseWithAuth : this.baseWithoutAuth) + '/articles/';
  },
  _sectionBaseUrl(isAuthenticated) {
    return (isAuthenticated ? this.baseWithAuth : this.baseWithoutAuth) + '/sections/';
  },

  getHomeLink(oldLink) {
    return this._linkWrapper(oldLink, '/');
  },

  getNewHelpCenterHome(isAuthenticated) {
    if (isAuthenticated) {
      return this.baseWithAuth;
    } else {
      return this.baseWithoutAuth;
    }
  },

  getReporterLink(oldLink) {
    return this._linkWrapper(oldLink, '/');
  },

  getCantSignInLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '201531725-I-Can-t-Log-In';
  },

  getForumLink(oldLink) {
    return this._linkWrapper(oldLink, '/articles/208279996');
  },

  // remove and replace usages w/ getCodeOfConductLink when we remove support for courses w/o the new help center enabled
  getFlagLink(oldLink) {
    return this._linkWrapper(oldLink, '/articles/208280036');
  },

  getCodeOfConductLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '201532585-Code-of-Conduct';
  },

  getHumanGradingLink(oldLink) {
    return this._linkWrapper(oldLink, '/sections/201895903');
  },

  getMathAssignmentLink(oldLink) {
    return this.baseWithAuth + '/articles/208279916';
  },

  getRecommendedSoftwareDevicesLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '209818543?flash_digest=75f451e7220df572270d7836a0cde07b58c0fbc5';
  },

  getVideosLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '209818683?flash_digest=a29e7280f51e4f5140cc1de96b18d6131dfa9fce';
  },

  getTyposMistakesLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '201532365-Typos-or-Mistakes-in-a-Course';
  },

  getRefundsVouchersLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '208280266';
  },

  getTypingProblemsLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '201223679-Signature-Track-Typing-Problems';
  },

  getJoiningReqirementsLink(isAuthenticated) {
    return this._articleBaseUrl(isAuthenticated) + '201523165-Joining-Requirements';
  },

  getContactFormLink(isAuthenticated) {
    return (isAuthenticated ? this.baseWithAuth : this.baseWithoutAuth) + '/requests/new';
  },

  getOnDemandLink(isAuthenticated) {
    return this.getNewHelpCenterHome(isAuthenticated) + '/';
  },

  getPathwayEnrollmentRestrictedLink(isAuthenticated) {
    const articleBaseUrl = this._articleBaseUrl(isAuthenticated);
    return `${articleBaseUrl}208279756`;
  },

  getRequestRefundHelpLink(isAuthenticated) {
    const articleBaseUrl = this._articleBaseUrl(isAuthenticated);
    return `${articleBaseUrl}209819043-Request-a-refund`;
  },

  getEnterpriseHelpLink(isAuthenticated) {
    const articleBaseUrl = this._articleBaseUrl(isAuthenticated);
    return `${articleBaseUrl}115003774946`;
  },

  getGradingAccomplishmentsLink(isAuthenticated) {
    return (
      this._articleBaseUrl(isAuthenticated) +
      '115001243743-Check-peer-review-grades?flash_digest=c8de9073145870dcc799547a37e0c93e61496d1d'
    );
  },

  getAccountSetupLink(isAuthenticated) {
    return this._sectionBaseUrl(isAuthenticated) + '201906856';
  },
  getPaymentsSubscriptionsLink(isAuthenticated) {
    return this._sectionBaseUrl(isAuthenticated) + '201907016';
  },
  getHowToEnrollLink(isAuthenticated) {
    return this._sectionBaseUrl(isAuthenticated) + '201906926';
  },
};
