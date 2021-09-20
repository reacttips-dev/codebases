import React, { Suspense } from 'react';
import { SharedState, useSharedState } from '@trello/shared-state';
import { useDispatch } from 'react-redux';
import { useLazyComponent } from '@trello/use-lazy-component';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';

interface CreateBoardOverlayBridgeProps {
  sharedState: ReturnType<typeof getCreateBoardOverlayBridgeSharedState>;
  onClose(): void;
}

interface CreateBoardOVerlayBridgeState {
  open: boolean;
  orgId?: string;
}

export const getCreateBoardOverlayBridgeSharedState = () => {
  return new SharedState({ open: false, orgId: undefined });
};

export const CreateBoardOverlayBridge: React.FC<CreateBoardOverlayBridgeProps> = ({
  sharedState,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [{ open, orgId }] = useSharedState<CreateBoardOVerlayBridgeState>(
    sharedState,
  );

  const CreateBoardOverlay = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-board-overlay" */ 'app/gamma/src/components/overlays/create-board-overlay'
      ),

    {
      preload: open,
    },
  );

  if (!open) {
    return null;
  }

  dispatch(preloadCreateBoardData());

  return (
    <Suspense fallback={null}>
      <CreateBoardOverlay onClose={onClose} preSelectedTeamId={orgId} />
    </Suspense>
  );
};
