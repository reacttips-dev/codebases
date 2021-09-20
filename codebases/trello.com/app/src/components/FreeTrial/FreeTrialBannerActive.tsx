import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { forNamespace, localizeCount } from '@trello/i18n';
import { FreeTrialBannerQuery } from './FreeTrialBannerQuery.generated';
import { useFreeTrialDismissBannerAndConfettiMutation } from './FreeTrialDismissBannerAndConfettiMutation.generated';
import styles from './FreeTrialBannerActive.less';
import { Analytics } from '@trello/atlassian-analytics';
import { FreeTrialRules } from './useFreeTrialEligibilityRules';
import confetti from 'canvas-confetti';
import _ from 'underscore';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { FreeTrialTestIds } from '@trello/test-ids';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { CloseIcon } from '@trello/nachos/icons/close';
import { formatCharEntityRef } from '@trello/strings';

const format = forNamespace('free trial existing');

interface FreeTrialBannerActiveProps {
  orgId: string;
  dismissBanner: () => void;
  data: FreeTrialBannerQuery;
  freeTrialRules: FreeTrialRules;
}

export const FreeTrialBannerActive: React.FC<FreeTrialBannerActiveProps> = ({
  orgId,
  dismissBanner,
  data,
  freeTrialRules,
}) => {
  const [
    freeTrialDismissBannerAndConfetti,
  ] = useFreeTrialDismissBannerAndConfettiMutation();

  const {
    daysLeft,
    isAdmin,
    totalFreeTrialCredits,
    hasOverTenOpenBoards,
  } = freeTrialRules;

  const DISMISS_MESSAGE_CONFETTI =
    totalFreeTrialCredits > 1
      ? `free-trial-banner-confetti-${totalFreeTrialCredits}-${orgId}`
      : `free-trial-banner-confetti-${orgId}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const oneTimeMessagesDismissed = data?.member?.oneTimeMessagesDismissed
    ? data?.member?.oneTimeMessagesDismissed
    : [];
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const onDismissConfetti = useCallback(() => {
    freeTrialDismissBannerAndConfetti({
      variables: { memberId: 'me', messageId: DISMISS_MESSAGE_CONFETTI },
      optimisticResponse: {
        __typename: 'Mutation',
        addOneTimeMessagesDismissed: {
          id: 'me',
          oneTimeMessagesDismissed: oneTimeMessagesDismissed!.concat([
            DISMISS_MESSAGE_CONFETTI,
          ]),
          __typename: 'Member',
        },
      },
    });
  }, [
    oneTimeMessagesDismissed,
    freeTrialDismissBannerAndConfetti,
    DISMISS_MESSAGE_CONFETTI,
  ]);

  const isConfettiDismissed = oneTimeMessagesDismissed.includes(
    DISMISS_MESSAGE_CONFETTI,
  );

  useEffect(() => {
    let confettiTimeout: ReturnType<typeof setTimeout> | null = null;
    let dismissTimeout: ReturnType<typeof setTimeout> | null = null;
    if (x && y && !isConfettiDismissed) {
      confettiTimeout = setTimeout(() => {
        confetti({
          angle: _.random(0, 45),
          spread: _.random(150, 180),
          particleCount: 150,
          origin: {
            x: 0,
            y: y / window.innerHeight,
          },
        });

        confettiTimeout = null;

        dismissTimeout = setTimeout(() => {
          onDismissConfetti();
          dismissTimeout = null;
        }, 3500);
      }, 1500);
    }

    return () => {
      if (!isConfettiDismissed && dismissTimeout) {
        onDismissConfetti();
      }
      dismissTimeout && clearTimeout(dismissTimeout);
      confettiTimeout && clearTimeout(confettiTimeout);
    };
  }, [x, y, isConfettiDismissed, onDismissConfetti]);

  const measuredRef = useCallback(
    (node) => {
      if (node !== null) {
        const rect = node.getBoundingClientRect();
        setX(rect.x + rect.width / 2);
        setY(rect.y + rect.height / 2);
      }

      if (isConfettiDismissed) {
        confetti.reset();
      }
    },
    [isConfettiDismissed],
  );

  const displayName = data?.organization?.displayName;
  const name = data?.organization?.name;
  const billingUrl = name ? `/${name}/billing` : '';

  // In this case, localizeCount returns an array of strings, including all substitutions
  // It's specifically the returned workspaceName substitution that needs to be formatted
  const daysLeftText = ((localizeCount(
    'free-trial-banner-trial-ends-soon',
    daysLeft,
    {
      days: (
        <span
          ref={measuredRef}
          key="daysLeft-closures"
          className={styles.daysContainer}
        >
          {daysLeft}
        </span>
      ),
      workspaceName: displayName,
    },
  ) as unknown) as string[]).map((s) => formatCharEntityRef(s));

  const hasCreditCard = !!data?.organization?.paidAccount?.cardType;

  const linkToBilling = useCallback(() => {
    const buttonNameEvent = isAdmin ? 'addPaymentButton' : 'upgradeButton';

    Analytics.sendClickedButtonEvent({
      buttonName: buttonNameEvent,
      source: 'freeTrialBanner',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  }, [orgId, isAdmin]);

  const messaging = (
    <div>
      {daysLeft > 7 && (
        <span role="img" aria-label="confetti" className={styles.emoji}>
          🎉
        </span>
      )}
      <span>{daysLeftText}</span>
      {hasOverTenOpenBoards && (
        <a
          target="_blank"
          href="https://help.trello.com/article/836-cancel-trello-business-class"
          className={styles.boardClosureMessaging}
        >
          {format('some-boards-may-close')}
        </a>
      )}
    </div>
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.FreeTrialExistingTeam,
      }}
    >
      <div
        className={classNames(styles.container, styles.bannerBg)}
        data-test-id={FreeTrialTestIds.ActiveFreeTrialBanner}
        role="banner"
      >
        {messaging}
        <div className={styles.ctaContainer}>
          {isAdmin && !hasCreditCard ? (
            <RouterLink
              className={styles.linkButton}
              href={billingUrl}
              onClick={linkToBilling}
              testId={FreeTrialTestIds.BannerAddPaymentButton}
            >
              {format(['banner', 'add-payment-method'])}
            </RouterLink>
          ) : (
            <button className={styles.closeButton} onClick={dismissBanner}>
              <CloseIcon
                size="medium"
                block
                dangerous_className={styles.closeIcon}
              />
            </button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};
