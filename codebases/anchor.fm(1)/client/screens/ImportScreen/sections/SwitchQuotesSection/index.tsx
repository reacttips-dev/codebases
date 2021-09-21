import styled from '@emotion/styled';
import React from 'react';
import { MarketingImage } from '../../../../components/MarketingPagesShared/MarketingImage';
import {
  DEFAULT_MOBILE_PADDING,
  BREAKPOINT_SMALL,
  DEFAULT_DESKTOP_PADDING,
  BREAKPOINT_MEDIUM,
  MarketingSection
} from '../../../../components/MarketingPagesShared/styles';

export function SwitchQuotesSection() {
  return (
    <SwitchPageQuotesContainer>
      <SwitchQuotesTitle>
        Discover what our creators love most about Anchor
      </SwitchQuotesTitle>
      <SwitchQuotesColumns>
        <SwitchQuote>
          <MarketingImage
            imagePath="switch/quotes/pretty-big-deal-cover"
            alt="Pretty Big Deal with Ashley Graham podcast cover"
            width={342}
            height={342}
          />
          <SwitchQuoteAuthor>Ashley Graham</SwitchQuoteAuthor>
          <SwitchQuotePodcast>Pretty Big Deal</SwitchQuotePodcast>
          <SwitchQuoteText>
            “The show has given me the opportunity to talk to the most
            incredible guests and share these real, candid conversations with
            our audience. I love how through the podcast, I’ve been able to
            learn something new and hear other perspectives.”
          </SwitchQuoteText>
        </SwitchQuote>
        <SwitchQuote>
          <MarketingImage
            imagePath="switch/quotes/optimum-living-daily-cover"
            alt="Optimum Living Daily with Justin Malik podcast cover"
            width={342}
            height={342}
          />
          <SwitchQuoteAuthor>Justin Malik</SwitchQuoteAuthor>
          <SwitchQuotePodcast>Optimum Living Daily</SwitchQuotePodcast>
          <SwitchQuoteText>
            “Anchor has given us the clearest view into our audience
            demographics through their analytics dashboard, including gender and
            age, which we haven't seen anywhere else. Anchor's analytics has
            completely changed how we shape our new episodes—we can cater to our
            audience better than ever before.”
          </SwitchQuoteText>
        </SwitchQuote>
        <SwitchQuote>
          <MarketingImage
            imagePath="switch/quotes/rumble-cover"
            alt="Rumble with Michael Moore podcast cover"
            width={342}
            height={342}
          />
          <SwitchQuoteAuthor>Michael Moore</SwitchQuoteAuthor>
          <SwitchQuotePodcast>Rumble</SwitchQuotePodcast>
          <SwitchQuoteText>
            “Anchor believes in the democratization of audio, pure and simple,
            and because of that, that’s why I use this platform... Now, more
            than ever, our voices need to be heard.”
          </SwitchQuoteText>
        </SwitchQuote>
      </SwitchQuotesColumns>
    </SwitchPageQuotesContainer>
  );
}

const SwitchPageQuotesContainer = styled(MarketingSection)`
  padding-bottom: ${DEFAULT_DESKTOP_PADDING}px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding-bottom: ${DEFAULT_MOBILE_PADDING}px;
  }
`;

const SwitchQuotesTitle = styled.h1`
  font-size: 6.4rem;
  font-weight: 800;
  line-height: 1.2;
  width: 90%;
  margin: 60px 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 4rem;
    width: auto;
  }
`;

const SwitchQuotesColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: ${DEFAULT_MOBILE_PADDING}px;
  color: white;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin: 0 -${DEFAULT_MOBILE_PADDING}px;
    grid-column-gap: 0;
    overflow: auto;
    scroll-snap-type: x mandatory;
    scroll-snap-align: center;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SwitchQuote = styled.blockquote`
  border: 0;
  padding: 0;
  font-size: 2.4rem;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    font-size: 2rem;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    scroll-snap-align: center;
    font-size: 1.8rem;
    width: 90vw;
    /**
     * This is a little tricky. Basically on mobile, we have a situation like
     * this:
     * +---------------------+        +----------------------+
     * |                     |        |                      |
     * +--+  +---------+  +--+        +----+  +-----------+  |
     * |  |  |         |  |  | scroll |    |  |           |  |
     * |  |  |         |  |  | +----> |    |  |           |  |
     * |  |  |         |  |  |        |    |  |           |  |
     * +--+  +---------+  +--+        +----+  +-----------+  |
     * |                     |        |                      |
     * +---------------------+        +----------------------+
     *
     * So we want some padding on the sides, but we also want the distance
     * between the cells to be correct. So, we add padding that will appear
     * correctly on the sides, and then shift the appropriate cells slightly to
     * make the space between the elements correct 
     */
    padding: 0 ${DEFAULT_MOBILE_PADDING}px;

    &:not(:first-of-type) {
      margin-left: -${DEFAULT_MOBILE_PADDING}px;
    }
  }
`;

const SwitchQuoteText = styled.p`
  color: white;
`;

const SwitchQuoteAuthor = styled.cite`
  display: block;
  font-style: normal;
  font-size: 85%;
  line-height: 1.4;
  margin-top: 40px;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    margin-top: 20px;
  }
`;

const SwitchQuotePodcast = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 32px;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    margin-bottom: 20px;
  }
`;
