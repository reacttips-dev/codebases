import React from 'react';
import glamorous from 'glamorous';
import {Spinner} from '../../../tool-profile/components/shared/styles';
import Circular, {LARGE} from '../../../../shared/library/indicators/indeterminate/circular';
import AlternativesCards from '../../../../shared/library/cards/alternatives/alternatives-card-lite';
import {Query} from 'react-apollo';
import TrendingToolAlternativeIcon from '../../../../shared/library/icons/trending-tool-alternatives.svg';
import {ALABASTER} from '../../../../shared/style/colors';
import {PAGE_WIDTH} from '../../../../shared/style/dimensions';
import {alternativeTools} from '../../../../data/home/queries';
import {withAnalyticsPayload} from '../../../../shared/enhancers/analytics-enhancer';

const Container = glamorous.div({
  background: ALABASTER,
  padding: '25px 0 0 0'
});

const ContainerInner = glamorous.div({
  maxWidth: PAGE_WIDTH,
  margin: '0 auto'
});

const Title = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 30
});

const StyledTrendingToolAlternativeIcon = glamorous(TrendingToolAlternativeIcon)({
  height: 21
});

const AlternativesHomepage = () => {
  return (
    <Query query={alternativeTools}>
      {({loading, data}) => {
        const hasData = data && data.homepageTools;
        if (loading && !hasData)
          return (
            <Spinner>
              <Circular size={LARGE} />
            </Spinner>
          );

        if (hasData) {
          return (
            <Container>
              <ContainerInner>
                <Title>
                  <StyledTrendingToolAlternativeIcon />
                </Title>
                <AlternativesCards topTools={data.homepageTools} isMobile={false} />
              </ContainerInner>
            </Container>
          );
        } else {
          return null;
        }
      }}
    </Query>
  );
};

export default withAnalyticsPayload({
  'page.name': 'Home',
  path: typeof window !== 'undefined' ? window.location.pathname : null,
  url: typeof window !== 'undefined' ? window.location.href : null,
  referrer: typeof document !== 'undefined' ? document.referrer : null
})(AlternativesHomepage);
