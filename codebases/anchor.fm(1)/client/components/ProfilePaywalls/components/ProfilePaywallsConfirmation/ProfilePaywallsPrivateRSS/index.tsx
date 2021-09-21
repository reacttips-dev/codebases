import styled from '@emotion/styled';
import React from 'react';
import { LinkText } from '../../../../../shared/Link';
import { CopyTextInput } from '../../../../CopyTextInput';
import {
  COLOR_MUTED_BOLD_TEXT,
  COLOR_MUTED_TEXT,
  PRIVATE_RSS_HELP_URL,
} from '../../../../PaywallsShared/constants';

export const ProfilePaywallsPrivateRSS = ({
  rssUrl,
  onCopyClick,
}: {
  rssUrl: string;
  onCopyClick?: () => void;
}) => {
  return (
    <ProfilePaywallsPrivateRSSContainer>
      <Header>Private RSS Link</Header>
      <CopyTextInput text={rssUrl} onClick={onCopyClick} />
      <Instructions>
        Or paste this link into any podcast app.{' '}
        <LearnMoreLink>
          <LinkText color="gray" to={PRIVATE_RSS_HELP_URL} target="_blank">
            Learn more
          </LinkText>
        </LearnMoreLink>
      </Instructions>
    </ProfilePaywallsPrivateRSSContainer>
  );
};

const ProfilePaywallsPrivateRSSContainer = styled.div`
  font-size: 1.4rem;
`;

const Header = styled.h4`
  font-weight: bold;
  font-size: 1.4rem;
  margin: 0 0 10px 0;
  color: ${COLOR_MUTED_BOLD_TEXT};
`;

const Instructions = styled.div`
  color: ${COLOR_MUTED_TEXT};
  margin-top: 8px;
`;

const LearnMoreLink = styled.span`
  display: inline-block;
`;
