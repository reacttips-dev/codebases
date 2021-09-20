import React from 'react';
import styled from 'styled-components';
import { Flex, ResponsiveContainer, Heading, Text } from '@postman/aether';

import Link from '../../../../../../../appsdk/components/link/Link';
import AnalyticsService from '../../../../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../../../../js/services/NavigationService';
import { STYLED_CONSTANTS } from '../StyledConstants';

import APIToolsIconUrl from '../../../../../../../assets/images/thumbnails/postman-home-settings.svg';
import APIRepositoryIconUrl from '../../../../../../../assets/images/thumbnails/postman-home-decentralize.svg';
import IntelligenceIconUrl from '../../../../../../../assets/images/thumbnails/postman-home-ai.svg';
import WorkspacesIconUrl from '../../../../../../../assets/images/thumbnails/postman-home-grid-interface.svg';

const POSTMAN_INFO_MAP = [
  {
    name: 'api-tools',
    header: 'API Tools',
    body: 'A comprehensive set of tools that help accelerate the API Lifecycle - from design, testing, documentation, and mocking to discovery.',
    illustration: 'settings'
  },
  {
    name: 'api-repository',
    header: 'API Repository',
    body: 'Easily store, iterate and collaborate around all your API artifacts on one central platform used across teams.',
    illustration: 'decentralize'
  },
  {
    name: 'workspaces',
    header: 'Workspaces',
    body: 'Organize your API work and collaborate with teammates across your organization or stakeholders across the world.',
    illustration: 'grid-interface'
  },
  {
    name: 'intelligence',
    header: 'Intelligence',
    body: 'Improve API operations by leveraging advanced features such as search, notifications, alerts and security warnings, reporting, and much more.',
    illustration: 'ai'
  }
],
  POSTMAN_PLATFORM_URL = 'https://www.postman.com/api-platform',
  StyledPostmanInfoContainer = styled.div`
    background-color: var(--background-color-secondary);
    padding: 76px max(calc((100vw - ${STYLED_CONSTANTS.maxContentWidth}px) / 2), var(--spacing-xxxl)) 60px;
    @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.xs}px) {
      padding: var(--spacing-xl) var(--spacing-l);
    }

    @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.md}px) {
      margin-top: var(--spacing-xxl);
    }

    @media only screen and (min-width: 720px) and (max-width: ${STYLED_CONSTANTS.breakpoint.lg}px) {
      margin-top: 80px;
    }

    h2 {
      margin-bottom: var(--spacing-m);
    }

    .postman-info {
      &__subheading {
        margin-bottom: calc(var(--spacing-xxl) + var(--spacing-xs));

        /* to override default aether behavior */
        p {
          max-width: 100ch;
        }
      }

      &__section {
        // with aether default column-gap scrollbar appears in very small screens
        @media only screen and (max-width: ${STYLED_CONSTANTS.breakpoint.xs}px) {
          column-gap: var(--spacing-l);
        }

        img {
          margin-bottom: var(--spacing-l);
          width: var(--sizing-l);
          height: var(--sizing-l);
        }
      }

      &__cta {
        margin-top: calc(2 * var(--spacing-xxl));

        .cta-button {
          font-size: var(--text-size-m);
          line-height: var(--line-height-s);
        }
      }
    }
  `;

const getIconUrl = (iconName) => {
  switch (iconName) {
    case 'api-tools':
      return APIToolsIconUrl;

    case 'api-repository':
      return APIRepositoryIconUrl;

    case 'workspaces':
      return WorkspacesIconUrl;

    case 'intelligence':
      return IntelligenceIconUrl;

    default:
      return '';
  }
};

const DetailsSection = ({ header, body, illustration, name }) => {
  return (
    <ResponsiveContainer type='column' gap='spacing-s' computer={3} tablet={6} mobile={6}>
      <header>
        <img src={getIconUrl(name)} alt={name} />
        <Heading type='h3' text={header} />
      </header>
      <div>
        <Text type='body-medium' color='content-color-secondary'>
          {body}
        </Text>
      </div>
    </ResponsiveContainer>
  );
};

const WhatIsPostman = ({ traceId }) => {

  const captureClickEvent = (e) => {
    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'postman',
      value: 1,
      traceId
    });

    // Case when click is done with Cmd or Ctrl key.
    if ((e.metaKey || e.ctrlKey)) {
      return;
    }

    e.preventDefault();
    NavigationService.openURL(POSTMAN_PLATFORM_URL);
  };

  return (
    <StyledPostmanInfoContainer>
      <Flex alignItems='center'>
        <Heading type='h2' styleAs='h1' text='What is Postman?' />
      </Flex>
      <ResponsiveContainer className='postman-info__subheading' type='row'>
        <ResponsiveContainer type='column' span={6} tablet={8} mobile={12}>
          <Text type='lead' color='content-color-secondary'>
            Postman is an API platform for building and using APIs. Postman simplifies each step of the API lifecycle and
            streamlines collaboration so you can create better APIs—faster.
          </Text>
        </ResponsiveContainer>
      </ResponsiveContainer>

      <ResponsiveContainer className='postman-info__section' type='row' gap='spacing-xxl'>
        {
          POSTMAN_INFO_MAP.map((info) => (
            <DetailsSection
              key={info.name}
              header={info.header}
              body={info.body}
              illustration={info.illustration}
              name={info.name}
            />
          ))
        }
      </ResponsiveContainer>
      <Flex justifyContent='center' alignItems='center' className='postman-info__cta'>
        <Link
          to={POSTMAN_PLATFORM_URL}
          onClick={captureClickEvent}
        >
          <Text type='link-button-outline' className='cta-button'>
            Learn more
          </Text>
        </Link>
      </Flex>
    </StyledPostmanInfoContainer>
  );
};

export default WhatIsPostman;
