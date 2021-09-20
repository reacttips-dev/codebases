import React, { Suspense } from 'react';
import classnames from 'classnames';
import { useLazyComponent } from '@trello/use-lazy-component';
import { navigate } from 'app/scripts/controller/navigate';
import { Auth } from 'app/scripts/db/auth';
import { HomeLeftSidebarContainer } from 'app/scripts/views/home/presentational/HomeLeftSidebarContainer.js';
import { useTeamOnboarding } from 'app/src/components/BusinessClassTeamOnboarding/useTeamOnboarding';
import { useFreeTeamOnboarding } from 'app/src/components/FreeTeamOnboarding/useFreeTeamOnboarding';
import { Spinner } from '@trello/nachos/spinner';
import styles from './TeamOnboardingPage.less';

interface TeamOnboardingPageProps {
  orgId: string;
  model: object;
  orgName: string;
  modelCache: {
    get: (modelType: string, modelId: string) => object;
  };
}

export const TeamOnboardingPage: React.FunctionComponent<TeamOnboardingPageProps> = ({
  orgId,
  orgName,
  modelCache,
  model,
}) => {
  const BCTeamOnboarding = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "bc-team-onboarding-hom" */ 'app/src/components/BusinessClassTeamOnboarding/TeamOnboardingHome'
      ),
    { namedImport: 'TeamOnboardingHome' },
  );
  const FreeTeamOnboarding = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "free-team-onboarding-home" */ 'app/src/components/FreeTeamOnboarding/FreeTeamOnboardingHome'
      ),
    { namedImport: 'FreeTeamOnboardingHome' },
  );

  const {
    isEligible: isEligibleForBC,
    isLoading: isLoadingBC,
  } = useTeamOnboarding(orgId);
  const {
    isEligible: isEligibleForFree,
    isLoading: isLoadingFree,
  } = useFreeTeamOnboarding(orgId);

  if (isLoadingBC || isLoadingFree) {
    return null;
  }

  if (isEligibleForBC || isEligibleForFree) {
    return (
      <div
        className={classnames(['home-container', styles.teamOnboardingPage])}
      >
        <div className="home-sticky-container">
          <div className={styles.leftNav}>
            <HomeLeftSidebarContainer
              activeOrgname={orgName}
              modelCache={modelCache}
              model={modelCache.get('Member', Auth.me().id)}
            />
          </div>
          <div
            className={classnames([
              'home-main-content-container',
              styles.contentContainer,
            ])}
          >
            <Suspense
              fallback={<Spinner centered wrapperClassName={styles.loading} />}
            >
              {isEligibleForBC ? (
                <BCTeamOnboarding
                  orgId={orgId}
                  model={model}
                  modelCache={modelCache}
                />
              ) : (
                <FreeTeamOnboarding
                  orgId={orgId}
                  orgName={orgName}
                  model={model}
                  modelCache={modelCache}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    );
  } else {
    navigate(`/${orgName}`, {
      replace: true,
      trigger: true,
    });
    return null;
  }
};
