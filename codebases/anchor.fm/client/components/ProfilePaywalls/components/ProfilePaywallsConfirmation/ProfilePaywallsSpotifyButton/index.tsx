import styled from '@emotion/styled';
import React from 'react';
import { Button } from '../../../../../shared/Button/NewButton';
import { SpotifyButtonIcon } from '../../../../Profile/SpotifyButtonIcon';

export const SPOTIFY_BUTTON_ARIA_LABEL = 'Button to authenticate with Spotify';
const SPOTIFY_BUTTON_LABEL = 'Listen on';

export const ProfilePaywallsSpotifyButton = ({
  href,
  onClick,
}: {
  href: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      kind="link"
      color="black"
      href={href}
      onClick={onClick}
      forceAnchorTag={true}
      ariaLabel={SPOTIFY_BUTTON_ARIA_LABEL}
    >
      <ButtonLabel>
        {SPOTIFY_BUTTON_LABEL}
        <ButtonIcon>
          <SpotifyButtonIcon fillColor="white" />
        </ButtonIcon>
      </ButtonLabel>
    </Button>
  );
};

const ButtonLabel = styled.div`
  white-space: nowrap;
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

const ButtonIcon = styled.div`
  margin-left: 8px;
  width: 70px;
  font-size: 0;
`;
