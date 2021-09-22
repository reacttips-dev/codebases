import PropTypes from 'prop-types';
import React from 'react';
import { bannerCourseraLogoPath } from 'bundles/mobile/common/constants';
import MobilePromoRatings from 'bundles/mobile/components/MobilePromoRatings';
import TrackedButton from 'bundles/page/components/TrackedButton';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import config from 'js/app/config';
import path from 'js/lib/path';
import Icon from 'bundles/iconfont/Icon';
import _t from 'i18n!nls/mobile';

import 'css!bundles/mobile/components/__styles__/MobilePromoBannerBottom';

const APP_LOGO_SRC = path.join(config.url.assets, bannerCourseraLogoPath);

class MobilePromoBannerBottom extends React.Component {
  static propTypes = {
    appLink: PropTypes.string.isRequired,
    onClickThrough: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    userAgent: PropTypes.object.isRequired,
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'userAgent' does not exist on type 'Reado... Remove this comment to see the full error message
    const { userAgent, onClickThrough, onDismiss } = this.props;
    return (
      <div className="rc-MobilePromoBannerBottom">
        <TrackedButton trackingName="close" className="nostyle promo-dismiss-button" onClick={onDismiss}>
          <Icon name="close" />
        </TrackedButton>
        <TrackedA
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'appLink' does not exist on type 'Readonl... Remove this comment to see the full error message
          href={this.props.appLink}
          className="nostyle banner-button horizontal-box align-items-top"
          trackingName="open_app"
          onClick={onClickThrough}
        >
          <img className="app-logo" alt="Coursera app logo" src={APP_LOGO_SRC} />
          <div className="vertical-box app-info">
            <p className="app-name headline-text-1">
              {userAgent.isAndroid ? _t('Coursera for Android') : _t('Coursera for iOS')}
            </p>
            <p className="ratings-section caption-text">
              <MobilePromoRatings userAgent={userAgent} showReviewCount={true} />
            </p>
          </div>
          <div className="cta-box caption-text horizontal-box align-items-absolute-center">{_t('GET')}</div>
        </TrackedA>
      </div>
    );
  }
}

export default MobilePromoBannerBottom;
