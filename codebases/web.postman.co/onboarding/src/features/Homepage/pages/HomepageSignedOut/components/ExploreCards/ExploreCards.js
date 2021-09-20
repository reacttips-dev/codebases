import React from 'react';
import { Flex, Text, Heading } from '@postman/aether';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import AnalyticsService from '../../../../../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../../../../../js/services/NavigationService';

import Link from '../../../../../../../../appsdk/components/link/Link';
import ExploreCard from './ExploreCard';
import { getLinkToExplore } from './ExploreCardsUtils';
import { STYLED_CONSTANTS } from '../../StyledConstants';
import { OPEN_EXPLORE_HOME_IDENTIFIER } from '../../../../../../../../apinetwork/navigation/constants';

const StyledExploreContainer = styled.div`
  padding: var(--spacing-zero) max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl));
  @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.sm}px) {
    padding: var(--spacing-zero) var(--spacing-l);
  }

  @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.sm}px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
    padding: var(--spacing-zero) var(--spacing-xl);
  }

  & > * {
    box-sizing: border-box;
  }

  .explore-header {
    margin-top: 80px;
  }
  .explore-subheading {
    margin-top: var(--spacing-m);
    p {
      max-width: unset;
      margin-right: var(--spacing-xs);
    }
    a {
      margin-left: unset;
      font-size: var(--text-size-l);
      margin-left: var(--spacing-xs);
      color: var(--content-color-link);
    }
  }

  ul {
    padding: var(--spacing-zero);
    /* Safari doesn't support row-gap and column-gap properties.
    * To achieve same effect we set negative left and right margin to the parent and set cancelling margin to child elements
    * Reference: https://stackoverflow.com/q/20626685
    * In Safari an element with box-shadow flickers without added margin. So adding margin fixes this issue.
    */
    margin: var(--spacing-xxl) -12px var(--spacing-xxxl) -12px;
    column-count: 3;
    column-gap: var(--spacing-xl);
    row-gap: var(--spacing-xl);

    @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.md}px) {
      column-count: 1;
      margin-right: var(--spacing-m);
    }

    @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.md}px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
      column-count: 2;
      margin-right: var(--spacing-m);
    }
  }
`;

/**
 * @description - Component to render cards of various types of public entities on the signed out homepage
 */
export default function ExploreCards ({ popularEntities, traceId }) {
  if (_.isEmpty(popularEntities)) {
    return null;
  }

  const captureClickEvent = (e) => {
    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'explore',
      value: 1,
      traceId
    });

    // Case when click is done with Cmd or Ctrl key.
    if ((e.metaKey || e.ctrlKey)) {
      return;
    }
    e.preventDefault();
    NavigationService.transitionTo(OPEN_EXPLORE_HOME_IDENTIFIER);
  };

  const exploreCards = _.map(popularEntities, (cardData) => (
    <ExploreCard cardData={cardData} key={cardData.id} />
  ));

  return (
    <StyledExploreContainer>
      <Flex alignItems='center' className='explore-header'>
        <Heading type='h2' styleAs='h1' text="What's happening on Postman" color='content-color-primary' />
      </Flex>
      <Flex className='explore-subheading' alignItems='center'>
        <Text type='lead' color='content-color-secondary'>
          Browse the largest network of APIs and share what you build with developers across the planet.
          <Link
            to={getLinkToExplore()}
            onClick={captureClickEvent}
          >
            <Text type='link-primary'>Explore the Public API Network &rarr;</Text>
          </Link>
        </Text>
      </Flex>
      <ul>{exploreCards}</ul>
    </StyledExploreContainer>
  );
}

ExploreCards.propTypes = {
  popularEntities: PropTypes.array
};

ExploreCards.defaultProps = {
  popularEntities: []
};
