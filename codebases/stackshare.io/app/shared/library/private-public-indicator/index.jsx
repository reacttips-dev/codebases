import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import BlueRoundLarge from '../icons/blue-round-large.svg';
import BlueRoundSmall from '../icons/blue-round-small.svg';
import BlueRectIcon from '../icons/blue-large.svg';
import BlackRoundLarge from '../icons/black-round-large.svg';
import BlackRoundSmall from '../icons/black-round-small.svg';
import BlackRectIcon from '../icons/black-large.svg';
import GreyRectIcon from '../icons/grey-large.svg';
import GreyLockSmall from '../icons/private.svg';
import GreyWorldSmall from '../icons/public.svg';
import BlueInSyncLarge from '../icons/in-sync/blue-large.svg';
import BlueInSyncMedium from '../icons/in-sync/blue-medium.svg';
import BlueInSyncSmall from '../icons/in-sync/blue-small.svg';
import {CHARCOAL, WHITE} from '../../style/colors';
import {TOP} from '../../constants/placements';
import PopoverWithAnchor from '../popovers/base-v2';

const Container = glamorous.div(({displayInline}) => ({
  display: displayInline ? 'inline' : 'flex',
  marginLeft: 8,
  position: 'relative'
}));

const BlueRect = glamorous(BlueRectIcon)({
  display: 'block'
});

const BlackRect = glamorous(BlackRectIcon)({
  display: 'block'
});

const GreyRect = glamorous(GreyRectIcon)({
  display: 'block'
});

const PrivatePublicIndicator = ({
  typeIndicator,
  position = TOP,
  hideTooltip = false,
  displayInline = false,
  toolTipText = 'Private'
}) => {
  let isRect = false;
  let IndicatorIcon = BlueRoundLarge;
  let width = 70;

  switch (typeIndicator) {
    case 'BlueRoundLarge':
      IndicatorIcon = BlueRoundLarge;
      break;
    case 'BlueRoundSmall':
      IndicatorIcon = BlueRoundSmall;
      break;
    case 'BlackRoundLarge':
      IndicatorIcon = BlackRoundLarge;
      break;
    case 'BlackRoundSmall':
      IndicatorIcon = BlackRoundSmall;
      break;
    case 'BlueRect':
      isRect = true;
      IndicatorIcon = BlueRect;
      break;
    case 'BlackRect':
      isRect = true;
      IndicatorIcon = BlackRect;
      break;
    case 'GreyRect':
      isRect = true;
      IndicatorIcon = GreyRect;
      break;
    case 'PrivateLock':
      IndicatorIcon = GreyLockSmall;
      break;
    case 'PublicWorld':
      IndicatorIcon = GreyWorldSmall;
      toolTipText = 'Public Post';
      break;
    case 'BlueInSyncLarge':
      IndicatorIcon = BlueInSyncLarge;
      break;
    case 'BlueInSyncMedium':
      IndicatorIcon = BlueInSyncMedium;
      break;
    case 'BlueInSyncSmall':
      IndicatorIcon = BlueInSyncSmall;
      break;
    default:
      break;
  }

  return (
    <>
      {!hideTooltip && !displayInline && !isRect ? (
        <PopoverWithAnchor
          customStyle={{backgroundColor: CHARCOAL, color: WHITE}}
          width={width}
          arrowColor={CHARCOAL}
          padding={10}
          placement={position}
          activateMode="hover"
          hidden={true}
          anchor={
            <Container>
              <IndicatorIcon />
            </Container>
          }
        >
          {toolTipText}
        </PopoverWithAnchor>
      ) : (
        <Container displayInline={displayInline}>
          <IndicatorIcon />
        </Container>
      )}
    </>
  );
};

PrivatePublicIndicator.propTypes = {
  typeIndicator: PropTypes.string,
  hideTooltip: PropTypes.bool,
  position: PropTypes.string,
  displayInline: PropTypes.bool,
  toolTipText: PropTypes.string
};

export default PrivatePublicIndicator;
