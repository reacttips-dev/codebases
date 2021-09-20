import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

import { CheckIcon } from '@trello/nachos/icons/check';
import { OverflowMenuHorizontalIcon } from '@trello/nachos/icons/overflow-menu-horizontal';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { forTemplate, forNamespace } from '@trello/i18n';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Button } from '@trello/nachos/button';
import { useSocketSubscription } from 'app/scripts/init/useSocketSubscription';
import {
  useFreeTeamOnboardingChecklist,
  FreeTeamOnboardingChecklistKey,
  getFreeTeamOnboardingDismissedMessageKey,
} from './useFreeTeamOnboardingChecklist';
import { FreeTeamOnboardingChecklist } from './FreeTeamOnboardingChecklist';
import { FreeTeamOnboardingFinished } from './FreeTeamOnboardingFinished';
import { FreeTeamOnboardingMenu } from './FreeTeamOnboardingMenu';
import { Analytics } from '@trello/atlassian-analytics';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { TeamOnboardingMemberList } from 'app/src/components/TeamOnboardingMemberList';
import { isMoonshotRedesign } from 'app/src/components/Moonshot/experimentVariation';

import styles from './FreeTeamOnboardingHome.less';

const format = forTemplate('free_team_onboarding');
const formatTeamOnboarding = forNamespace('team onboarding');

interface FreeTeamOnboardingHomeProps {
  orgId: string;
  orgName: string;
  model: object;
  modelCache: object;
}

interface TitleProps {
  text: string;
  icon: JSX.Element;
  iconClassName?: string;
}

const Title: React.FC<TitleProps> = ({ text, icon, iconClassName = '' }) => (
  <div className={styles.header}>
    {icon}
    <span className={styles.headerTitle}>{text.toUpperCase()}</span>
  </div>
);

export const FreeTeamOnboardingHome: React.FC<FreeTeamOnboardingHomeProps> = ({
  orgId,
  orgName,
  model,
  modelCache,
}) => {
  useSocketSubscription('Organization', orgId);

  Analytics.sendScreenEvent({
    name: 'freeTeamGettingStartedScreen',
    containers: {
      organization: { id: orgId },
    },
  });

  const {
    loading: checklistLoading,
    checklistItems,
    completedCount,
    dismissChecklistItem,
    oneTimeMessagesDismissed,
  } = useFreeTeamOnboardingChecklist(orgId);

  const checklistFinished =
    !checklistLoading && checklistItems.length === completedCount;

  const { triggerRef, toggle, popoverProps } = usePopover<HTMLButtonElement>();

  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'homeSectionItem',
      componentName: 'freeTeamGettingStartedItem',
      source: 'freeTeamGettingStartedScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  }, [orgId]);

  const onMoreIconClick = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'ellipsisIconButton',
      source: 'freeTeamGettingStartedScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
    toggle();
  };

  const isOnboardingCompleteDismissed = oneTimeMessagesDismissed.includes(
    getFreeTeamOnboardingDismissedMessageKey(
      FreeTeamOnboardingChecklistKey.OnboardingComplete,
    ),
  );

  // we need this additional variable to track whether the confetti has fired
  // it's value should line up with the FreeTeamOnboardingChecklistKey.OnboardingComplete
  // dismiss message, but updating that value is async relative to the component
  const [confettiHasFired, setConfettiHasFired] = useState(false);

  const shouldFireConfetti =
    !checklistLoading &&
    checklistFinished &&
    !isOnboardingCompleteDismissed &&
    !confettiHasFired;

  const [focused, setFocused] = useState(true);
  const confettiRef = useRef<HTMLDivElement>(null);

  // Show confetti once all items are complete
  useEffect(() => {
    let timeoutId: number;

    if (focused && shouldFireConfetti && confettiRef.current) {
      timeoutId = window.setTimeout(() => {
        if (!confettiRef.current || !shouldFireConfetti) return;
        const refRect = confettiRef.current.getBoundingClientRect();

        setConfettiHasFired(true);
        dismissChecklistItem(FreeTeamOnboardingChecklistKey.OnboardingComplete);
        confetti({
          angle: Math.floor(Math.random() * 45), // 0..45
          spread: Math.floor(Math.floor(Math.random() * 30) + 150), // 150..180
          particleCount: 150,
          origin: {
            x: refRect.x / window.innerWidth,
            y: refRect.y / window.innerHeight,
          },
        });
      }, 500); // delay transition to complete
    }

    return () => clearTimeout(timeoutId);
  }, [dismissChecklistItem, shouldFireConfetti, focused]);

  useEffect(() => {
    const onFocus = () => setFocused(true);

    const onBlur = () => setFocused(false);

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  });

  return (
    <ComponentWrapper>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.innerContainer}>
            <div className={styles.gettingStartedBar} ref={confettiRef}>
              <div className={styles.header}>
                <CheckIcon dangerous_className={styles.check} />
                <span className={styles.headerTitle}>
                  {format('getting-started').toUpperCase()}
                </span>
              </div>
              <Button
                iconBefore={<OverflowMenuHorizontalIcon color="gray" />}
                className={styles.ellipsis}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={onMoreIconClick}
                ref={triggerRef}
              />
              <Popover {...popoverProps} title={format('hide-list')}>
                <FreeTeamOnboardingMenu orgId={orgId} />
              </Popover>
            </div>
            <div className={styles.mainContent}>
              {checklistFinished && isOnboardingCompleteDismissed ? (
                <FreeTeamOnboardingFinished orgId={orgId} orgName={orgName} />
              ) : (
                <FreeTeamOnboardingChecklist orgId={orgId} />
              )}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <Title
            text={formatTeamOnboarding(
              isMoonshotRedesign() ? 'members' : 'workspace members',
            )}
            icon={<OrganizationIcon size="large" />}
          />
          {/* Note: because we need to use the ManageOrgMembersComponent
          and it was a lot of trouble making it work without refactoring it,
          we decided to pass down model and modelCache so we can use it.
          TODO: Remove model and modelCache once the ManageOrgMembersComponent
          had been refactored */}
          <TeamOnboardingMemberList
            orgId={orgId}
            model={model}
            modelCache={modelCache}
          />
        </div>
      </div>
    </ComponentWrapper>
  );
};
