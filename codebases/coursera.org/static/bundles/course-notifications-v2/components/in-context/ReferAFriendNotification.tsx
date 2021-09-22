import * as React from 'react';
import PropTypes from 'prop-types';

import initBem from 'js/lib/bem';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import onDemandTutorialViewsApi from 'bundles/ondemand/utils/onDemandTutorialViewsApi';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import InContextNotification from 'bundles/course-notifications-v2/components/in-context/InContextNotification';
import _t from 'i18n!nls/course-notifications-v2';

import { REFER_A_FRIEND_PAGE_URL, REFER_A_FRIEND_TERMS_LINK } from 'bundles/referral/constants';
import { enableNavInCourseHomeCtas } from 'bundles/referral/utils/utils';

import 'css!bundles/course-notifications-v2/components/in-context/__styles__/ReferAFriendNotification';

const bem = initBem('ReferAFriendNotification');

const REFERRAL_NOTIFICATION_KEY = 'referralMessage';

type Props = {};

type State = {
  isDismissed: boolean;
};

class ReferAFriendNotification extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state: State = {
    isDismissed: true,
  };

  componentDidMount() {
    const {
      router: {
        params: { courseSlug },
      },
    } = this.context;

    onDemandTutorialViewsApi.hasKey(`${REFERRAL_NOTIFICATION_KEY}.${courseSlug}`).then((isDismissed: $TSFixMe) => {
      this.setState(() => ({ isDismissed }));
    });
  }

  handleDismiss = () => {
    const {
      router: {
        params: { courseSlug },
      },
    } = this.context;

    onDemandTutorialViewsApi.storeKey(`${REFERRAL_NOTIFICATION_KEY}.${courseSlug}`).then(() => {
      this.setState(() => ({
        isDismissed: true,
      }));
    });
  };

  renderMessage = () => {
    return (
      <FormattedHTMLMessage
        message={_t(
          'Get <strong>50% off</strong> when you invite a friend to learn on Coursera. <a class="terms-link" target="_blank" rel="noopener noreferrer" href="{termsLink}">Terms and conditions</a><br /><a target="_blank" rel="noopener noreferrer" href="{referralLink}">Learn more</a>'
        )}
        referralLink={REFER_A_FRIEND_PAGE_URL}
        termsLink={REFER_A_FRIEND_TERMS_LINK}
      />
    );
  };

  render() {
    const { isDismissed } = this.state;

    if (isDismissed || enableNavInCourseHomeCtas() !== true) {
      return null;
    }

    return (
      <TrackedDiv
        className={bem()}
        trackingName="referral_in_course_banner"
        withVisibilityTracking={true}
        trackClicks={false}
      >
        <InContextNotification
          trackingName="refer_a_friend_notification"
          type="info"
          message={this.renderMessage()}
          isDismissible
          onDismiss={this.handleDismiss}
        />
      </TrackedDiv>
    );
  }
}

export default ReferAFriendNotification;
