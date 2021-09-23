/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

import Heading from '../../shared/Heading';
import Text from '../../shared/Text';
import { PodcastImage, SwitchToAnchor } from './styles';

type Props = {
  imageSrc: string;
  authorName: string;
};

export const SwitchToAnchorHero = ({ imageSrc, authorName }: Props) => (
  <SwitchToAnchor>
    <Heading size="md" color="#5000b9" align="center" isBold={true}>
      Switch your podcast to Anchor
    </Heading>
    <div
      css={css`
        margin: 20px 0 40px;
      `}
    >
      <Text align="center" size="lg">
        Free hosting, automatic distribution, easy monetization.
      </Text>
    </div>
    <PodcastImage src={imageSrc} />
    <Text align="center" size="md" isBold={true}>
      by {authorName}
    </Text>
  </SwitchToAnchor>
);
