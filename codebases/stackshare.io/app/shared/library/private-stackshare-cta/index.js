import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import DefaultGithubAzureOverlapIcon from '../../../shared/library/icons/github-azure-overlap.svg';
import DefaultCloseIcon from '../../../shared/library/icons/close.svg';
import {PHONE} from '../../../shared/style/breakpoints';
import {BLACK, ASH, WHITE, GUNSMOKE} from '../../../shared/style/colors';
import {BASE_TEXT, WEIGHT} from '../../style/typography.js';
import SimpleButton from '../../../shared/library/buttons/base/simple';
import {useSendAnalyticsEvent} from '../../../shared/enhancers/analytics-enhancer';
import {compose} from 'react-apollo';
import {withLocalStorage} from '../../../shared/enhancers/local-storage-enhancer';

const GithubAzureOverlap = glamorous(DefaultGithubAzureOverlapIcon)({
  width: 135,
  pointerEvents: 'none',
  [PHONE]: {
    display: 'none'
  }
});

const Container = glamorous.div({
  height: 95,
  display: 'flex',
  background: WHITE,
  border: `1px solid ${ASH}`,
  position: 'relative',
  borderRadius: 4,
  margin: '0 0 22px 0',
  padding: '0 30px 0 10px',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 1,
  [PHONE]: {
    height: 60,
    padding: '5px 10px',
    margin: 10
  },
  ':hover > svg': {
    '> g': {
      fill: GUNSMOKE,
      stroke: GUNSMOKE
    }
  }
});

const Heading = glamorous.p({
  ...BASE_TEXT,
  fontSize: '17px',
  fontWeight: WEIGHT.BOLD,
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: '1.53',
  color: BLACK,
  margin: '0 20px',
  marginBottom: 0,
  [PHONE]: {
    margin: 0,
    fontSize: '10px'
  }
});

const Title = glamorous.p({
  ...BASE_TEXT,
  fontSize: 14,
  fontWeight: WEIGHT.NORMAL,
  fontStretch: 'normal',
  fontStyle: 'normal',
  lineHeight: 1.43,
  color: '#8d8d8d',
  margin: '0 20px',
  marginBottom: 0,
  [PHONE]: {
    margin: '2px 0 5px',
    fontSize: '10px'
  }
});

const IconWithText = glamorous.div({
  display: 'flex',
  background: WHITE,
  [PHONE]: {
    alignItems: 'center'
  }
});

const Text = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column'
});

const Button = glamorous(SimpleButton)({
  minWidth: 115,
  width: 115,
  height: 40,
  letterSpacing: 'normal',
  [PHONE]: {
    height: 20,
    width: 70,
    minWidth: 70,
    padding: 0,
    fontSize: 10,
    position: 'absolute',
    bottom: 5,
    right: 5
  }
});

const CloseIcon = glamorous(DefaultCloseIcon)({
  cursor: 'pointer',
  position: 'absolute',
  top: 8,
  right: 8,
  height: 10,
  width: 10,
  [PHONE]: {
    top: 5,
    right: 5,
    height: 7,
    width: 7,
    '> g': {
      fill: GUNSMOKE,
      stroke: GUNSMOKE
    }
  }
});

const PrivateStackShareCta = ({title, pageName, storageProvider}) => {
  const [showCTA, setShowCTA] = useState(false);
  const sendAnalyticsEvent = useSendAnalyticsEvent();

  const CTA_SEEN = `${pageName}PrivateStackShareCTA`;

  const handleDismissNotice = () => {
    setShowCTA(false);
    storageProvider.setItem(CTA_SEEN, true);
  };

  useEffect(() => {
    if (!storageProvider.getBoolean(CTA_SEEN)) {
      setShowCTA(true);
    }
  }, []);

  const goToPrivateLandingPage = () => {
    sendAnalyticsEvent('private_landing_cta', {pageName: pageName});
    window.location = '/private';
  };

  return (
    showCTA && (
      <Container>
        <CloseIcon onClick={handleDismissNotice} />
        <IconWithText>
          <GithubAzureOverlap />
          <Text>
            <Heading>🔒 Introducing Private Stackshare</Heading>
            <Title>{title}</Title>
          </Text>
        </IconWithText>
        <Button onClick={goToPrivateLandingPage}>Learn More</Button>
      </Container>
    )
  );
};

PrivateStackShareCta.propTypes = {
  title: PropTypes.string,
  pageName: PropTypes.string,
  storageProvider: PropTypes.object
};

export default compose(withLocalStorage('Private StackShare CTA', '1'))(PrivateStackShareCta);
