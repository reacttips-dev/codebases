import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Text, Heading, ResponsiveContainer } from '@postman/aether';
import _ from 'lodash';

import Link from '../../../../../../../appsdk/components/link/Link';
import AnalyticsService from '../../../../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../../../../js/services/NavigationService';
import ExploreUtils from '../../../../../../../apinetwork/utils/explore-utils';
import { STYLED_CONSTANTS } from '../StyledConstants';
import { OPEN_EXPLORE_SPOTLIGHT_IDENTIFIER } from '../../../../../../../apinetwork/navigation/constants';

import ListContainer from './ListContainer';

const LIMIT = 5,
  StyledSpotlightContainer = styled.div`
    padding: var(--spacing-zero) max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl));

    @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.sm}px) {
      padding: var(--spacing-zero) var(--spacing-l);
    }
  
    @media only screen and (min-width: ${STYLED_CONSTANTS.breakpoint.sm}px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
      padding: var(--spacing-zero) var(--spacing-xl);
    }

    & h2 {
      margin-bottom: var(--spacing-m);
    }
  `;

const transformItems = _.memoize((entities) => {

  let items = _.slice(
    _.compact(_.flatten(_.zip(..._.values(entities)))),
    0,
    LIMIT
  );

  return items.map((item) => ({
    'logoUrl': _.get(item, 'publisherInfo.profileURL'),
    'name': _.get(item, 'name'),
    'creator': _.get(item, 'publisherInfo.publicName'),
    'updatedAt': _.get(item, 'updatedAt'),
    'redirectURL': _.get(item, 'redirectURL'),
    'versions': _.get(item, 'meta.versionCount'),
    'description': _.get(item, 'summary'),
    'entityId': _.get(item, 'entityId'),
    'entityType': _.get(item, 'entityType'),
    'teamUrl': `${window.postman_explore_url}/${_.get(item, 'publisherInfo.publicHandle')}`,
    'publisherType': _.get(item, 'publisherType'),
    'publisherId': _.get(item, 'publisherId'),
    'tags': _.get(item, 'tags'),
    'stats': {
      'forks': _.get(_.find(item.metrics, { metricName: 'forkCount' }), 'metricValue'),
      'watchers': _.get(_.find(item.metrics, { metricName: 'watchCount' }), 'metricValue'),
      'views': _.get(_.find(item.metrics, { metricName: 'viewCount' }), 'metricValue')
    }
  }));
});

const Spotlight = ({ data, traceId }) => {
  let listItems = _.chunk(data, 2);

  const captureClickEvent = (e) => {
    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'spotlight',
      value: 1,
      traceId
    });

    // Case when click is done with Cmd or Ctrl key.
    if ((e.metaKey || e.ctrlKey)) {
      return;
    }

    e.preventDefault();
    NavigationService.transitionTo(OPEN_EXPLORE_SPOTLIGHT_IDENTIFIER);
  };

  return (
    <StyledSpotlightContainer>
      <Heading
        type='h2'
        styleAs='h1'
        text='In the spotlight'
      />
      <Text color='content-color-secondary' type='body-large'>
        The best APIs, collections, and workspaces handpicked by Postman. {' '}
      </Text>
      <Link to={`${window.postman_explore_redirect_url}/spotlight`} onClick={(e) => captureClickEvent(e)}>
        <Text type='body-large' color='blue-60'>
          See what more is in the spotlight &rarr;
        </Text>
      </Link>
      {listItems.map((lists, index) => (
        <ResponsiveContainer type='row' key={index}>
          {lists.map((list) => (
            <ResponsiveContainer key={list['id']} type='column' computer={6} tablet={6} mobile={12}>
              <ListContainer
                title={list['name']}
                description={list['summary']}
                redirectTo={list['slug']}
                items={transformItems(list.entities)}
                isMixedEntityList={ExploreUtils.getCuratedListType(list['entityCounts']) === 'mixed'}
                traceId={traceId}
              />
            </ResponsiveContainer>
          ))}
        </ResponsiveContainer>
      ))}
    </StyledSpotlightContainer>
  );
};

Spotlight.propTypes = {
  data: PropTypes.any
};

export default Spotlight;
