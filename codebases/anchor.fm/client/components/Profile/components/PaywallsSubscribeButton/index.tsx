import React from 'react';
import { ProfileButton } from '../ProfileButton';
import styles from '../../styles.sass';
import { PaywallsLockIcon } from '../../../svgs/PaywallsLockIcon';
import { ProfilePaywallsModalTrigger } from '../../../ProfilePaywalls/components/ProfilePaywallsModalTrigger';
import { OpenModalLocation } from '../../../ProfilePaywalls/events';
import { SUBSCRIBE_BUTTON_ARIA_LABEL } from '../../../ProfilePaywalls/constants';

export function PaywallsSubscribeButton() {
  return (
    <div className={styles.headingButton}>
      <ProfilePaywallsModalTrigger
        locationForAnalytics={OpenModalLocation.SUBSCRIBE_BUTTON}
      >
        <ProfileButton
          ariaLabel={SUBSCRIBE_BUTTON_ARIA_LABEL}
          kind="button"
          icon={<PaywallsLockIcon width={14} />}
        >
          Subscribe
        </ProfileButton>
      </ProfilePaywallsModalTrigger>
    </div>
  );
}
