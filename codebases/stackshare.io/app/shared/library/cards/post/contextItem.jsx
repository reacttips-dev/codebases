import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import DefaultCompanyIcon from '../../../../bundles/feed/components/icons/default-company-icon.svg';
import DefaultStackIcon from '../../icons/default-stack-icon.svg';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {GUNSMOKE, CONCRETE, CHARCOAL, SHADOW} from '../../../style/colors';
import {CONTEXT_ITEM_TYPE_COMPANY} from './constants';
import {
  FEED_CLICK_CARD_COMPANY,
  FEED_CLICK_CARD_STACK
} from '../../../../bundles/feed/constants/analytics';
import LazyLoadImage from '../../../utils/lazy-loading-images';

const DefaultCompanyLogo = glamorous(DefaultCompanyIcon)({
  width: 22,
  height: 22,
  '> g > path': {
    fill: CHARCOAL
  }
});

const DefaultStackLogo = glamorous(DefaultStackIcon)({
  width: 22,
  height: 22,
  borderRadius: 3.1,
  border: `1px solid ${CONCRETE}`
});

const Paranthesis = glamorous.span(
  {
    ...BASE_TEXT,
    fontSize: 14,
    color: GUNSMOKE
  },
  ({open = false}) => ({
    marginRight: open ? 3 : 0,
    marginLeft: !open ? 3 : 0
  })
);

const ContextItem = glamorous.a({
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  marginRight: 0,
  ' > div:last-of-type': {
    marginRight: 0
  }
});

const ContextItemLogo = glamorous.img({
  border: `1px solid ${CONCRETE}`,
  height: 22,
  width: 22,
  borderRadius: 3.1
});

const ContextItemName = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  fontWeight: WEIGHT.BOLD,
  color: SHADOW,
  marginRight: 7,
  marginLeft: 7
});

const ContextItemCard = ({
  item: {imageUrl, name, id},
  link,
  type,
  paranthesis = false,
  sendAnalyticsEvent,
  lazyLoad = true
}) => {
  const isCompanyItem = type === CONTEXT_ITEM_TYPE_COMPANY;
  return (
    <Fragment>
      {paranthesis ? <Paranthesis open={true}>(</Paranthesis> : ''}
      <ContextItem
        itemScope
        itemType="http://schema.org/Organization"
        itemProp="url"
        href={link}
        target="_blank"
        onClick={() => {
          const clickEvent = isCompanyItem ? FEED_CLICK_CARD_COMPANY : FEED_CLICK_CARD_STACK;
          sendAnalyticsEvent(clickEvent, {
            [`${type}Name`]: name,
            [`${type}Id`]: id
          });
        }}
      >
        {imageUrl !== null &&
          (lazyLoad ? (
            <LazyLoadImage>
              <ContextItemLogo itemProp="logo" src={imageUrl} alt={`Logo of ${name}`} />
            </LazyLoadImage>
          ) : (
            <ContextItemLogo itemProp="logo" src={imageUrl} alt={`Logo of ${name}`} />
          ))}
        {imageUrl === null && (isCompanyItem ? <DefaultCompanyLogo /> : <DefaultStackLogo />)}
        <ContextItemName itemProp="name">{name}</ContextItemName>
      </ContextItem>
      {paranthesis ? <Paranthesis>)</Paranthesis> : ''}
    </Fragment>
  );
};

ContextItemCard.propTypes = {
  sendAnalyticsEvent: PropTypes.func,
  item: PropTypes.object,
  link: PropTypes.string,
  type: PropTypes.string,
  paranthesis: PropTypes.bool,
  lazyLoad: PropTypes.bool
};

export default withSendAnalyticsEvent(ContextItemCard);
