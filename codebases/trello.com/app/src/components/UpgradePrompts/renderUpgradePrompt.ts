import { Auth } from 'app/scripts/db/auth';
import { renderComponent } from 'app/src/components/ComponentWrapper';
import React from 'react';
import ReactDOM from '@trello/react-dom-wrapper';
import { dontUpsell } from '@trello/browser';

interface RenderFunction {
  (args: {
    // Will dismiss the message and unmount the component
    dismiss: () => void;
  }): React.ReactChild;
}

interface UnmountFunction {
  // Returns the result of ReactDOM.unmountComponentAtNode
  (): boolean;
}

export interface BackboneOrganizationModel {
  isPremium: () => boolean;
  isEnterprise: () => boolean;
}

export interface BackboneBoardModel {
  getOrganization: () => BackboneOrganizationModel | undefined;
}

export const renderUpgradePrompt = (
  renderFunc: RenderFunction | React.ReactChild,
  container: HTMLElement,
  props: {
    boardModel?: BackboneBoardModel;
    extraCondition?: () => boolean;
    orgModel?: BackboneOrganizationModel;
    promptID?: string;
    allowUpsell?: boolean;
  } = {},
  forceShow?: boolean,
): UnmountFunction => {
  const {
    boardModel,
    extraCondition = () => true,
    orgModel,
    promptID,
    allowUpsell,
  } = props;

  const me = Auth.me();
  const isPromptDismissed = promptID ? me.isDismissed(promptID) : false;
  const org = orgModel || (boardModel && boardModel.getOrganization());
  const isFreeTeam = org ? !org.isPremium() && !org.isEnterprise() : false;
  const hasPaidOrgPowerUps = me.hasPaidOrgPowerUps();

  const shouldShowUpgradePrompt =
    (!dontUpsell() || allowUpsell) &&
    !isPromptDismissed &&
    isFreeTeam &&
    !hasPaidOrgPowerUps &&
    extraCondition();

  const unmount: UnmountFunction = () =>
    !!container && ReactDOM.unmountComponentAtNode(container);

  const dismiss = () => {
    if (promptID) {
      me.dismiss(promptID);
    }

    unmount();
  };

  const component =
    typeof renderFunc === 'function' ? renderFunc({ dismiss }) : renderFunc;

  if (container && (shouldShowUpgradePrompt || forceShow)) {
    renderComponent(component, container);
  } else {
    unmount();
  }

  return unmount;
};
