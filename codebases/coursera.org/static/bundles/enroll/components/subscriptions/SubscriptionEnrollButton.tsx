import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TrackedButton from 'bundles/page/components/TrackedButton';

import { ArrowNextIcon } from '@coursera/cds-icons';
import { Button } from '@coursera/cds-core';
import Icon from 'bundles/iconfont/Icon';

import { isS12nEligibleForCourseraPlusUpgrade } from 'bundles/coursera-plus/utils/courseraPlusUpgradeUtils';
import { enrollInSubscription } from 'bundles/enroll/actions/EnrollActions';
import { getTrackingData } from 'bundles/promotions/utils/productDiscountPromoUtils';
import type { ApiError } from 'bundles/enroll/utils/errorUtils';

import _t from 'i18n!nls/enroll';

import 'css!./__styles__/SubscriptionEnrollButton';

type Props = {
  s12nMonthlySkuId: string;
  s12nId?: string;
  isFreeTrial?: boolean;
  courseId?: string | null;
  promoCode?: string | null;
  onError: (error: ApiError) => void;
};

type State = {
  enrolling: boolean;
};

class SubscriptionEnrollButton extends React.Component<Props, State> {
  state = {
    enrolling: false,
  };

  static contextTypes = {
    // Context provided in CDPPage and SDPPage
    enableIntegratedOnboarding: PropTypes.bool,
  };

  handleError = (error: ApiError) => {
    const { onError } = this.props;

    this.setState(() => ({ enrolling: false }));
    onError(error);
  };

  onClick = async () => {
    const { s12nId, s12nMonthlySkuId, courseId, promoCode, isFreeTrial } = this.props;
    const { enableIntegratedOnboarding } = this.context;
    this.setState(() => ({ enrolling: true }));

    // Skip the s12n welcome email if user can enroll in free trial, user is in Plus upsell epic,
    // and the s12n is eligible for the Plus upgrade
    let skipWelcomeEmail = false;
    if (s12nId && isFreeTrial) {
      skipWelcomeEmail = await isS12nEligibleForCourseraPlusUpgrade(s12nId);
    }

    enrollInSubscription({
      s12nSubProductId: s12nMonthlySkuId,
      courseId,
      skipWelcomeEmail,
      promoCode,
      onFail: this.handleError,
      // We add skipOnboardingModal to the query params, so that when the user is finished with the checkout page
      // the logic in <PaymentConfirmDetail> kicks in to avoid adding skipOnboardingModal to the url
      additionalParams: enableIntegratedOnboarding ? { skipOnboardingModal: 'skipAndRedirect' } : undefined,
    });
  };

  renderButtonContent = () => {
    const { isFreeTrial } = this.props;
    const { enrolling } = this.state;

    if (enrolling) {
      // return
      return '';
    } else {
      return isFreeTrial ? _t('Start Free Trial') : _t('Subscribe');
    }
  };

  render() {
    const { enrolling } = this.state;
    const { isFreeTrial } = this.props;
    const { enableIntegratedOnboarding } = this.context;
    const trackingName = isFreeTrial ? 'free_trial_start_button' : 'enroll_subscribe_monthly';

    const buttonClassName = classNames({ primary: !enableIntegratedOnboarding }, 'subscribe-button', {
      cozy: !enableIntegratedOnboarding,
    });
    const wrapperClassnames = classNames(
      { 'rc-SubscriptionEnrollButton': !enableIntegratedOnboarding },
      { 'rc-SubscriptionEnrollButtonExp': enableIntegratedOnboarding }
    );

    let buttonIcon;
    if (enrolling) {
      buttonIcon = <Icon name="spinner" spin />;
    } else if (enableIntegratedOnboarding) {
      buttonIcon = <ArrowNextIcon className="arrow-icon" />;
    }

    return (
      <div className={wrapperClassnames}>
        <Button
          component={TrackedButton}
          trackingName={trackingName}
          data={getTrackingData()}
          className={buttonClassName}
          onClick={this.onClick}
          disabled={enrolling}
          withVisibilityTracking={false}
          requireFullyVisible={false}
          icon={buttonIcon}
        >
          {this.renderButtonContent()}
        </Button>
      </div>
    );
  }
}

export default SubscriptionEnrollButton;
