import React from 'react';
import { Hero, ValueProposition, GetStarted } from './components';
import { Footer } from '../../components/Footer';
import { PageContainer, ContentContainer, WaveBackground } from './styles';

export function WordpressScreen() {
  return (
    <PageContainer>
      <ContentContainer>
        <Hero />
        <WaveBackground>
          <GetStarted />
          <ValueProposition />
        </WaveBackground>
      </ContentContainer>
      <Footer />
    </PageContainer>
  );
}
