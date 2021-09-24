import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import DesktopImage from './images/snowflake_desktop.svg';
import MobileImage from './images/snowflake_mobile.svg';
import CloseIcon from '../../../../shared/library/icons/close.svg';
import {PAGE_WIDTH} from '../../../../shared/style/dimensions';
import {grid} from '../../../../shared/utils/grid';
import {ASH, WHITE} from '../../../../shared/style/colors';
import {useSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import useTrackAdClick, {BE_BANNER_CLICK} from '../../../../shared/utils/hooks/track-ad-click';

const Z_INDEX = 1000;
const Z_DISMISS = 1001;

const Wrapper = glamorous.aside();

const Banner = glamorous.div(
  {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    zIndex: Z_INDEX,
    backgroundColor: '#50A8D8',
    borderBottom: `1px solid ${ASH}`,
    boxShadow: `0 1px 0 0 ${ASH}`,
    paddingTop: 7.6
  },
  ({height}) => ({height})
);

const ImageWrapper = glamorous.div(
  {
    width: '100%',
    maxWidth: PAGE_WIDTH,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    margin: '0 auto'
  },
  ({height}) => ({height})
);

const Link = glamorous.a({
  textDecoration: 'none',
  cursor: 'pointer'
});

const Dismiss = glamorous.div(
  {
    position: 'absolute',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    right: grid(1),
    padding: grid(1),
    zIndex: Z_DISMISS,
    '> svg > g': {
      stroke: WHITE,
      fill: WHITE
    }
  },
  ({height}) => ({
    top: height > 40 ? grid(1) : grid(0.5)
  })
);

const CloseIconColor = glamorous(CloseIcon)({
  ' > g': {
    fill: `${WHITE} !important`,
    stroke: `${WHITE} !important`
  }
});

const Notice = ({onDismiss, mobile}) => {
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const trackAdClick = useTrackAdClick();
  const height = mobile ? 85 : 45;
  const currentNoticeUrl =
    'https://www.snowflake.com/build/?utm_source=stackshare&utm_medium=referral&utm_campaign=na-us-en-build-summit-stackshare-sitewide-banner';

  sendAnalyticsEvent('banner_shown', {url: currentNoticeUrl});
  return (
    <Wrapper>
      <Banner height={height}>
        <ImageWrapper height={height}>
          <Link
            height={height}
            onClick={() => {
              window.open(currentNoticeUrl, '_blank');
              trackAdClick(BE_BANNER_CLICK, {url: currentNoticeUrl});
              sendAnalyticsEvent('banner_click', {url: currentNoticeUrl});
            }}
            rel="noopener noreferrer"
          >
            {mobile ? <MobileImage /> : <DesktopImage />}
          </Link>
        </ImageWrapper>
        <Dismiss onClick={onDismiss} height={height}>
          <CloseIconColor />
        </Dismiss>
      </Banner>
    </Wrapper>
  );
};

Notice.propTypes = {
  onDismiss: PropTypes.func,
  mobile: PropTypes.bool
};

export default Notice;
