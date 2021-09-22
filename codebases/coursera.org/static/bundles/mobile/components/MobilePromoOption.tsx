import PropTypes from 'prop-types';
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import epic from 'bundles/epic/client';
import MobilePromoBannerBottom from 'bundles/mobile/components/MobilePromoBannerBottom';
import link from 'bundles/mobile/lib/link';
import Retracked from 'js/lib/retracked';
import {
  deferPromotion,
  isWhitelistedUrl,
  FORCE_DISMISS_MOBILE_PROMO_PARAM,
  FORCE_SHOW_MOBILE_PROMO_PARAM,
} from 'bundles/mobile/lib/eligibility';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import 'css!./__styles__/MobilePromoOption';

class MobilePromoOption extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    // from ApplicationStore
    userAgent: PropTypes.object,
    mobilePromoEligible: PropTypes.bool,
    requestCountryCode: PropTypes.string,
  };

  constructor(props: $TSFixMe, context: $TSFixMe) {
    super(props, context);

    const { router } = context;
    const forceHide =
      !router || (router.location.query && router.location.query[FORCE_DISMISS_MOBILE_PROMO_PARAM] === 'true');

    const forceShow =
      !router ||
      (props.userAgent &&
        (props.userAgent.isIOS || props.userAgent.isAndroid) &&
        router.location.query &&
        router.location.query[FORCE_SHOW_MOBILE_PROMO_PARAM] === 'true');

    this.state = {
      show:
        router && isWhitelistedUrl(router.location.pathname) && (props.mobilePromoEligible || forceShow) && !forceHide,
    };
  }

  handleClickThrough = () => {
    this.setState({ show: false });
    deferPromotion();
  };

  handleClose = () => {
    this.setState({ show: false });
    deferPromotion();
  };

  render() {
    return (
      <div className="rc-MobilePromoOption">
        <CSSTransitionGroup transitionEnterTimeout={0} transitionLeaveTimeout={350} transitionName="banner-tg">
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'show' does not exist on type 'Readonly<{... Remove this comment to see the full error message */}
          {this.state.show && (
            <MobilePromoBannerBottom
              appLink={link.getAppUrl(
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'userAgent' does not exist on type 'Reado... Remove this comment to see the full error message
                this.props.userAgent,
                this.context.router.location.pathname,
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'requestCountryCode' does not exist on ty... Remove this comment to see the full error message
                this.props.requestCountryCode
              )}
              onDismiss={this.handleClose}
              onClickThrough={this.handleClickThrough}
              {...this.props}
            />
          )}
        </CSSTransitionGroup>
      </div>
    );
  }
}

const MobilePromoOptionStoreConnector = connectToStores(MobilePromoOption, ['ApplicationStore'], (stores, props) => ({
  userAgent: stores.ApplicationStore.getUserAgent(),
  mobilePromoEligible: stores.ApplicationStore.getMobilePromoEligibility(),
  requestCountryCode: stores.ApplicationStore.getRequestCountryCode(),
}));

// @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type '{}'.
export default Retracked.createTrackedContainer(({ value }) => ({
  namespace: {
    app: 'mobile_web',
    page: 'promo',
  },
}))(MobilePromoOptionStoreConnector);
