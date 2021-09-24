import React, {useContext, useState} from 'react';
import glamorous from 'glamorous';
import {ASH, FOCUS_BLUE, GUNSMOKE, PAGE_BACKGROUND, WHITE} from '../../../shared/style/colors';
import Ghost from '../../../shared/library/buttons/base/ghost';
import {CurrentUserContext} from '../../../shared/enhancers/current-user-enhancer';
import {NavigationContext} from '../../../shared/enhancers/router-enhancer';
import {JOBS, SIGN_IN_PATH} from '../../../shared/constants/paths';
import LocationSearchInput from '../../../shared/library/search/loc-search';
import PlacesSearchProvider from '../../../shared/library/search/providers/places';
import OmniSearch from '../../../shared/library/search/omni-search';
import JobSearchProvider from '../../../shared/library/search/providers/job';
import {safeSplice} from '../../../shared/utils/space-splice';
import {JobsContext} from '../enhancers/jobs';
import {PHONE} from '../../../shared/style/breakpoints';
import {saveJobSearch} from '../../../data/jobs/mutations';
import {user} from '../../../data/shared/queries';
import {ApolloContext} from '../../../shared/enhancers/graphql-enhancer';
import AnimatedCheckMark from '../../../shared/library/animation/check-mark';
import {useSendAnalyticsEvent} from '../../../shared/enhancers/analytics-enhancer';
import {JOBS_SAVE_SEARCH} from '../constants/analytics';
import {grid} from '../../../shared/utils/grid';
import SmallText from '../../../shared/library/typography/small-text';
import {FONT_FAMILY} from '../../../shared/style/typography';

const Container = glamorous.div({
  gridArea: 'searchBar',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  background: WHITE,
  boxShadow: '0 1px #ebebeb',
  [PHONE]: {
    background: PAGE_BACKGROUND,
    position: 'relative',
    boxShadow: 'none',
    padding: '25px 0'
  }
});

const Content = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  width: 795,
  marginLeft: 30,
  [PHONE]: {
    maxWidth: '100%',
    flexDirection: 'column',
    marginLeft: 0
  }
});

const Inputs = glamorous.div({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 0',
  [PHONE]: {
    flexDirection: 'column',
    padding: 0
  }
});

const SearchInput = glamorous.div({
  marginRight: 15,
  flexGrow: 1,
  maxWidth: 514,
  [PHONE]: {
    margin: 0,
    width: '100%',
    padding: '5px 0',
    boxSizing: 'border-box'
  }
});

const LocationInput = glamorous.div({
  width: '25%',
  [PHONE]: {
    width: '100%',
    padding: '5px 0',
    boxSizing: 'border-box',
    zIndex: 0
  }
});

const Buttons = glamorous.div({
  display: 'flex',
  [PHONE]: {
    width: '100%',
    padding: '5px 0',
    boxSizing: 'border-box',
    margin: 0
  }
});

const Save = glamorous(Ghost)({
  height: 40,
  width: 75,
  margin: '0 0 0 15px',
  [PHONE]: {
    width: '100vw',
    margin: 0
  }
});

const TopSearch = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  margin: '0 0 10px 30px',
  [PHONE]: {
    width: '100%',
    margin: '10px 0'
  },
  ' span': {
    color: GUNSMOKE,
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    marginRight: 5
  }
});

const TagLink = glamorous.a({
  textDecoration: 'none'
});

const Tag = glamorous(SmallText)({
  marginRight: grid(1),
  fontFamily: FONT_FAMILY,
  letterSpacing: 0.5,
  color: GUNSMOKE,
  border: `1px solid ${ASH}`,
  borderRadius: 100,
  padding: '5px 14px',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  lineHeight: '36px'
});

const SearchBar = () => {
  const [saved, setSaved] = useState(false);
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const currentUser = useContext(CurrentUserContext);
  const navigate = useContext(NavigationContext);
  const jobsContext = useContext(JobsContext);
  const client = useContext(ApolloContext);

  let tools = [];
  let companies = [];
  let keywords = [];
  jobsContext.terms.map(term => {
    switch (term.type) {
      case 'tool':
        tools.push(term.id);
        break;
      case 'company':
        companies.push(term.slug);
        break;
      case 'keyword':
        keywords.push(term.name);
        break;
    }
  });

  const topSearches = [
    {
      name: 'React',
      path: '/react'
    },
    {
      name: 'Node.js',
      path: '/nodejs'
    },
    {
      name: 'Python',
      path: '/python'
    },
    {
      name: 'Java',
      path: '/java'
    },
    {
      name: 'Django',
      path: '/django'
    },
    {
      name: ' Vue.js',
      path: '/vue-js'
    }
  ];

  const handleSavedSearch = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    client
      .mutate({
        mutation: saveJobSearch,
        variables: {
          toolSlugs: tools,
          companySlugs: companies,
          keywords: keywords,
          location: jobsContext.location ? jobsContext.location.name : '',
          latitude: jobsContext.geoLocation && jobsContext.geoLocation.lat,
          longitude: jobsContext.geoLocation && jobsContext.geoLocation.lng,
          emailEnabled: !!(currentUser.jobSearch && currentUser.jobSearch.emailEnabled)
        },
        refetchQueries: [{query: user}]
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {});
  };

  const onSaveClick = () => {
    sendAnalyticsEvent(JOBS_SAVE_SEARCH, {
      tools,
      companies,
      keywords,
      location: jobsContext.location
    });
    if (currentUser) {
      handleSavedSearch();
    } else {
      navigate(SIGN_IN_PATH);
    }
  };

  return (
    <Container>
      <Content>
        <Inputs>
          <SearchInput>
            <JobSearchProvider terms={jobsContext.terms}>
              <OmniSearch
                onClear={() => jobsContext.setTerms([])}
                placeholder="Search by keyword, tool, or company"
                terms={jobsContext.terms}
                onRemove={id => {
                  navigate(JOBS);
                  const idx = jobsContext.terms.findIndex(t => t.id === id);
                  if (idx !== -1) {
                    jobsContext.setTerms(safeSplice(jobsContext.terms, idx));
                  }
                }}
                onAdd={newTerm => {
                  navigate(JOBS);
                  jobsContext.setHitsPerPage(15);
                  jobsContext.setTerms([...jobsContext.terms, newTerm]);
                }}
              />
            </JobSearchProvider>
          </SearchInput>
          <LocationInput>
            <PlacesSearchProvider>
              <LocationSearchInput
                onAdd={() => jobsContext.setHitsPerPage(15)}
                setLocation={jobsContext.setLocation}
                location={jobsContext.location}
              />
            </PlacesSearchProvider>
          </LocationInput>
        </Inputs>
        <Buttons>
          <Save
            title="Save your job search"
            disabled={!jobsContext.terms.length && !jobsContext.location}
            onClick={() => onSaveClick()}
            color={FOCUS_BLUE}
          >
            {saved ? <AnimatedCheckMark /> : 'Save'}
          </Save>
        </Buttons>
      </Content>
      <TopSearch>
        <span>Top Searches: </span>
        {topSearches.map((item, i) => (
          <TagLink key={i} href={`/jobs${item.path}`} title={`${item.name} jobs`}>
            <Tag>{item.name}</Tag>
          </TagLink>
        ))}
      </TopSearch>
    </Container>
  );
};

export default SearchBar;
