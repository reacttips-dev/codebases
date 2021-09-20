import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Text, Flex, ResponsiveContainer, Icon } from '@postman/aether';

import Link from '../../../../../../../appsdk/components/link/Link';
import number from '../../../../../../../apinetwork/utils/number';
import AnalyticsService from '../../../../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../../../../js/services/NavigationService';
import { STYLED_CONSTANTS } from '../StyledConstants';
import { OPEN_EXPLORE_VIEW_ALL_TEAMS_IDENTIFIER } from '../../../../../../../apinetwork/navigation/constants';
import { PUBLIC_PROFILE_PAGE } from '../../../../../../../team/constants';

import Middot from './Middot';

const StyledPopularTeams = styled.div`
  margin-bottom: calc(2 * var(--spacing-xxl));
  padding: var(--spacing-zero) max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl));
  @media only screen and (max-width: $breakpoint-sm) {
    padding: var(--spacing-zero) var(--spacing-l);
  }

  @media only screen and (min-width: $breakpoint-sm) and (max-width: $breakpoint-lg) {
    padding: var(--spacing-zero) var(--spacing-xl);
  }

  .teams-img-container {
    display: flex;
    background-color: var(--background-color-secondary);
    padding: auto var(--spacing-xs);
    border-radius: var(--border-radius-default);
    width: 48px;
    height: 48px;

    & img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      width: calc(100% - var(--spacing-xs) * 2);
      margin: auto;
    }

    i {
      padding: var(--spacing-l);
    }
  }
`;

const PopularTeams = ({ teams, traceId }) => {
  const captureClickEvent = (e) => {
    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'teams',
      value: 1,
      traceId
    });

    // Case when click is done with Cmd or Ctrl key.
    if ((e.metaKey || e.ctrlKey)) {
      return;
    }

    e.preventDefault();
    NavigationService.transitionTo(OPEN_EXPLORE_VIEW_ALL_TEAMS_IDENTIFIER);
  },
  onTeamClick = (e, teamId, publicHandle) => {
    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'teams-home',
      entityId: teamId,
      value: 1,
      traceId
    });

    // Case when click is done with Cmd or Ctrl key.
    if ((e.metaKey || e.ctrlKey)) {
      return;
    }

    e.preventDefault();
    NavigationService.transitionTo(PUBLIC_PROFILE_PAGE, {
      publicProfileHandle: publicHandle
    });
  };

  return (
    <StyledPopularTeams>
      <Flex gap='spacing-s' padding={{ paddingBottom: 'spacing-xl' }} wrap='wrap'>
        <Heading type='h2' text='Popular teams' />
        <Link to={`${window.postman_explore_redirect_url}/teams`} onClick={captureClickEvent}>
          <Text type='body-large' color='blue-60'>
            View all teams &rarr;
          </Text>
        </Link>
      </Flex>
      <ResponsiveContainer type='row' gap='spacing-xl'>
        {teams.map(({ name, id, linkData, metrics, publisher: { profileURL, publicHandle }, onClick }) => (
          <ResponsiveContainer type='column' computer={3} tablet={6} mobile={12} key={name} gap='spacing-xl'>
            <Link to={linkData} onClick={(e) => onTeamClick(e, id, publicHandle)}>
              <Flex gap='spacing-l' alignItems='center'>
                <div className='teams-img-container'>
                  { profileURL ? <img src={profileURL} loading='lazy' alt='' /> :
                    <Icon name='icon-descriptive-team-stroke' color='content-color-primary' />}
                </div>
                <Flex direction='column'>
                  <Heading type='h3' styleAs='h4' text={name} />
                  <Flex gap='spacing-s'>
                    {metrics.map(({ metricName, metricValue }, index) => (
                      <Fragment key={metricName}>
                        {index > 0 && <Middot />}
                        <Text type='body-medium' color='content-color-secondary'>
                          {`${number.convertToUserFriendlyMetric(metricValue)} ${metricName}`}
                        </Text>
                      </Fragment>
                    ))}
                  </Flex>
                </Flex>
              </Flex>
            </Link>
          </ResponsiveContainer>
        ))}
      </ResponsiveContainer>
    </StyledPopularTeams>
  );
};

PopularTeams.propTypes = {
  teams: PropTypes.any
};

export default PopularTeams;
