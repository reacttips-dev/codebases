import React from 'react';
import styled from '@emotion/styled';
import { PODCAST_AD_DEFINITIONS } from 'client/screens/AdsByAnchorScreen/constants';
import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';

const Section = styled.section`
  background: ${COLOR_GREEN};
  color: #ffffff;
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1440px;
  padding: 50px 5%;
`;

const Heading = styled.h2`
  margin: 0 0 50px;
  font-size: 3.6rem;
`;

const DefinitionList = styled.dl`
  max-width: 790px;
  width: 100%;
  font-size: 1.6rem;
`;

const DefinitionContainer = styled.div`
  margin-bottom: 30px;
  dt,
  dd {
    display: inline;
    line-height: 3rem;
  }
`;

export function Glossary() {
  return (
    <Section>
      <Container>
        <Heading>Podcast Ads Glossary:</Heading>
        <DefinitionList>
          {PODCAST_AD_DEFINITIONS.map(({ term, definition }) => {
            return (
              <DefinitionContainer key={term}>
                <dt>{term}</dt>
                <dd>
                  {` - `} {definition}
                </dd>
              </DefinitionContainer>
            );
          })}
        </DefinitionList>
      </Container>
    </Section>
  );
}
