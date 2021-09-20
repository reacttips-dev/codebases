import React from 'react';
import ReactDOM from '@trello/react-dom-wrapper';
import { renderComponent } from 'app/src/components/ComponentWrapper';
import { LazyFreeTeamOnboardingPupPopover } from 'app/src/components/FreeTeamOnboardingPupPopover';
import { LazyButlerPopover } from 'app/src/components/FreeTeamOnboardingButlerPopover';

export function unmountGettingStartedTip() {
  const targetDiv = document.querySelector('#getting-started-tip-target');
  if (targetDiv !== null) {
    return ReactDOM.unmountComponentAtNode(targetDiv);
  }
}

export function renderGettingStartedTip(tipName: 'butler' | 'pups') {
  let targetDiv = document.querySelector('#getting-started-tip-target');

  if (!targetDiv) {
    const el = document.createElement('div');
    const elId = 'getting-started-tip-target';
    el.id = elId;
    document.querySelector('.board-main-content')?.append(el);
    targetDiv = document.querySelector('#getting-started-tip-target');
  }

  const boardId = this.model.get('id');
  const org = this.model.getOrganization();

  if (!org) {
    return;
  }

  const orgId = org.get('id');
  const orgName = org.get('name');

  if (tipName === 'butler') {
    renderComponent(<LazyButlerPopover boardId={boardId} />, targetDiv);
  } else if (tipName === 'pups') {
    renderComponent(
      <LazyFreeTeamOnboardingPupPopover
        orgId={orgId}
        boardId={boardId}
        teamName={orgName}
      />,
      targetDiv,
    );
  }
}
