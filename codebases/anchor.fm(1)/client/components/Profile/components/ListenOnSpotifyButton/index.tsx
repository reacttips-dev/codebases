import styled from '@emotion/styled';
import React from 'react';
import { MD_SCREEN_MAX } from '../../../../modules/Styleguide';
import { SpotifySquareLogoIcon } from '../../SpotifySquareLogoIcon';
import styles from '../../styles.sass';
import { ProfileButton } from '../ProfileButton';

type Props = {
  spotifyUrl: string;
  onPressListenOnSpotify: () => {};
};

export const ListenOnSpotifyButton = ({
  spotifyUrl,
  onPressListenOnSpotify,
}: Props) => {
  return (
    <ProfileButton
      kind="link"
      onClick={onPressListenOnSpotify}
      className={styles.listenOnSpotifyButton}
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      ariaLabel="Listen on Spotify"
    >
      <ButtonLabel>Listen on </ButtonLabel>
      <SpotifySquareLogoIcon />
    </ProfileButton>
  );
};

const ButtonLabel = styled.span`
  margin-right: 3px;
  white-space: nowrap;
  @media (max-width: ${MD_SCREEN_MAX}px) {
    display: none;
  }
`;
