import React, { useState, useEffect } from 'react';
import { Button } from '@glitchdotcom/shared-components';

import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import { useCurrentUser } from '../machines/User';

export const STATE_BOOST_DISABLED = 'state_boost_disabled'; // Boosting isn't available
export const STATE_BOOSTED = 'state_boosted'; // Project is already boosted
export const STATE_LOADING_BOOST_INFO = 'state_loading_boost'; // Waiting on boosted collection request
export const STATE_BOOSTED_COLLECTION_FULL = 'state_boosted_collection_full'; // User is already at max boosted projects
export const STATE_CAN_BOOST = 'state_can_boost'; // The user can boost this project

export function useCurrentProjectBoostInfo() {
  const application = useApplication();
  const currentUser = useCurrentUser();
  const currentProjectIsBoosted = useObservable(application.currentProjectIsBoosted);
  const boostedCollection = useObservable(application.boostedCollection);
  const boostedProjects = useObservable(application.boostedProjects);
  const currentUserIsAdmin = useObservable(application.projectIsAdminForCurrentUser);
  const projectIsBoosted = useObservable(application.currentProjectIsBoosted);

  let projectBoostState = STATE_CAN_BOOST;
  if (!currentUser?.isProUser || !currentUserIsAdmin) {
    projectBoostState = STATE_BOOST_DISABLED;
  } else if (projectIsBoosted) {
    projectBoostState = STATE_BOOSTED;
  } else if (!boostedProjects || !boostedCollection) {
    projectBoostState = STATE_LOADING_BOOST_INFO;
  } else if (boostedProjects.length === boostedCollection.maxProjects) {
    projectBoostState = STATE_BOOSTED_COLLECTION_FULL;
  }

  return {
    currentProjectIsBoosted,
    boostedCollection,
    boostedProjects,
    projectBoostState,
  };
}

/**
 * Button for boosting the current project.
 * NOTE: This button does not hide itself if boosting is disabled.
 */
export function BoostProjectButton({ children, currentProjectIsBoosted, projectBoostState, onClick, ...props }) {
  const application = useApplication();
  const [loading, setLoading] = useState(false);

  async function boostCurrentProject(event) {
    onClick?.(event);
    setLoading(true);
    try {
      await application.boostCurrentProject();
    } catch (err) {
      setLoading(false);
    }
  }

  async function unBoostCurrentProject(event) {
    onClick?.(event);
    setLoading(true);
    try {
      await application.unBoostCurrentProject();
    } catch {
      setLoading(false);
    }
  }

  // Reset the loading status after we successfully update boosted status.
  useEffect(() => {
    setLoading(false);
  }, [currentProjectIsBoosted]);

  if (projectBoostState === STATE_BOOSTED) {
    return (
      <Button size="small" onClick={unBoostCurrentProject} disabled={loading} {...props}>
        {children('Un-boost This App')}
      </Button>
    );
  }

  // Show disabled button until we've loaded the boosted collection
  if (projectBoostState === STATE_LOADING_BOOST_INFO) {
    return (
      <Button size="small" disabled onClick={boostCurrentProject} {...props}>
        {children('Boost This App')}
      </Button>
    );
  }

  return (
    <span
      data-tooltip-top
      data-tooltip={
        projectBoostState === STATE_BOOSTED_COLLECTION_FULL
          ? `To boost another project,\n you must remove one \nfrom your Boosted Apps \ncollection first`
          : undefined
      }
    >
      <Button size="small" disabled={loading || projectBoostState !== STATE_CAN_BOOST} onClick={boostCurrentProject} {...props}>
        {children('Boost This App')}
      </Button>
    </span>
  );
}
