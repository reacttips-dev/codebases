import { useEffect, useState, useRef } from 'react';

import { useSharedState } from '@trello/shared-state';
import { featureFlagClient } from '@trello/feature-flag-client';
import { memberId } from '@trello/session-cookie';
import { isEmbeddedDocument } from '@trello/browser';
import { sendErrorEvent } from '@trello/error-reporting';

import { featureFlagUserDataRefinedState } from 'app/scripts/controller/featureFlagUserDataRefinedState';
import { Feature } from 'app/scripts/debug/constants';

import { workspaceNavigationState } from './workspaceNavigationState';
import { useWorkspaceNavigationOneTimeMessagesDismissedQuery } from './WorkspaceNavigationOneTimeMessagesDismissedQuery.generated';
import { useAddWorkspaceNavEnabledOneTimeMessageMutation } from './AddWorkspaceNavEnabledOneTimeMessageMutation.generated';

// The 'teamplates.web.left-nav-bar' flag here is the general flag we use
// to enable LHN to new cohorts
function getIsFlagEnabled() {
  return featureFlagClient.get<boolean>('teamplates.web.left-nav-bar', false);
}

// We use the 'teamplates.web.existing-left-nav-users' flag to ensure
// that users who have seen the LHN continue to see LHN _even if they change cohorts_
function getIsFlagForExistingUsersEnabled() {
  return featureFlagClient.get<boolean>(
    'teamplates.web.existing-left-nav-users',
    false,
  );
}

// Generally, we only care about the initial evaluation of the flag;
// because this is such a large UI change, we (generally) only want to
// enable it on a refresh (so a massive UI change doesn't happen randomly)
// eslint-disable-next-line @trello/no-module-logic
const isFlagEnabled = getIsFlagEnabled();
// eslint-disable-next-line @trello/no-module-logic
const isFlagForExistingUsersEnabled = getIsFlagForExistingUsersEnabled();
const ONE_TIME_MESSAGE_NAME = 'workspace-nav-enabled';

export function useWorkspaceNavigationStateUpdater() {
  const [generalFlagEnabled, setGeneralFlagEnabled] = useState(isFlagEnabled);
  const [existingUsersFlagEnabled, setExistingUsersFlagEnabled] = useState(
    isFlagForExistingUsersEnabled,
  );
  const [isFeatureFlagUserDataRefined] = useSharedState(
    featureFlagUserDataRefinedState,
  );
  const [navState, setNavState] = useSharedState(workspaceNavigationState);
  const { data, error } = useWorkspaceNavigationOneTimeMessagesDismissedQuery();
  const [
    dismissOneTimeMessage,
  ] = useAddWorkspaceNavEnabledOneTimeMessageMutation();

  const { enabled, expanded } = navState;
  const oneTimeMessagesDismissed =
    data?.member?.oneTimeMessagesDismissed || undefined;

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      // on first render, initalize to complete
      setNavState({
        expandedViewStatus: navState.expanded
          ? 'visible-transition-complete'
          : 'hidden-transition-complete',
      });
      firstUpdate.current = false;
      return;
    }

    setNavState({
      expandedViewStatus: navState.expanded
        ? 'visible-in-transition'
        : 'hidden-in-transition',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]); // we only want this to fire whenever expanded/collapse state changes

  useEffect(() => {
    // When we initialize the feature flag using featureFlagClient.get above
    // we get the default value in new browsers / icognito tabs.
    // This updates that value once the _actual_ FF values are loaded
    if (isFeatureFlagUserDataRefined) {
      setGeneralFlagEnabled(getIsFlagEnabled());
      setExistingUsersFlagEnabled(getIsFlagForExistingUsersEnabled());
    }
  }, [isFeatureFlagUserDataRefined]);

  // Log errors from fetching oneTimeMessagesDismissed if they happen
  useEffect(() => {
    if (error) {
      sendErrorEvent(error, {
        tags: {
          ownershipArea: 'trello-teamplates',
          feature: Feature.WorkspaceNavigation,
        },
      });
    }
  }, [error]);

  // Listen for oneTimeMessagesDismissed loading,
  // if it includes 'workspaceNavEnabled` use enabledForExistingUsers flag
  useEffect(() => {
    // wait for all of the data to load
    if (oneTimeMessagesDismissed) {
      const enableWorkspaceNavForExistingUsers =
        !!memberId && !isEmbeddedDocument() && existingUsersFlagEnabled;

      if (
        oneTimeMessagesDismissed.includes(ONE_TIME_MESSAGE_NAME) &&
        enableWorkspaceNavForExistingUsers
      ) {
        if (!enabled) {
          setNavState({ enabled: true });
        }
        return;
      }

      const enableWorkspaceNav =
        !!memberId && !isEmbeddedDocument() && generalFlagEnabled;
      // push flag indicating the workspace nav has been enabled
      // if that flag doesn't already exist
      if (
        enableWorkspaceNav &&
        !oneTimeMessagesDismissed.includes(ONE_TIME_MESSAGE_NAME)
      ) {
        dismissOneTimeMessage({
          variables: { messageId: ONE_TIME_MESSAGE_NAME },
        });
      }

      // If current enabled state doesn't reflect value specified by FF
      // update the enabled state
      if (enabled !== enableWorkspaceNav) {
        setNavState({ enabled: enableWorkspaceNav });
      }
    }
  }, [
    oneTimeMessagesDismissed,
    enabled,
    dismissOneTimeMessage,
    setNavState,
    generalFlagEnabled,
    existingUsersFlagEnabled,
  ]);
}
