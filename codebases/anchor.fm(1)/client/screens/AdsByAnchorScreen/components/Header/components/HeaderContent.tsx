import React from 'react';
import styled from '@emotion/styled';

import { Button } from 'client/shared/Button/NewButton';
import { SCREEN_BREAKPOINTS } from '../../../constants';
import { AdsByAnchorIcon } from '../../Icons';

const HeaderContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px 5% 0;
  width: 60%;

  svg {
    margin: 0 0 25px;
  }

  button {
    margin: 0 auto;
  }

  @media (max-width: ${SCREEN_BREAKPOINTS.SMALL_DESKTOP}px) {
    padding: 0;
    width: 90%;
  }
`;
const HiddenHeaderTitle = styled.h1`
  display: none;
`;
const HeaderSubtitle = styled.p`
  color: #ffffff;
  font-size: 2.5rem;
  letter-spacing: -0.01em;
  line-height: 3.5rem;
  margin: 0 0 30px;
  text-align: center;

  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 2.2rem;
    line-height: 2.8rem;
    margin: 0 0 25px;
  }
`;

export const HeaderContent = () => {
  return (
    <HeaderContentContainer>
      <HiddenHeaderTitle>Ads by Anchor</HiddenHeaderTitle>
      <AdsByAnchorIcon aria-hidden={true} />
      <HeaderSubtitle>
        The all-in-one, flexible podcast monetization platform made for
        everyone, powered by Spotify.
      </HeaderSubtitle>
      <Button color="yellow">Sign Up</Button>
    </HeaderContentContainer>
  );
};
