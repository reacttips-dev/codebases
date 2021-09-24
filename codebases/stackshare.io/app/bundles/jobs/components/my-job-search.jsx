import React, {useContext} from 'react';
import JobSearchIcon from '../../../shared/library/icons/jobsearch-icon.svg';
import glamorous from 'glamorous';
import {
  ASH,
  CONCRETE,
  PAGE_BACKGROUND,
  SILVER_ALUMINIUM,
  TARMAC,
  WHITE
} from '../../../shared/style/colors';
import BigTitle from '../../../shared/library/typography/big-title';
import Text from '../../../shared/library/typography/text';
import {PHONE} from '../../../shared/style/breakpoints';
import {NavigationContext} from '../../../shared/enhancers/router-enhancer';
import {JOBS, SIGN_IN_PATH} from '../../../shared/constants/paths';
import {CurrentUserContext} from '../../../shared/enhancers/current-user-enhancer';
import Simple from '../../../shared/library/buttons/base/simple';
import SmallTitle from '../../../shared/library/typography/small-title';
import Checkbox from '../../../shared/library/inputs/checkbox';
import {destroyJobSearch, updateEmailSettings} from '../../../data/jobs/mutations';
import {user} from '../../../data/shared/queries';
import {ApolloContext} from '../../../shared/enhancers/graphql-enhancer';
import Close from '../../../shared/library/icons/close-circle.svg';
import {JobsContext} from '../enhancers/jobs';
import MyJobSearchLoader from './loaders/my-job-search';
import {BASE_TEXT} from '../../../shared/style/typography';
import {MobileContext} from '../../../shared/enhancers/mobile-enhancer';
import LocationIcon from '../../../shared/library/icons/location-icon.svg';
import {useSendAnalyticsEvent} from '../../../shared/enhancers/analytics-enhancer';
import {CLICK_SAVE_SEARCH, EMAIL_SAVED_SEARCH, REMOVE_SAVED_SEARCH} from '../constants/analytics';

const Container = glamorous.div({
  ...BASE_TEXT,
  [PHONE]: {
    margin: '0 0 30px 0',
    paddingTop: 30
  }
});

const MyJobSearchContainer = glamorous.div({
  background: PAGE_BACKGROUND,
  padding: '20px 15px',
  [PHONE]: {
    padding: 0
  }
});

const ItemsContainer = glamorous.div({
  gridTemplateColumns: 'repeat(auto-fill, 34px)',
  [PHONE]: {
    gridTemplateColumns: 'repeat(auto-fill, 60px)',
    gridGap: 20
  },
  gridGap: 10,
  display: 'grid',
  padding: '10px 0'
});

const Image = glamorous.img({
  width: 34,
  height: 34,
  border: `solid 1px ${ASH}`,
  background: WHITE,
  borderRadius: 2,
  [PHONE]: {
    width: 60,
    height: 60,
    borderRadius: 4
  }
});

const StyledSmallTitle = glamorous(SmallTitle)({
  textTransform: 'uppercase',
  color: SILVER_ALUMINIUM
});

const CloseIcon = glamorous(Close)({
  width: 10,
  height: 10,
  marginRight: 5
});

const Box = glamorous.div({
  margin: '30px 0',
  padding: '30px 20px',
  border: `dashed 1px ${ASH}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  [PHONE]: {
    margin: 0
  }
});

const BottomPanel = glamorous.div({
  borderTop: `solid 1px ${ASH}`,
  paddingTop: 20,
  marginTop: 20
});

const SignupDetails = glamorous.div({
  marginTop: 20,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const RemoveContainer = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const Remove = glamorous.div({
  color: CONCRETE,
  cursor: 'pointer'
});

const Title = glamorous(BigTitle)({
  margin: '10px 0'
});

const Search = glamorous(Simple)({
  height: 35,
  width: '100%'
});

const LocationSvg = glamorous(LocationIcon)({
  marginRight: 5,
  '> g': {
    stroke: TARMAC
  }
});

const Location = glamorous.div({
  margin: '5px 0',
  display: 'flex',
  alignItems: 'center'
});

const Keywords = glamorous.div({
  margin: '15px 0 5px 0',
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap'
});

const Pill = glamorous.div({
  color: TARMAC,
  background: ASH,
  padding: '3px 5px',
  borderRadius: 6,
  margin: '0 10px 10px 0'
});

const MyJobSearch = () => {
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const navigate = useContext(NavigationContext);
  const jobsContext = useContext(JobsContext);
  const client = useContext(ApolloContext);
  const currentUser = useContext(CurrentUserContext);
  const isMobile = useContext(MobileContext);
  const jobSearchLoaded = currentUser && currentUser.jobSearch;

  const showMyJobSearch =
    jobSearchLoaded &&
    (currentUser.jobSearch.companies.length !== 0 ||
      currentUser.jobSearch.tools.length !== 0 ||
      currentUser.jobSearch.latitude ||
      currentUser.jobSearch.keywords);

  let toolTerms =
    jobSearchLoaded &&
    currentUser.jobSearch.tools.map(tool => {
      return {
        name: tool.name,
        id: tool.name.toLowerCase(),
        type: 'tool',
        imageUrl: tool.imageUrl
      };
    });

  let companyTerms =
    jobSearchLoaded &&
    currentUser.jobSearch.companies.map(company => {
      return {
        name: company.name,
        id: company.name.toLowerCase(),
        type: 'company',
        imageUrl: company.imageUrl,
        slug: company.slug
      };
    });

  let keywordTerms =
    jobSearchLoaded &&
    currentUser.jobSearch.keywords.map(keyword => {
      return {
        name: keyword,
        id: keyword.toLowerCase(),
        type: 'keyword'
      };
    });

  if (showMyJobSearch) {
    toolTerms = currentUser.jobSearch && toolTerms.length ? [...toolTerms] : [];
    companyTerms = currentUser.jobSearch && companyTerms.length ? [...companyTerms] : [];
    keywordTerms = currentUser.jobSearch && keywordTerms.length ? [...keywordTerms] : [];
  }

  const destroySavedJobSearch = () => {
    sendAnalyticsEvent(REMOVE_SAVED_SEARCH, {
      tools: toolTerms,
      companies: companyTerms,
      keywords: keywordTerms,
      location: jobsContext.location
    });
    client
      .mutate({
        mutation: destroyJobSearch,
        refetchQueries: [{query: user}]
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {});
  };

  const handleEmailToggle = () => {
    sendAnalyticsEvent(EMAIL_SAVED_SEARCH, {
      tools: toolTerms,
      companies: companyTerms,
      keywords: keywordTerms,
      location: jobsContext.location,
      select: !currentUser.jobSearch.emailEnabled
    });
    client
      .mutate({
        mutation: updateEmailSettings,
        variables: {
          emailEnabled: !currentUser.jobSearch.emailEnabled
        },
        optimisticResponse: {
          __typename: 'Mutation',
          saveJobSearch: {
            emailEnabled: !currentUser.jobSearch.emailEnabled,
            __typename: 'JobSearch'
          }
        },
        refetchQueries: [{query: user}]
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {});
  };

  const onSearchClick = () => {
    sendAnalyticsEvent(CLICK_SAVE_SEARCH, {
      tools: toolTerms,
      companies: companyTerms,
      keywords: keywordTerms,
      location: jobsContext.location
    });
    if (isMobile) {
      jobsContext.setMyJobSearch(false);
    }
    if (currentUser && currentUser.jobSearch && currentUser.jobSearch.latitude) {
      jobsContext.setLocation({
        id: '',
        name: currentUser.jobSearch.location,
        type: 'location',
        _geoloc: {
          lat: currentUser.jobSearch.latitude,
          lng: currentUser.jobSearch.longitude
        }
      });
    }
    jobsContext.setTerms([...toolTerms, ...companyTerms, ...keywordTerms]);
    jobsContext.setBookmarkSearch(false);
    navigate(JOBS);
  };

  return (
    <Container>
      {showMyJobSearch && currentUser && (
        <>
          <Title>My Job Search</Title>
          <MyJobSearchContainer>
            {currentUser.jobSearch.tools.length !== 0 && (
              <div>
                <StyledSmallTitle>Tools</StyledSmallTitle>
                <ItemsContainer>
                  {currentUser.jobSearch.tools.map(tool => {
                    return (
                      <div key={tool.name}>
                        <Image src={tool.imageUrl} alt={tool.name} title={tool.name} />
                      </div>
                    );
                  })}
                </ItemsContainer>
              </div>
            )}
            {currentUser.jobSearch.companies.length !== 0 && (
              <div>
                <StyledSmallTitle>Companies</StyledSmallTitle>
                <ItemsContainer>
                  {currentUser.jobSearch.companies.map(company => {
                    return (
                      <div key={company.name}>
                        <Image src={company.imageUrl} alt={company.name} title={company.name} />
                      </div>
                    );
                  })}
                </ItemsContainer>
              </div>
            )}
            {currentUser.jobSearch.keywords.length !== 0 && (
              <div>
                <StyledSmallTitle>Keywords</StyledSmallTitle>
                <Keywords>
                  {currentUser.jobSearch.keywords.map(keyword => {
                    return (
                      <div key={keyword}>
                        <Pill>{keyword}</Pill>
                      </div>
                    );
                  })}
                </Keywords>
              </div>
            )}
            {currentUser.jobSearch.latitude && (
              <div>
                <StyledSmallTitle>Location</StyledSmallTitle>
                <Location>
                  <LocationSvg />
                  <Text>{currentUser.jobSearch.location}</Text>
                </Location>
              </div>
            )}
            <BottomPanel>
              <Search title="Search" onClick={() => onSearchClick()}>
                Search
              </Search>
              <SignupDetails>
                <div>
                  <Checkbox
                    title="Email me jobs"
                    checked={currentUser.jobSearch.emailEnabled}
                    onToggle={() => handleEmailToggle()}
                  >
                    Email me jobs
                  </Checkbox>
                </div>
                <RemoveContainer>
                  <Remove title="Remove job search" onClick={() => destroySavedJobSearch()}>
                    <CloseIcon />
                    Remove saved
                  </Remove>
                </RemoveContainer>
              </SignupDetails>
            </BottomPanel>
          </MyJobSearchContainer>
        </>
      )}
      {(!currentUser || (jobsContext.currentUserLoaded && !showMyJobSearch)) && (
        <Box onClick={currentUser ? () => {} : () => navigate(SIGN_IN_PATH)}>
          <JobSearchIcon />
          <Title>My Job Search</Title>
          <Text>Create your default job search by saving tools and companies </Text>
        </Box>
      )}
      {currentUser && currentUser.loading && <MyJobSearchLoader />}
    </Container>
  );
};

export default MyJobSearch;
