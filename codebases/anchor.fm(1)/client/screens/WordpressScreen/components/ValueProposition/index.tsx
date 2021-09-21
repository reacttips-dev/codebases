import React from 'react';
import styled from '@emotion/styled';
import { MarketingSection } from '../../../../components/MarketingPagesShared/styles';
import {
  Title,
  List,
  Header,
  SecondaryText,
} from '../../../../components/MarketingPagesShared/ThreeColumnList';
import { SwitchVideoSection } from '../../../ImportScreen/sections/SwitchVideoSection';

export function ValueProposition() {
  return (
    <Container>
      <MarketingSection>
        <ValuePropositionTitle>
          Powering the most podcasts worldwide. Empowering podcasters.
        </ValuePropositionTitle>
      </MarketingSection>
      <SwitchVideoSection
        hideLearnMore={true}
        isFullWidth={true}
        marginBottom={[64, 50]}
        youTubeVideoId="SJCVrqqqROw"
        placeholderImagePath="wordpress/video-placeholder"
        placeholderImageAltText="A dimmed video thumbnail for the video: Anchor x WordPress.com: Turn your blog into a podcast"
        videoTitle="Anchor x WordPress.com: Turn your blog into a podcast | Go beyond screens"
      />
      <MarketingSection>
        <List>
          <li>
            <Header>Grow your audience</Header>
            <SecondaryText>
              Introduce your work and brand to new listeners, and bring your
              existing readers.
            </SecondaryText>
          </li>
          <li>
            <Header>Seamless process</Header>
            <SecondaryText>
              Turning your blog into a podcast is easy—you’ve already done the
              hard part.
            </SecondaryText>
          </li>
          <li>
            <Header>Help your content resonate</Header>
            <SecondaryText>
              Deepen audience engagement with a new way to express your ideas.
            </SecondaryText>
          </li>
          <li>
            <Header>New revenue stream</Header>
            <SecondaryText>
              A different, growing medium means more opportunities to get paid
              for your work.
            </SecondaryText>
          </li>
        </List>
      </MarketingSection>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 184px;
`;

const ValuePropositionTitle = styled(Title)`
  margin-top: 0;
  margin-bottom: 64px;
`;
