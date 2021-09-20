import BasePageController from '../../../../../appsdk/pages/BasePageController';
 import { TEAM_FEATURE_OVERVIEW_KEY } from '../../FeatureOverview/Constants';
class HomepageController extends BasePageController {
  didCreate () {}

  didActivate ({ queryParams }) {
    this.showSignedOutState = pm.isScratchpad;
    if (this.showSignedOutState && window.SDK_PLATFORM === 'desktop') {
      this.hideHeader();
    }
    this.setPageMetaTags([]);
    this.setCanonicalPageTag(`${window.postman_explore_url}/`);
    this.setMetaImageToPage(
      'https://assets.getpostman.com/common-share/postman-platform-for-api-development-social-card.jpg'
    );

    // This is used to trigger the team feature overview modal
    this.teamFeatureOverview = queryParams[TEAM_FEATURE_OVERVIEW_KEY];
  }
}

export default HomepageController;
