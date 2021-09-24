import styled from '@emotion/styled';
import React from 'react';
import { LinkText } from '../../../../shared/Link';
import {
  COLOR_MUTED_TEXT,
  CONSUMER_BETA_PROGRAM_RULES_URL,
} from '../../../PaywallsShared/constants';

export const ProfilePaywallsError = ({
  text,
  showTermsLink = false,
}: {
  text: string;
  showTermsLink?: boolean;
}) => {
  return (
    <ProfilePaywallsErrorContainer>
      {text}
      {showTermsLink && (
        <TermsContainer>
          Visit{' '}
          <LinkText
            color="gray"
            to={CONSUMER_BETA_PROGRAM_RULES_URL}
            target="_blank"
            isInline
          >
            Subscriber Terms
          </LinkText>{' '}
          for more information.
        </TermsContainer>
      )}
    </ProfilePaywallsErrorContainer>
  );
};

const ProfilePaywallsErrorContainer = styled.div`
  color: ${COLOR_MUTED_TEXT};
  font-size: 1.6rem;
  line-height: 1.4;

  a {
    color: inherit;
  }
`;

const TermsContainer = styled.div`
  margin-top: 14px;
`;
