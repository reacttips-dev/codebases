import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Flex, Icon, Text, Badge, Heading } from '@postman/aether';

import number from '../../../../../../../../apinetwork/utils/number';
import Link from '../../../../../../../../appsdk/components/link/Link';
import PluralizeHelper from '../../../../../../../../js/utils/PluralizeHelper';
import { EXPLORE_FORMAT_LABEL, EXPLORE_TYPE_LABEL } from './ExploreCardsConstants';
import Middot from '../Middot';
import { TEAM } from '../../../../HomepageConstants';

import Avatar from '../../../../../../../../js/components/base/Avatar';

const BADGE_MAP = {
  'api': 'warning',
  'collection': 'info',
  'workspace': 'critical'
},
  StyledExploreCard = styled.li`
    display: inline-block;
    width: 100%;

    box-sizing: border-box;

    background: var(--background-color-primary);
    border-radius: var(--border-radius-default);
    border: var(--border-width-default) var(--border-style-solid) var(--border-color-default);
    padding: var(--spacing-l);
    margin: var(--spacing-m);
    position: relative;

    &:hover {
      box-shadow: var(--shadow-default);
    }

    a {
      /* clamp heading to a max of 2 lines */
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      /* spread link surface area to whole card
      * https://inclusive-components.design/cards/
      */
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
      }
    }

    h3 {
      font-size: var(--text-size-l);
      font-weight: var(--text-weight-medium);
      line-height: var(--line-height-m);
    }

    .card-header {
      margin-bottom: var(--spacing-m);
      flex-wrap: wrap;
      column-gap: var(--spacing-m);
      row-gap: var(--spacing-m);
      
      .card-publisher {
        position: relative;
        
        .card-publisher-name {
          max-width: 30ch;
          @include text-truncate-ellipsis;
        }
  
        .card-img-container {
          width: 48px;
          height: 48px;
          box-sizing: border-box;
          background-color: var(--background-color-secondary);
          border-radius: var(--border-radius-default);
          margin-right: var(--spacing-s);
          padding: var(--spacing-xs);
          display: grid;
          place-content: center;
          img {
            width: 48px;
            height: 48px;
            object-fit: contain;
          }
        }
  
        a {
          display: inline-flex;
          align-items: center;
        }
      }

      .card-badge {
        padding: var(--spacing-zero) var(--spacing-xs);
        margin-left: var(--spacing-zero);
        border-radius: var(--border-radius-s);
        background-color: transparent;

        &__api {
          border: var(--border-width-default) var(--border-style-solid) var(--yellow-30);
          color: var(--content-color-warning);
        }
    
        &__workspace {
          border: var(--border-width-default) var(--border-style-solid) var(--green-30);
          color: var(--content-color-success);
        }
        &__collection {
          border: var(--border-width-default) var(--border-style-solid) var(--blue-30);
          color: var(--content-color-info);
        }
      }
    }

    .card-meta-format {
      margin-left: var(--spacing-l);
    }

    .middot {
      display: inline-block;
      margin: var(--spacing-zero) var(--spacing-s);
      font-weight: var(--text-weight-bold);
    }

    .card--description {
      position: relative;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      margin-top: var(--spacing-s);
    }

    .card-footer {
      margin-top: var(--spacing-l);
      .card-footer-stats {
        text-transform: uppercase;
      }

      &__view-icon {
        margin-right: var(--spacing-xs);
      }
      &__fork-icon {
        margin-right: var(--spacing-xs);
        margin-left: var(--spacing-l);
      }
    }

  `;

/**
 * Helps decide if a link should be relative or absolute.
 */
function isRelative (linkData) {
  let routeIdentifier = _.get(linkData, 'routeIdentifier'),
    publicHandle = _.get(linkData, 'routeParams.publicHandle'),
    wid = _.get(linkData, 'routeParams.wid');

  return (routeIdentifier === 'workspace.open') && publicHandle && wid;
}

/**
 * Helps dynamically construct the link URL.
 */
function constructLinkUrl (linkData) {
  let routeIdentifier = _.get(linkData, 'routeIdentifier'),
    publicHandle = _.get(linkData, 'routeParams.publicHandle'),
    wid = _.get(linkData, 'routeParams.wid');

  if ((routeIdentifier === 'workspace.open') && publicHandle && wid) {
    return `${linkData.routeParams.publicHandle}/workspace/${linkData.routeParams.wid}`;
  }

  return linkData;
}

/**
 * @description - Component to render a single public entity
 *
 */
export default function ExploreCard ({ cardData }) {
  return (
    <StyledExploreCard>
      <Flex direction='row' wrap='wrap' justifyContent='space-between' alignItems='center' className='card-header'>
        <Flex direction='row' alignItems='center' className='card-publisher'>
          <Link to={constructLinkUrl(cardData.publisherLinkData)}
            relative={isRelative(cardData.publisherLinkData)}
            onClick={cardData.onPublisherLinkClick}
            title={cardData.publisherName}
          >
            <span className={'card-img-container'}>
              {cardData.publisherPicUrl ? (
                <img alt='' src={cardData.publisherPicUrl} loading='lazy' />
              ) : (
                <span>
                  {cardData.publisherType === TEAM ?
                    <Icon name='icon-descriptive-team-stroke' color='content-color-primary' /> :
                    <Avatar userId={cardData.publisherId} />}
                </span>
              )}
            </span>
            <Text type='body-large' color='content-color-primary' className={'card-publisher-name'}>
              {cardData.publisherName}
            </Text>
          </Link>
        </Flex>
        <Flex direction='row' alignItems='center'>
          <Badge status={_.get(BADGE_MAP, 'cardData.type')} text={cardData.type} className={`card-badge card-badge__${cardData.type}`} />
        </Flex>
      </Flex>
      <Link to={constructLinkUrl(cardData.linkData)}
        relative={isRelative(cardData.linkData)}
        onClick={cardData.onClick}
      >
        <Heading type='h3' color='content-color-primary' text={cardData.title} title={cardData.title} />
      </Link>
      <Flex direction='row' alignItems='center'>
        {_.get(cardData, 'meta.format') && (
          <Fragment>
            <Text type='para' color='content-color-secondary' className='card-meta-format'>
              {EXPLORE_FORMAT_LABEL}
            </Text>
            <Text type='para' color='content-color-primary'>
              {cardData.meta.format}
            </Text>
          </Fragment>
        )}
        {Boolean(_.get(cardData, 'meta.collectionCount')) && (
          <Fragment>
            <Text type='body-medium' color='content-color-secondary'>
              {cardData.meta.collectionCount}
              {PluralizeHelper.pluralize({
                count: cardData.meta.collectionCount,
                singular: ' Collection',
                plural: ' Collections'
              })}
              <Middot />
            </Text>
          </Fragment>
        )}
        {Boolean(_.get(cardData, 'meta.apiCount')) && (
          <Fragment>
            <Text type='body-medium' color='content-color-secondary'>
              {cardData.meta.apiCount}
              {PluralizeHelper.pluralize({
                count: cardData.meta.apiCount,
                singular: ' API',
                plural: ' APIs'
              })}
            </Text>
          </Fragment>
        )}
      </Flex>
      <Flex direction='row' alignItems='center'>
        {_.get(cardData, 'description') && (
          <Text type='para' color='content-color-secondary' className='card-description'>
            <span title={cardData.description}>{cardData.description}</span>
          </Text>
        )}
      </Flex>
      <Flex direction='row' justifyContent='space-between' alignItems='center' className='card-footer'>
        <Flex direction='row' alignItems='center' className='card-footer-stats'>
          {Boolean(_.get(cardData, 'meta.views')) && (
            <Fragment>
              <Icon
                name='icon-action-view-stroke-small'
                color='content-color-secondary'
                size='small'
                className={'card-footer__view-icon'}
              />
              <Text type='body-medium' color='content-color-primary'>
                {number.convertToUserFriendlyMetric(cardData.meta.views)}
              </Text>
            </Fragment>
          )}
          {Boolean(_.get(cardData, 'meta.forks')) && (
            <Fragment>
              <Icon
                name='icon-action-fork-stroke-small'
                color='content-color-secondary'
                size='small'
                className={'card-footer__fork-icon'}
              />
              <Text type='body-medium' color='content-color-primary'>
                {number.convertToUserFriendlyMetric(cardData.meta.forks)}
              </Text>
            </Fragment>
          )}
        </Flex>
      </Flex>
    </StyledExploreCard>
  );
}

ExploreCard.propTypes = {
  cardData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    publisherName: PropTypes.string,
    publisherPicUrl: PropTypes.string,
    publisherLinkData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onPublisherLinkClick: PropTypes.func,
    meta: PropTypes.shape({
      views: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      forks: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.string,
      format: PropTypes.string,
      collectionCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      apiCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    linkData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onClick: PropTypes.func
  })
};
