import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import CtaButton from '../base/cta';
import {grid} from '../../../utils/grid';
import VendorInfoIcon from '../../icons/vendor-icon.svg';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
import {AD_SHOWN, RARE_CLICK} from '../../../constants/analytics';
import useTrackAdClick, {BE_AD_CLICK} from '../../../utils/hooks/track-ad-click';

const StyledVendorInfoIcon = glamorous(VendorInfoIcon)({
  height: 18,
  width: 18
});

const Container = glamorous.div(({minimal}) => {
  const padding = minimal ? 5 : grid(2);
  const width = minimal ? 'auto' : '100%';
  const margin = minimal ? '3px 0 0 0' : '0 auto';
  return {
    maxWidth: 225,
    margin,
    width,
    ' > button': {
      width,
      margin: 'auto',
      paddingLeft: padding,
      paddingRight: padding
    }
  };
});

const StyledCtaButton = glamorous(CtaButton)({
  height: 'auto',
  lineHeight: '20px',
  minHeight: 32
});

const ContactVendorButton = ({
  sendAnalyticsEvent,
  analyticsData = {},
  minimal = false,
  text,
  onClick
}) => {
  const trackAdClick = useTrackAdClick();
  const buttonText = !minimal ? text : '';
  const analyticsPayload = {
    ...analyticsData,
    sponsor: {...analyticsData.sponsor, text: buttonText}
  };

  useEffect(() => {
    if (!minimal) {
      sendAnalyticsEvent(AD_SHOWN, analyticsPayload);
    }
  }, []);

  return (
    <Container
      minimal={minimal}
      onClick={() => {
        sendAnalyticsEvent(RARE_CLICK, analyticsPayload);
        trackAdClick(BE_AD_CLICK, {
          ...analyticsData,
          sponsor: {...analyticsData.sponsor, text: !minimal ? text : ''}
        });
        if (onClick) {
          onClick();
        }
      }}
    >
      <StyledCtaButton>
        {minimal && <StyledVendorInfoIcon />}
        {buttonText}
      </StyledCtaButton>
    </Container>
  );
};

ContactVendorButton.propTypes = {
  sendAnalyticsEvent: PropTypes.func,
  minimal: PropTypes.bool,
  text: PropTypes.string,
  analyticsData: PropTypes.object,
  onClick: PropTypes.func
};

export default withSendAnalyticsEvent(ContactVendorButton);
