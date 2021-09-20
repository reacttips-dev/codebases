import { observable, action } from 'mobx';

/**
 * @typedef {Object} UserDetails
 * @property {string} userId
 * @property {string} teamId
 * @property {string} teamName
 * @property {array} organizations
 * @property {string} http_gateway_url
 * @property {string} access_token
 * @property {boolean} isLoggedIn
 */

class CurrentUserDetailsService {
  @observable userId = '0';
  @observable teamId = '0';
  @observable teamName = null;
  @observable organizations = [];
  @observable http_gateway_url = null;
  @observable access_token = null;
  @observable isLoggedIn = false;

  constructor () {
  }

  @action
  updateUserId (userId) {
    this.userId = userId || '0';
  }

  @action
  updateTeamId (teamId) {
    this.teamId = teamId || '0';
  }

  @action
  updateTeamName (teamName) {
    this.teamName = teamName || null;
  }

  @action
  updateOrganizations (organizations) {
    this.organizations = organizations || [];
  }

  @action
  updateHTTPGatewayURL (http_gateway_url) {
    this.http_gateway_url = http_gateway_url || null;
  }

  @action
  updateAccessToken (access_token) {
    this.access_token = access_token || null;
  }

  @action
  updateIsLoggedIn (isLoggedIn) {
    this.isLoggedIn = isLoggedIn || false;
  }

  /**
   * Bootstrap the current user details
   * @param {function} cb
   */
  init = async (cb) => {
    try {
      if (window.SDK_PLATFORM === 'browser') {
        this.updateUserId(window.USER_ID);
        this.updateTeamId(window.TEAM_ID);
        this.updateHTTPGatewayURL(window.HTTP_GATEWAY_URL);
        this.updateAccessToken(null);
        this.updateIsLoggedIn(window.USER_ID !== '0');
      }
      else {
        let user = await pm.models.user.findOne({ appUserType: 'currentUser' });
        if (user) {
          this.updateUserId(user.id);
          this.updateTeamId(_.get(user, 'organizations.0.id'));
          this.updateTeamName(_.get(user, 'organizations.0.name'));
          this.updateOrganizations(_.get(user, 'organizations'));
          this.updateHTTPGatewayURL(user.http_gateway_url);
          this.updateAccessToken(_.get(user, 'auth.access_token'));
          this.updateIsLoggedIn((user.id !== '0'));
        }
      }
      window.addEventListener('updateOrganizationData', (event) => {

        let organizations = event && event.organizations,
          teamName = event && event.organizations && event.organizations.length && event.organizations[0] ?
          event.organizations[0].name : null;

        this.updateTeamName(teamName);
        this.updateOrganizations(organizations);
      });
    }
    finally {
      cb && cb();
    }
  }

  /**
   * Returns the details of the current user <>
   * NOTE: To be used only by the Client Foundation Team.
   *
   * @returns {UserDetails} UserDetails
   * @private
   */
  getCurrentUserDetails = () => {
    return {
      userId: this.userId,
      teamId: this.teamId,
      teamName: this.teamName,
      organizations: this.organizations,
      http_gateway_url: this.http_gateway_url,
      access_token: this.access_token,
      isLoggedIn: this.isLoggedIn
    };
  }
}

let userDetails = new CurrentUserDetailsService();
export default userDetails;
