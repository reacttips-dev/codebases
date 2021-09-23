import styled from '@emotion/styled';
import React from 'react';
import { MarketingButton } from '../../../../../components/MarketingPagesShared/MarketingButton';
import {
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
} from '../../../../../components/MarketingPagesShared/styles';
import {
  HomeSection,
  HomeSectionTitle,
  HomeTextColumn,
} from '../../../styles';
import { PodcastBloomerIcon } from '../../icons/PodcastBloomerIcon';
import { PodcastBurntOutIcon } from '../../icons/PodcastBurntOutIcon';
import { PodcastLaneIcon } from '../../icons/PodcastLaneIcon';

export function HomeTitleSuggestions({ onClickCTA }: { onClickCTA?: () => void }) {
  return (
    <HomeSection>
      <HomeTextColumn>
        <HomeTitleSuggestionsHeadingContainer>
          <HomeTitleSuggestionsHeading>
            Speak to your heart’s content.
          </HomeTitleSuggestionsHeading>
          <MarketingButton kind="link" href="/signup" onClick={onClickCTA}>
            Make your own podcast
          </MarketingButton>
        </HomeTitleSuggestionsHeadingContainer>
        <HomeTitleSuggestionsIconGrid>
          <HomeTitleSuggestionsIcon>
            <PodcastBloomerIcon />
          </HomeTitleSuggestionsIcon>
          <HomeTitleSuggestionsIcon>
            <PodcastLaneIcon />
          </HomeTitleSuggestionsIcon>
          <HomeTitleSuggestionsIcon>
            <PodcastBurntOutIcon />
          </HomeTitleSuggestionsIcon>
        </HomeTitleSuggestionsIconGrid>
      </HomeTextColumn>
    </HomeSection>
  );
}

const HomeTitleSuggestionsHeading = styled(HomeSectionTitle)`
  font-weight: bold;
  margin: 0;
`;

const HomeTitleSuggestionsHeadingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-gap: 40px;
  justify-content: space-between;
  align-items: center;
  margin: 150px 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
    margin: 75px 0;
  }
`;

const HomeTitleSuggestionsIconGrid = styled.div`
  display: grid;
  grid-gap: 90px;
  grid-template-columns: repeat(3, 1fr);

  // If we break at small, the text becomes unreadable
  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    grid-gap: 60px;
    grid-template-columns: 1fr;
  }
`;

const HomeTitleSuggestionsIcon = styled.div`
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
`;
