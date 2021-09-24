import React, {useContext, useState} from 'react';
import glamorous from 'glamorous';
import BigTitle from '../../../shared/library/typography/big-title';
import Text from '../../../shared/library/typography/text';
import {ALABASTER, ASH, FOCUS_BLUE} from '../../../shared/style/colors';
import {NavigationContext} from '../../../shared/enhancers/router-enhancer';
import {JOBS, SIGN_IN_PATH} from '../../../shared/constants/paths';
import {CurrentUserContext} from '../../../shared/enhancers/current-user-enhancer';
import ServiceTile, {SMALL} from '../../../shared/library/tiles/service';
import {flattenEdges} from '../../../shared/utils/graphql';
import BackIcon from '../../../shared/library/icons/back-arrow-icon.svg';
import {JobsContext} from '../enhancers/jobs';
import {PHONE} from '../../../shared/style/breakpoints';
import PropTypes from 'prop-types';
import FollowedCompaniesLoader from '../../../shared/library/loaders/followed-companies';
import {BASE_TEXT} from '../../../shared/style/typography';
import LoadMoreButton from '../../../shared/library/buttons/load-more';
import {MobileContext} from '../../../shared/enhancers/mobile-enhancer';
import {useSendAnalyticsEvent} from '../../../shared/enhancers/analytics-enhancer';
import {VIEW_FOLLOWED_COMPANIES_JOBS} from '../constants/analytics';

const Container = glamorous.div({
  margin: '30px 0',
  [PHONE]: {
    margin: '0 0 30px 0'
  }
});

const ServiceContainer = glamorous.div({
  padding: '7px 5px 7px 5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': {
    background: ALABASTER
  }
});

const SignUp = glamorous.div({
  fontSize: 15,
  color: FOCUS_BLUE,
  cursor: 'pointer',
  ...BASE_TEXT
});

const FollowCompanies = glamorous.a({
  fontSize: 15,
  color: FOCUS_BLUE,
  display: 'block',
  marginTop: 15
});

const Followed = glamorous.div(
  {
    marginTop: 20,
    [PHONE]: {
      paddingTop: 25,
      marginTop: 0
    }
  },
  ({showAll}) => ({
    height: !showAll ? '280px' : 'auto',
    overflow: !showAll ? 'hidden' : 'auto'
  })
);

export const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 10
});

const Title = glamorous(BigTitle)({
  margin: '10px 0',
  paddingBottom: 20,
  borderBottom: `2px solid ${ASH}`
});

const FollowedCompanies = ({showHeading = true}) => {
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const navigate = useContext(NavigationContext);
  const currentUser = useContext(CurrentUserContext);
  const jobsContext = useContext(JobsContext);
  const isMobile = useContext(MobileContext);
  const [showAll, setShowAll] = useState(false);
  const hasFollowedCompanies = jobsContext.currentUserLoaded && currentUser.followedCompanies;

  const followedCompaniesCount = hasFollowedCompanies && currentUser.followedCompanies.count;
  const followedCompanies = hasFollowedCompanies && flattenEdges(currentUser.followedCompanies);

  const onCompanyClick = ({company}) => {
    sendAnalyticsEvent(VIEW_FOLLOWED_COMPANIES_JOBS, {companyName: company.name});
    if (isMobile) {
      jobsContext.setCompanySearch(true);
    } else {
      window.scrollTo(0, 0);
    }
    navigate(JOBS);
    jobsContext.setBookmarkSearch(false);
    jobsContext.setHitsPerPage(15);
    jobsContext.setTerms([
      {
        name: company.name,
        id: company.id,
        type: 'company',
        imageUrl: company.imageUrl
      }
    ]);
  };

  return (
    <Container>
      {showHeading && <Title>Companies I Follow</Title>}
      {currentUser && !jobsContext.currentUserLoaded && <FollowedCompaniesLoader />}
      {currentUser ? (
        <>
          {followedCompanies && followedCompaniesCount !== 0 && followedCompanies !== 0 && (
            <>
              <Followed showAll={showAll}>
                {followedCompanies.map(company => (
                  <ServiceContainer
                    key={company.id}
                    onClick={() => onCompanyClick({company})}
                    title={`Search for jobs at ${company.name}`}
                  >
                    <ServiceTile
                      size={SMALL}
                      name={company.name}
                      imageUrl={company.thumbUrl}
                      rounded={true}
                      slim={true}
                      label={true}
                      inverted={false}
                    />
                    <BackIcon />
                  </ServiceContainer>
                ))}
              </Followed>
              {!showAll && followedCompaniesCount >= 6 && (
                <Center>
                  <LoadMoreButton text="Show All" onClick={() => setShowAll(true)} />
                </Center>
              )}
            </>
          )}
          {followedCompaniesCount === 0 && (
            <>
              <Text>Uh-oh! You don&#39;t seem to be following any companies</Text>
              <FollowCompanies href="/companies" title="find some companies to follow">
                Find some companies to follow
              </FollowCompanies>
            </>
          )}
        </>
      ) : (
        <SignUp onClick={() => navigate(SIGN_IN_PATH)}>
          <strong>Sign Up</strong> to Follow Companies
        </SignUp>
      )}
    </Container>
  );
};

FollowedCompanies.propTypes = {
  showHeading: PropTypes.bool
};

export default FollowedCompanies;
