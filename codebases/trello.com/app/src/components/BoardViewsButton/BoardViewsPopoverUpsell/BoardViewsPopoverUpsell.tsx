import React from 'react';
import { useBoardViewsPopoverUpsell } from './useBoardViewsPopoverUpsell';
import { BoardViewsUpsellPrompt } from './BoardViewsUpsellPrompt';
interface BoardViewsPopoverRevampedProps {
  orgId?: string;
  boardId?: string;
  orgName?: string;
  isStandardOrFreeTeamBoardGuest: boolean;
  hidePopover: () => void;
}

export const BoardViewsPopoverUpsell: React.FunctionComponent<BoardViewsPopoverRevampedProps> = ({
  orgId,
  boardId,
  orgName,
  hidePopover,
  isStandardOrFreeTeamBoardGuest,
}) => {
  const { activateFreeTrial, step, isAdmin } = useBoardViewsPopoverUpsell({
    orgId,
  });
  const isUpgrade = step === 'upgrade' || isStandardOrFreeTeamBoardGuest;

  return (
    <BoardViewsUpsellPrompt
      orgName={orgName}
      isUpgrade={isUpgrade}
      isAdmin={isAdmin}
      activateFreeTrial={activateFreeTrial}
      hidePopover={hidePopover}
      orgId={orgId}
      boardId={boardId}
    />
  );
};
