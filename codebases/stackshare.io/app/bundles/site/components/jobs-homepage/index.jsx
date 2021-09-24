import React from 'react';
import glamorous from 'glamorous';
import {Spinner} from '../../../tool-profile/components/shared/styles';
import Circular, {LARGE} from '../../../../shared/library/indicators/indeterminate/circular';
import JobCard from '../../../../shared/library/cards/jobs/jobs-card';
import {Query} from 'react-apollo';
import FeaturedJobsIcon from '../../../../shared/library/icons/featured-jobs-icon.svg';
import {ALABASTER, SCORE} from '../../../../shared/style/colors';
import {PHONE} from '../../../../shared/style/breakpoints';
import {PAGE_WIDTH} from '../../../../shared/style/dimensions';
import {homepageJobs} from '../../../../data/home/queries';
import {withAnalyticsPayload} from '../../../../shared/enhancers/analytics-enhancer';

const Container = glamorous.div({
  background: ALABASTER,
  padding: '25px 0'
});

const ContainerInner = glamorous.div({
  maxWidth: PAGE_WIDTH,
  margin: '0 auto'
});

const ViewAll = glamorous.div({
  margin: '30px 0 0 0',
  textAlign: 'center'
});

const Title = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 20
});

const StyledFeaturedJobsIcon = glamorous(FeaturedJobsIcon)({
  height: 19,
  fill: SCORE
});

const JobsContainer = glamorous.div({
  display: 'grid',
  gap: '0 15px',
  gridTemplate: 'repeat(1, 1fr) / repeat(3, 1fr)',
  [PHONE]: {
    gridTemplate: 'repeat(3, 1fr) / repeat(1, 1fr)',
    gap: '15px 0',
    padding: '0 15px'
  }
});

const JobsHomepage = () => {
  return (
    <Query query={homepageJobs}>
      {({loading, data}) => {
        const hasData = data && data.homepageJobs && data.homepageJobs.length;
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
                  <StyledFeaturedJobsIcon />
                </Title>
                <JobsContainer>
                  {data.homepageJobs.map(j => {
                    return (
                      <JobCard
                        companyName={j.company.name}
                        companyLogo={j.company.imageUrl}
                        key={j.id}
                        id={j.id}
                        url={j.angellistJobUrl}
                        title={j.title}
                        location={j.location}
                        services={j.services}
                        path={j.company.path}
                      />
                    );
                  })}
                </JobsContainer>
                <ViewAll>
                  <a href="/match" title="Stack Match">
                    View All
                  </a>
                </ViewAll>
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
})(JobsHomepage);
