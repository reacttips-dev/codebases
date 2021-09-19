import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { isDesktop } from 'helpers/ClientUtils';
import { platformVisibility } from 'helpers/apsAdvertisement';
import useMartyContext from 'hooks/useMartyContext';
import { AppState } from 'types/app';

import css from 'styles/components/common/gamSlot.scss';

interface OwnProps {
  slot: string;
  slotName?: string;
  className?: string;
  forceShow?: boolean;
  deviceOverride?: string;
  slotIndex?: number;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const GamSlot = (props: Props) => {
  const { slot, isShowingThirdPartyAds, className, forceShow, slotName, slotIndex, deviceOverride } = props;
  const device = useRef<undefined | 'desktop' | 'mobile'>();
  const [shouldShowOnClient, setClientShow] = useState(false);

  const { marketplace } = useMartyContext();
  const { ads: { sourceId } } = marketplace;

  /*
  * Because want SSR and client render to match, the initial `return` will render nothing for both.
  * Once `setClientShow` fires after mount, we render the iFrame, effectively only
  * rendering it on client, without mismatch warnings. Effects only render client side.
  */
  useEffect(() => {
    setClientShow(true);
    device.current = isDesktop() ? 'desktop' : 'mobile'; // set `device` after component has been mounted
  }, []);

  const shouldRenderOnDevice = deviceOverride ? device.current === deviceOverride : device.current && platformVisibility[device.current]?.includes(slot);

  /*
  * !isShowingThirdPartyAds: ad killswitch disabled
  * !forceShow: dont force show GamSlot content
  * !sourceId: marketplace does not contain sourceId
  * !shouldRenderOnDevice: if slot is designed for specific platform
  */

  if ((!isShowingThirdPartyAds && !forceShow) || !sourceId || !shouldRenderOnDevice) {
    return null;
  }

  if (shouldShowOnClient) {
    return (
      <div
        className={cn(css.container, className)}
        id={slot}
        data-slot-id={slotName}
        data-slotindex={slotIndex} />
    );
  }
  return null;
};

export const mapStateToProps = (state: AppState) => {
  const { killswitch: { isShowingThirdPartyAds } } = state;

  return {
    isShowingThirdPartyAds
  };
};

const connector = connect(mapStateToProps);
const ConnectedGamSlot = connector(GamSlot);
export default withErrorBoundary('GamSlot', ConnectedGamSlot);
