import React, { useCallback } from 'react';
import { ManagedAccount } from './ManagedAccount';
import { Analytics } from '@trello/atlassian-analytics';

export enum ScreenType {
  MANAGED_ACCOUNT = 'atlassianManagedAccountModal',
}

export interface Login {
  id: string;
  email: string;
}
interface AtlassianManagedAccountOverlayProps {
  analyticsContext: object;
  analyticsContainers: object;
  id: string;
  name: string;
  orgName?: string;
  isOverlayOpen: boolean;
  dismiss: () => void;
}

export const AtlassianManagedAccountOverlay: React.FunctionComponent<AtlassianManagedAccountOverlayProps> = ({
  analyticsContext,
  analyticsContainers,
  id,
  orgName,
  isOverlayOpen,
  dismiss,
}) => {
  const onClickGotIt = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      attributes: {
        ...analyticsContext,
        screen: ScreenType.MANAGED_ACCOUNT,
      },
      source: 'atlassianManagedAccountModal',
      buttonName: 'atlassianManagedAccountOverlayGotItButton',
    });
    dismiss();
  }, [analyticsContext, dismiss]);

  const onTrackScreenEvent = useCallback(() => {
    if (isOverlayOpen) {
      Analytics.sendScreenEvent({
        name: ScreenType.MANAGED_ACCOUNT,
        attributes: analyticsContext,
        containers: analyticsContainers,
      });
    }
  }, [analyticsContainers, analyticsContext, isOverlayOpen]);

  return (
    <ManagedAccount
      id={id}
      orgName={orgName}
      onDismiss={dismiss}
      onClickGotIt={onClickGotIt}
      onTrackScreenEvent={onTrackScreenEvent}
    />
  );
};
