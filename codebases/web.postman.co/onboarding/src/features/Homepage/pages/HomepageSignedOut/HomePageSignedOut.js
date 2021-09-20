import React, { useEffect, useState, useRef, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';
import { Flex, Spinner } from '@postman/aether';
import { getPopularTeams, getPopularEntities, getSpotlightData } from './api';

import PopularTeams from './components/PopularTeams';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ExploreCards from './components/ExploreCards/ExploreCards';
import Spotlight from './components/Spotlight';
import WhatIsPostman from './components/WhatIsPostman';
import AnalyticsService from '../../../../../../js/modules/services/AnalyticsService';

const StyledHomePageSignedOut = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: var(--background-color-primary);

  // Reset List Styles
  ul {
    list-style: none;
  }
`;

const HomePageSignedOut = ({ controller }) => {
  const [loaded, setLoaded] = useState(false);
  const [traceId, setTraceId] = useState(uuid());
  const state = useRef({});

  // This will not cause re-render, we will depend on setLoaded for re-render. Since the data is stationary we don't need
  // to maintain state for it as it wont change.
  const setState = (newState) => {
    state.current = { ...state.current, ...newState };
  };

  useEffect(() => {
    init();
    controller.setTitle('Postman API Platform | Sign Up for Free');
    controller.setPageMetaTags([
      {
        name: 'viewport',
        value: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    ]);

    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'view',
      value: 1,
      traceId
    });
  }, []);

  // Call all APIs here
  const init = async () => {
    const urlSearchParams = new URLSearchParams(window.location.search),
      queryParams = Object.fromEntries(urlSearchParams.entries()),
      utm_params = {
        ...(queryParams['utm_source'] && { utm_source: queryParams['utm_source'] }),
        ...(queryParams['utm_medium'] && { utm_medium: queryParams['utm_medium'] }),
        ...(queryParams['utm_campaign'] && { utm_campaign: queryParams['utm_campaign'] }),
        ...(queryParams['utm_term'] && { utm_term: queryParams['utm_term'] }),
        ...(queryParams['utm_content'] && { utm_content: queryParams['utm_content'] })
      },
      [
        popularEntities,
        teams,
        spotlightData
      ] = await Promise.all([
        getPopularEntities(utm_params, traceId),
        getPopularTeams(),
        getSpotlightData()
      ]);

    // TODO: think of error handling here.
    if (!teams[1]) setState({ teams: teams[0] });
    if (!popularEntities[1]) setState({ popularEntities: popularEntities[0] });
    if (!spotlightData[1]) setState({ spotlightData: spotlightData[0] });

    setLoaded(true);
  };

  const { teams, popularEntities, spotlightData } = state.current;

  return (
    <StyledHomePageSignedOut>
      <Hero traceId={traceId} />
      <WhatIsPostman traceId={traceId} />
      {!loaded ?
        <Flex height='100%' width='100%' justifyContent='center' alignItems='center'>
          <Spinner />
        </Flex>
        :
        <Fragment>
          {popularEntities &&
            <ExploreCards
              popularEntities={popularEntities}
              traceId={traceId}
            />
          }
          <Flex direction='column' gap='spacing-xxxl'>
            {spotlightData &&
              <Spotlight
                data={spotlightData}
                traceId={traceId}
              />
            }

            {teams &&
              <PopularTeams
                teams={teams.data}
                traceId={traceId}
              />
            }
          </Flex>
        </Fragment>
      }
      <Footer traceId={traceId} />
    </StyledHomePageSignedOut>
  );
};

HomePageSignedOut.propTypes = {
  controller: PropTypes.shape({
    setPageMetaTags: PropTypes.func
  })
};

export default HomePageSignedOut;
