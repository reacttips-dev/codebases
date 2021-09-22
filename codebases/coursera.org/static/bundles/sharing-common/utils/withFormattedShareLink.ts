import URI from 'jsuri';
import { withProps, compose } from 'recompose';

import connectToRouter from 'js/lib/connectToRouter';

import { generateJsUriObjCurrentPage } from 'bundles/sharing-common/utils/utils';

import { SocialButtonPropsToComponent } from 'bundles/sharing-common/types/sharingSharedTypes';

/* 
Handles generating a link to the page the learner wants to share with proper tracking parameters
before being passed to social media specific link generator. Adds this as targetShareLink to props. 
*/
const withFormattedShareLink = (socialSource: string) =>
  compose(
    connectToRouter((router) => ({ router })),
    withProps(
      ({
        router,
        shareLink,
        hashedUserId,
        utmContentParam,
        utmMediumParam,
        utmCampaignParam,
        utmProductParam,
        extraQueryParams,
      }: SocialButtonPropsToComponent) => {
        const pageShareUrl = shareLink ? new URI(shareLink) : generateJsUriObjCurrentPage(router);

        pageShareUrl.addQueryParam('utm_source', socialSource);

        if (utmMediumParam) {
          pageShareUrl.addQueryParam('utm_medium', utmMediumParam);
        }

        if (utmContentParam) {
          pageShareUrl.addQueryParam('utm_content', utmContentParam);
        }

        if (utmCampaignParam) {
          pageShareUrl.addQueryParam('utm_campaign', utmCampaignParam);
        }

        if (utmProductParam) {
          pageShareUrl.addQueryParam('utm_product', utmProductParam);
        }

        if (hashedUserId) {
          pageShareUrl.addQueryParam('utm_user', hashedUserId);
        }

        if (extraQueryParams) {
          const keys = Object.keys(extraQueryParams);

          keys.forEach((key) => {
            pageShareUrl.addQueryParam(key, extraQueryParams[key]);
          });
        }

        return {
          targetShareLink: pageShareUrl.toString(),
        };
      }
    )
  );

export default withFormattedShareLink;
