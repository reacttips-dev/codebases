/* eslint-disable import/no-default-export */
import React, { Suspense } from 'react';

import { connect } from 'react-redux';

import {
  OverlayType,
  OverlayContext,
} from 'app/gamma/src/modules/state/ui/overlay';
import { State } from 'app/gamma/src/modules/types';
import {
  getActiveOverlay,
  getOverlayContext,
  getCreateBoardOverlayLegacyTrackingOptions,
  getPreSelectedTeamId,
} from 'app/gamma/src/selectors/overlays';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ReduxProvider } from 'app/src/components/ReduxProvider';
import { SnowplowTrackingOptions } from 'app/gamma/src/components/create-board/props';

interface OverlaysProps {
  overlay: string | null;
  trackingOpts?: SnowplowTrackingOptions;
  preSelectedTeamId?: string;
  context: OverlayContext;
}

const mapStateToProps = (state: State) => {
  return {
    overlay: getActiveOverlay(state),
    context: getOverlayContext(state),
    trackingOpts: getCreateBoardOverlayLegacyTrackingOptions(state),
    preSelectedTeamId: getPreSelectedTeamId(state),
  };
};

const Overlays = ({
  overlay,
  trackingOpts,
  preSelectedTeamId,
  context,
}: OverlaysProps) => {
  let component;

  const PlanSelectionOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "plan-selection-overlay" */ './plan-selection-overlay'
      ),
    {
      preload: false,
    },
  );

  switch (overlay) {
    case OverlayType.PlanSelection:
      component = context?.orgId && (
        <PlanSelectionOverlay orgId={context?.orgId} />
      );
      break;
    default:
      component = null;
  }

  return <Suspense fallback={null}>{component}</Suspense>;
};

const Connected = connect(mapStateToProps)(Overlays);

const WithReduxProvider = () => {
  return (
    <ReduxProvider>
      <Connected />
    </ReduxProvider>
  );
};

export default WithReduxProvider;
