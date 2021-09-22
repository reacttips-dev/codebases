import React from 'react';
import PropTypes from 'prop-types';

import SubscriptionVPropCDPFreeTrial from 'bundles/enroll/components/subscriptions/free-trialV2/SubscriptionVPropCDPFreeTrial';
import SubscriptionPropBulletPoints from 'bundles/enroll/components/subscriptions/free-trialV2/SubscriptionPropBulletPoints';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { freeTrial } from 'bundles/payments/common/constants';
import _t from 'i18n!nls/enroll';
import 'css!./__styles__/SubscriptionVPropFreeTrial';

type Props = {
  s12nId: string;
  courseId: string | null;
};

class SubscriptionVPropFreeTrial extends React.Component<Props> {
  static contextTypes = {
    enableIntegratedOnboarding: PropTypes.bool,
  };

  render() {
    const { s12nId, courseId } = this.props;
    const { enableIntegratedOnboarding } = this.context;

    const wrapperExpClassname = enableIntegratedOnboarding
      ? 'rc-SubscriptionVPropFreeTrialExp'
      : 'rc-SubscriptionVPropFreeTrial';
    const punchLineClassNames = enableIntegratedOnboarding ? 'punch-line-exp' : 'headline-5-text punch-line';
    return (
      <div className={wrapperExpClassname}>
        <p className={punchLineClassNames}>
          <FormattedMessage message={_t('{numDays}-day Free Trial')} numDays={freeTrial.numDays} />
        </p>

        {courseId && <SubscriptionVPropCDPFreeTrial s12nId={s12nId} courseId={courseId} />}

        <SubscriptionPropBulletPoints s12nId={s12nId} />
      </div>
    );
  }
}

export default SubscriptionVPropFreeTrial;
