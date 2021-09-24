import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CATHEDRAL, CHARCOAL, CONCRETE, WHITE} from '../../../style/colors';
import {FOCUS_BLUE} from '../../../style/colors';
import {BASE_TEXT, FONT_FAMILY, WEIGHT} from '../../../style/typography';
import {reduceLayers} from '../../../utils/reducers';
import {useSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {truncateText} from '../../../utils/truncate-text';
import OpenSourceIcon from '../../icons/open-source-icon.svg';
import WebsiteIcon from '../../links/website-icon.svg';
import PrivatePublicIndicator from '../../private-public-indicator';

const Card = glamorous.a({
  width: '100%',
  height: 200,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  background: WHITE,
  '& .title': {
    border: `1px solid ${ASH}`,
    borderTopWidth: 0
  },
  ':hover': {
    boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.31)',
    ' > a': {
      display: 'block'
    }
  },
  textDecoration: 'none'
});

const Link = glamorous.a({
  display: 'none',
  position: 'absolute',
  top: '15px',
  right: '15px',
  padding: '0 0px 0 15px',
  backgroundColor: CHARCOAL,
  '> svg': {
    width: '15px',
    height: '15px',
    backgroundColor: CHARCOAL
  },
  '> svg path': {
    fill: FOCUS_BLUE
  }
});

const Title = glamorous.div('title', {
  fontFamily: FONT_FAMILY,
  fontWeight: WEIGHT.BOLD,
  fontSize: 13,
  lineHeight: '18px',
  color: CATHEDRAL,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  width: 'calc(100% - 20px)',
  paddingLeft: 10,
  paddingRight: 10,
  textAlign: 'center',
  boxSizing: 'content-box',
  borderBottomRightRadius: 2,
  borderBottomLeftRadius: 2
});

const Count = glamorous.div({
  fontFamily: FONT_FAMILY,
  fontWeight: WEIGHT.BOLD,
  marginTop: 2,
  color: CONCRETE,
  fontSize: 11,
  textTransform: 'uppercase'
});

const Services = glamorous.div({
  borderTopRightRadius: 2,
  borderTopLeftRadius: 2,
  height: 150,
  width: '100%',
  backgroundColor: CHARCOAL,
  position: 'relative'
});

const MicroThumbList = glamorous.div({
  height: 15,
  display: 'flex',
  paddingBottom: 5
});

const MicroThumb = glamorous.img({
  width: 15,
  height: 15,
  marginLeft: 8.35,
  marginBottom: 0
});

const LayerMicroLabel = glamorous.div({
  ...BASE_TEXT,
  fontSize: 4,
  color: WHITE,
  textTransform: 'uppercase',
  marginLeft: 10,
  marginTop: 5,
  marginBottom: 4
});

const PrivPubContainer = glamorous.div(
  {
    position: 'absolute',
    top: -7,
    zIndex: 1
  },
  ({rightPosition}) => ({
    right: rightPosition
  })
);

const InSyncContainer = glamorous.div({
  position: 'absolute',
  top: -7,
  right: 7,
  zIndex: 1
});

const StackCard = ({name, count, onClick, services, path, websiteUrl, isPrivate, repoStack}) => {
  const wordsToRemove = /https|http|www$/;
  const minOneChar = /^(?=.*[a-zA-Z0-9])/;
  const validateURL = url => minOneChar.test(url.replace(wordsToRemove, ''));

  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const layers = reduceLayers(services);
  const {applicationAndData, utilities, devops, businessTools} = layers;
  return (
    <Card
      onClick={event => {
        sendAnalyticsEvent('click_stackCard', {title: name, stack_url: path});
        onClick && onClick(event);
      }}
      title={name}
      href={path}
    >
      {isPrivate && (
        <PrivPubContainer rightPosition={repoStack ? 30 : 7}>
          <PrivatePublicIndicator typeIndicator="BlueRoundLarge" />
        </PrivPubContainer>
      )}
      {repoStack && (
        <InSyncContainer>
          <PrivatePublicIndicator typeIndicator="BlueInSyncMedium" toolTipText="In Sync" />
        </InSyncContainer>
      )}
      <Services>
        {applicationAndData.length > 0 && (
          <>
            <LayerMicroLabel>application and data</LayerMicroLabel>
            <MicroThumbList>
              {applicationAndData.slice(0, 8).map(s => (
                <MicroThumb key={s.id} src={s.imageUrl} />
              ))}
            </MicroThumbList>
          </>
        )}
        {utilities.length > 0 && (
          <>
            <LayerMicroLabel>utilities</LayerMicroLabel>
            <MicroThumbList>
              {utilities.slice(0, 8).map(s => (
                <MicroThumb key={s.id} src={s.imageUrl} />
              ))}
            </MicroThumbList>
          </>
        )}
        {devops.length > 0 && (
          <>
            <LayerMicroLabel>devops</LayerMicroLabel>
            <MicroThumbList>
              {devops.slice(0, 8).map(s => (
                <MicroThumb key={s.id} src={s.imageUrl} />
              ))}
            </MicroThumbList>
          </>
        )}
        {businessTools.length > 0 && (
          <>
            <LayerMicroLabel>business tools</LayerMicroLabel>
            <MicroThumbList>
              {businessTools.slice(0, 8).map(s => (
                <MicroThumb key={s.id} src={s.imageUrl} />
              ))}
            </MicroThumbList>
          </>
        )}
      </Services>
      <Title>
        {truncateText(name, 27, '...')}
        <Count>
          {count} tool{count === 1 ? '' : 's'}
        </Count>
      </Title>
      {websiteUrl && validateURL(websiteUrl) && (
        <Link
          href={websiteUrl}
          title={websiteUrl.includes('github') ? 'Visit Repo' : 'Visit Website'}
          target="_blank"
        >
          {websiteUrl.includes('github') ? <OpenSourceIcon /> : <WebsiteIcon />}
        </Link>
      )}
    </Card>
  );
};

StackCard.propTypes = {
  name: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  services: PropTypes.array.isRequired,
  path: PropTypes.string,
  websiteUrl: PropTypes.string,
  isPrivate: PropTypes.bool,
  repoStack: PropTypes.bool
};

export default StackCard;
