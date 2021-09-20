import React, { useCallback, useEffect } from 'react';

import { forTemplate } from '@trello/i18n';
import {
  LazySpotlightManager,
  LazySpotlightTarget,
  LazySpotlightTransition,
  LazySpotlight,
} from 'app/src/components/Onboarding';

import { useSpotlight } from 'app/src/components/WorkspaceNavigation/useSpotlight';
import { Analytics } from '@trello/atlassian-analytics';
import { useWorkspace } from '@trello/workspaces';

const format = forTemplate('sidebar_spotlight');

export const SpotlightSearch: React.FunctionComponent = ({ children }) => {
  const [spotlightScreenState, setSpotlightScreenState] = useSpotlight();
  const { idWorkspace, idBoard } = useWorkspace();

  // we want to lazy load this spotlight once the spotlight series starts
  const showSpotlight = !!spotlightScreenState;
  const spotlightIndex = 3;

  useEffect(() => {
    if (
      showSpotlight &&
      spotlightScreenState?.screen === 'third-search-bar' &&
      idBoard
    ) {
      Analytics.sendScreenEvent({
        name: 'searchSpotlightModal',
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
      source: 'searchSpotlightModal',
      containers: {
        ...(idWorkspace ? { organization: { id: idWorkspace } } : {}),
        ...(idBoard ? { board: { id: idBoard } } : {}),
      },
    });
    setSpotlightScreenState({ screen: 'fourth-nav-collapse' });
  }, [setSpotlightScreenState, idWorkspace, idBoard]);

  return !showSpotlight ? (
    <>{children}</>
  ) : (
    <LazySpotlightManager>
      <LazySpotlightTarget name="searchBar">{children}</LazySpotlightTarget>
      <LazySpotlightTransition>
        {spotlightScreenState?.screen === 'third-search-bar' ? (
          <LazySpotlight
            actions={[
              {
                onClick: handleNextClick,
                text: format('next'),
              },
            ]}
            dialogPlacement="bottom left"
            target="searchBar"
            key="searchBar"
            dialogWidth={275}
            actionsBeforeElement={`${
              spotlightIndex && spotlightIndex.toLocaleString()
            }/${spotlightScreenState?.totalScreens?.toLocaleString()}`}
          >
            <p>{format('search-got-some-upgrades')}</p>
          </LazySpotlight>
        ) : null}
      </LazySpotlightTransition>
    </LazySpotlightManager>
  );
};
