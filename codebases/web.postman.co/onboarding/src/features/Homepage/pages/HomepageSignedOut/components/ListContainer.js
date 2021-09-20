import React, { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import classnames from 'classnames';
import { Text, Heading, Flex, Icon, ResponsiveContainer, Badge } from '@postman/aether';

import Link from '../../../../../../../appsdk/components/link/Link';

import { Tooltip, TooltipBody } from '../../../../../../../js/components/base/Tooltips';
import number from '../../../../../../../apinetwork/utils/number';
import ThemeManager from '../../../../../../../js/controllers/theme/ThemeManager';
import AnalyticsService from '../../../../../../../js/modules/services/AnalyticsService';
import NavigationService from '../../../../../../../js/services/NavigationService';
import { TEAM } from '../../../HomepageConstants';
import { OPEN_EXPLORE_CURATED_LIST_IDENTIFIER } from '../../../../../../../apinetwork/navigation/constants';

import Avatar from '../../../../../../../js/components/base/Avatar';

import Middot from './Middot';

const BADGE_MAP = {
  'api': 'warning',
  'collection': 'info',
  'workspace': 'critical'
},
TAG_MAP = {
  'FEATURED': { icon: 'icon-descriptive-featured-stroke', color: 'content-color-warning', text: 'Featured' }
},
StyledListContainer = styled.div`
  & ul {
    padding-left:  var(--spacing-zero);
    margin-top: var(--spacing-s);
  }

  header {
    margin-top: var(--spacing-xxl);
    margin-bottom: var(--spacing-l);
    min-height: 68px;

    & h2 {
      margin-bottom: var(--spacing-xs);
    }
  }
`,
StyledListItem = styled(Flex)`
  padding: var(--spacing-l)  var(--spacing-zero);
  &:hover {
    background: var(--background-color-secondary);
  }

  &.light-theme {
    box-shadow: inset 0px -1px 0px var(--grey-30);
  }

  &.dark-theme {
    box-shadow: inset 0px -1px 0px var(--grey-70);
  }

  &.item-first {
    &.light-theme {
      box-shadow:inset 0px -1px 0px var(--grey-30), inset 0px 1px 0px var(--grey-30);
    }

    &.dark-theme {
      box-shadow:inset 0px -1px 0px var(--grey-70), inset 0px 1px 0px var(--grey-70);
    }
  }

  .list {
    &-img-container {
      display: flex;
      background-color: var(--background-color-secondary);
      padding: auto var(--spacing-xs);
      border-radius: var(--border-radius-default);
      width: 40px;
      height: 40px;

      img {
        object-fit: contain;
        padding: var(--spacing-xs);
        width: var(--size-m);
        height: var(--size-m);
      }

      span {
        object-fit: contain;
        margin: var(--spacing-xs);
      }

      i {
        padding: var(--spacing-m);
      }
    }

    &-title {
      margin-bottom: var(--spacing-xs);
    }

    /* overriding default flex component styles */
    &-info > *:not(:last-child) {
      margin-right: var(--spacing-s);
    }

    &-description {
      margin: var(--spacing-xs) 0 var(--spacing-m);
      height: 40px;
      overflow: hidden;
      /* multi-line truncate */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &-stats {
      margin: var(--spacing-xs)  var(--spacing-zero);
      height: 20px;
    }

    &-badge {
      padding: 0px var(--spacing-xs);
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

`;

const ListItem = ({
    className,
    customClassName,
    logoUrl,
    teamUrl,
    name,
    creator,
    updatedAt,
    versions,
    description,
    stats,
    entityType,
    publisherType,
    publisherId,
    isMixedEntityList,
    tags
  }) => {
  const { watchers, forks, views } = stats,
    [showTooltip, setShowTooltip] = useState(false),
    tagRef = useRef(null);
  return (
    <StyledListItem gap='spacing-l' className={classnames(customClassName, className)}>
      <Flex hiddenFor={['mobile', 'tablet']}>
        <Link to={teamUrl} className='list-img-container'>
          { logoUrl ? <img alt={`${creator} logo`} src={logoUrl} loading='lazy' /> :
            (publisherType === TEAM ? <Icon name='icon-descriptive-team-stroke' color='content-color-primary' /> :
            <Avatar userId={publisherId} />) }
        </Link>
      </Flex>
      <Flex
        alignItems='center'
        justifyContent='space-between'
        width='100%'
        shrink='1'
      >
        <div>
          <ResponsiveContainer
            hiddenFor={['computer']}
            margin={{ marginBottom: 'spacing-l' }}
          >
            <Link to={teamUrl} className='list-img-container'>
              { logoUrl ? <img alt={`${creator} logo`} src={logoUrl} loading='lazy' /> :
                (publisherType === TEAM ? <Icon name='icon-descriptive-team-stroke' color='content-color-primary' /> :
                  <Avatar userId={publisherId} />) }
            </Link>
          </ResponsiveContainer>
          <Flex alignItems='center' gap='spacing-s' className='list-title'>
            <Heading type='h3' styleAs='h4' text={name} />
            {tags.length > 0 &&
              tags.map((tag) => (
                <span
                  ref={tagRef}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  key={tag.entity}
                  title='Featured'
                >
                  <Icon
                    name={_.get(TAG_MAP, [tag.name, 'icon'])}
                    color={_.get(TAG_MAP, [tag.name, 'color'])}
                    size='large'
                  />
                  <Tooltip
                    show={showTooltip}
                    target={tagRef.current}
                    placement='bottom'
                  >
                    <TooltipBody>
                      {_.get(TAG_MAP, [tag.name, 'text'])}
                    </TooltipBody>
                  </Tooltip>
                </span>
              ))
            }
            {isMixedEntityList && <Badge status={_.get(BADGE_MAP, 'cardData.type')} text={entityType} className={`list-badge list-badge__${entityType}`} />}
          </Flex>
          <Flex direction='row' gap='spacing-m' alignItems='center' className='list-info'>
            {Boolean(creator) && (
              <Text type='body-medium' color='content-color-secondary'>
                <Link to={teamUrl}>{creator}</Link>
              </Text>
            )}
            {Boolean(updatedAt) && (
              <Fragment>
                <Middot />
                <Text type='body-medium' color='content-color-secondary'>
                  {/* Always show absolute date */}
                  Updated on {moment(updatedAt).format('D MMM, YYYY')}
                </Text>
              </Fragment>
            )}
            {Boolean(versions) && (
              <Fragment>
                <Middot />
                <Text type='body-medium' color='content-color-secondary'>
                  {number.convertToUserFriendlyMetric(versions)} versions
                </Text>
              </Fragment>
            )}
          </Flex>
          <Flex direction='row' gap='spacing-m' className='list-description'>
            {Boolean(description) && (
              <Text
                type='body-medium'
                color='content-color-secondary'
              >
                {description}
              </Text>
            )}
          </Flex>
          <Flex
            className='list-stats'
            direction='row'
            gap='spacing-m'
            alignItems='center'
          >
            {Boolean(forks) && (
              <Flex alignItems='center' gap='spacing-xs'>
                <Icon
                  name='icon-action-fork-stroke'
                  color='content-color-secondary'
                />
                <Text type='body-medium' color='content-color-secondary'>
                  {number.convertToUserFriendlyMetric(forks)} forks
                </Text>
              </Flex>
            )}
            {Boolean(watchers) && (
              <Flex alignItems='center' gap='spacing-xs'>
                <Icon
                  name='icon-action-view-stroke'
                  color='content-color-secondary'
                />
                <Text type='body-medium' color='content-color-secondary'>
                  {number.convertToUserFriendlyMetric(watchers)} watchers
                </Text>
              </Flex>
            )}
            {Boolean(views) && (
              <Flex alignItems='center' gap='spacing-xs'>
                <Icon
                  name='icon-action-view-stroke'
                  color='content-color-secondary'
                />
                <Text type='body-medium' color='content-color-secondary'>
                  {number.convertToUserFriendlyMetric(views)} views
                </Text>
              </Flex>
            )}
          </Flex>
        </div>
        <Icon name='icon-direction-right-large' color='content-color-secondary' />
      </Flex>
    </StyledListItem>
  );
};

const ListContainer = ({ title, description, items, redirectTo, traceId, entityId, entityType, isMixedEntityList }) => {
  const currentTheme = ThemeManager.getCurrentTheme(),
    captureViewListClickEvent = (e, listName, slug) => {
      AnalyticsService.addEventV2AndPublish({
        category: 'home',
        action: 'click',
        label: `${listName}-complete`,
        value: 1,
        traceId
      });

      // Case when click is done with Cmd or Ctrl key.
      if ((e.metaKey || e.ctrlKey)) {
        return;
      }

      e.preventDefault();
      NavigationService.transitionTo(OPEN_EXPLORE_CURATED_LIST_IDENTIFIER, {
        slug: slug
      });
    },
    captureEntityClickEvent = (e, entityId, entityType, listName, redirectURL) => {
      AnalyticsService.addEventV2AndPublish({
        category: 'home',
        action: 'click',
        label: `${listName}-preview`,
        entityId,
        entityType,
        value: 1,
        traceId
      });

      // Case when click is done with Cmd or Ctrl key.
      if ((e.metaKey || e.ctrlKey)) {
        return;
      }

      e.preventDefault();
      NavigationService.openURL(redirectURL);
    };

  return (
    <StyledListContainer>
      <Flex alignItems='center' justifyContent='space-between'>
        <header>
          <Heading
            type='h2'
            styleAs='h3'
            text={title}
          />
          <Text type='body-medium' color='content-color-secondary'>
            {description}
            {' '}
            <Link to={`${window.postman_explore_redirect_url}/${redirectTo}`} onClick={(e) => captureViewListClickEvent(e, title, redirectTo)}>
              <Text type='link-primary'>
                View Complete List &rarr;
              </Text>
            </Link>
          </Text>
        </header>
      </Flex>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <Link to={item.redirectURL} onClick={(e) => captureEntityClickEvent(e, item.entityId, item.entityType, title, item.redirectURL)}>
              <ListItem {...item}
                publisherType={item.publisherType}
                publisherId={item.publisherId}
                customClassName={classnames(`${currentTheme}-theme`, { ['item-first']: index === 0 })}
                isMixedEntityList={isMixedEntityList}
              />
            </Link>
          </li>
        ))}
      </ul>
    </StyledListContainer>
  );
};


ListItem.propTypes = {
  customClassName: PropTypes.string,
  creator: PropTypes.string,
  description: PropTypes.string,
  logoUrl: PropTypes.string,
  name: PropTypes.string,
  stats: PropTypes.shape({
    forks: PropTypes.number,
    views: PropTypes.number,
    watchers: PropTypes.number
  }),
  updatedAt: PropTypes.string,
  versions: PropTypes.number,
  isMixedEntityList: PropTypes.bool
};

ListContainer.propTypes = {
  description: PropTypes.string,
  items: PropTypes.array,
  title: PropTypes.string,
  redirectTo: PropTypes.string,
  entityId: PropTypes.string,
  entityType: PropTypes.string,
  isMixedEntityList: PropTypes.bool,

  // client analytics
  traceId: PropTypes.string
};


export default ListContainer;
