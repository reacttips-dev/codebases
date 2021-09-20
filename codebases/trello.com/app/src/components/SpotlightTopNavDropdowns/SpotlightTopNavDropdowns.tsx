import React, { useCallback, useEffect } from 'react';

import { forTemplate } from '@trello/i18n';

import {
  LazySpotlightManager,
  LazySpotlightTarget,
  LazySpotlightTransition,
  LazySpotlight,
} from 'app/src/components/Onboarding';

import { useSpotlight } from 'app/src/components/WorkspaceNavigation/useSpotlight';
import { useWorkspaceSwitcherState } from 'app/src/components/WorkspaceSwitcher/useWorkspaceSwitcherState';
import { Analytics } from '@trello/atlassian-analytics';
import { useWorkspace } from '@trello/workspaces';

const format = forTemplate('sidebar_spotlight');

export const SpotlightTopNavDropdowns: React.FunctionComponent = ({
  children,
}) => {
  const [spotlightScreenState, setSpotlightScreenState] = useSpotlight();
  const [workspaceSwitcherState] = useWorkspaceSwitcherState();
  const { idWorkspace, idBoard } = useWorkspace();

  // we want to lazy load this spotlight once the spotlight series starts
  const showSpotlight = !!spotlightScreenState;
  const spotlightIndex = 2;

  useEffect(() => {
    if (
      showSpotlight &&
      spotlightScreenState?.screen === 'second-top-nav-dropdowns' &&
      idBoard
    ) {
      Analytics.sendScreenEvent({
        name: 'topNavDropdownsSpotlightModal',
        containers: {
          ...(idWorkspace ? { organization: { id: idWorkspace } } : {}),
          board: { id: idBoard },
        },
      });
    }
  }, [showSpotlight, spotlightScreenState?.screen, idWorkspace, idBoard]);

  const handleNextClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'spotlightNextButton',
      source: 'topNavDropdownsSpotlightModal',
      containers: {
        ...(idWorkspace ? { organization: { id: idWorkspace } } : {}),
        ...(idBoard ? { board: { id: idBoard } } : {}),
      },
    });
    setSpotlightScreenState({ screen: 'third-search-bar' });
  }, [setSpotlightScreenState, idWorkspace, idBoard]);

  return !showSpotlight ? (
    <>{children}</>
  ) : (
    <LazySpotlightManager>
      <LazySpotlightTarget name="topNavDropdownsSpotlight">
        {children}
      </LazySpotlightTarget>
      <LazySpotlightTransition>
        {spotlightScreenState?.screen === 'second-top-nav-dropdowns' ? (
          <LazySpotlight
            actions={[
              {
                onClick: handleNextClick,
                text: format('next'),
              },
            ]}
            dialogPlacement="bottom left"
            target="topNavDropdownsSpotlight"
            key="topNavDropdownsSpotlight"
            dialogWidth={275}
            actionsBeforeElement={`${spotlightIndex.toLocaleString()}/${spotlightScreenState?.totalScreens.toLocaleString()}`}
          >
            <p>
              {workspaceSwitcherState.visible
                ? format('you-can-find-your-workspaces')
                : format('you-can-find-your-most-recently')}
            </p>
          </LazySpotlight>
        ) : null}
      </LazySpotlightTransition>
    </LazySpotlightManager>
  );
};
