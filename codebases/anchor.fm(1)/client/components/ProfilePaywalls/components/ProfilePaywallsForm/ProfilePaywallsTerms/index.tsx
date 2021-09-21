import React from 'react';
import { LinkText } from '../../../../../shared/Link';
import {
  CONSUMER_BETA_PROGRAM_RULES_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
} from '../../../../PaywallsShared/constants';
import { PaywallsTermsOfServiceContainer } from '../../../../PaywallsShared/styles';

const LINK_COLOR = 'gray';

export const ProfilePaywallsTerms = () => {
  return (
    <PaywallsTermsOfServiceContainer>
      By subscribing, you agree to the{' '}
      <LinkText
        color={LINK_COLOR}
        to={TERMS_OF_SERVICE_URL}
        target="_blank"
        isInline
      >
        Terms of Service
      </LinkText>{' '}
      and{' '}
      <LinkText
        color={LINK_COLOR}
        to={CONSUMER_BETA_PROGRAM_RULES_URL}
        target="_blank"
        isInline
      >
        Subscriber Terms
      </LinkText>
      . For more information on how we process your personal data, please see{' '}
      <LinkText
        color={LINK_COLOR}
        to={PRIVACY_POLICY_URL}
        target="_blank"
        isInline
      >
        Anchor’s Privacy Policy
      </LinkText>
      .
    </PaywallsTermsOfServiceContainer>
  );
};
