import React, { useCallback } from 'react';
import classNames from 'classnames';
import { forNamespace } from '@trello/i18n';
import styles from './FreeTrialBannerExpired.less';
import { Analytics } from '@trello/atlassian-analytics';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { FreeTrialTestIds } from '@trello/test-ids';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { FreeTrialBannerQuery } from './FreeTrialBannerQuery.generated';
import { CloseIcon } from '@trello/nachos/icons/close';
import { useBillingStep } from 'app/src/components/TeamBillingView/useBillingStep';
import { useStandard } from 'app/src/components/StandardGenerics';

const format = forNamespace('free trial existing');

interface FreeTrialBannerExpiredProps {
  orgId: string;
  dismissBanner: () => void;
  data: FreeTrialBannerQuery;
}

export const FreeTrialBannerExpired: React.FC<FreeTrialBannerExpiredProps> = ({
  orgId,
  dismissBanner,
  data,
}) => {
  const { isStandardVariationEnabled } = useStandard({ orgId });

  const { setStep } = useBillingStep();

  const displayName = data?.organization?.displayName;
  const name = data?.organization?.name;
  const billingUrl = name ? `/${name}/billing` : '';

  const trackLinkToBilling = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'upgradeButton',
      source: 'freeTrialBanner',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  }, [orgId]);

  const dismissAndSendAnalytics = useCallback(
    (billingStep: 'details' | 'billing') => {
      setStep({ step: billingStep });
      trackLinkToBilling();
    },
    [setStep, trackLinkToBilling],
  );

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.FreeTrialExistingTeam,
      }}
    >
      <div
        className={classNames(styles.container, styles.expiredBg)}
        data-test-id={FreeTrialTestIds.ExpiredFreeTrialBanner}
        role="banner"
      >
        <div className={styles.bcContainer}>
          <span role="img" aria-label="wave" className={styles.emoji}>
            👋
          </span>
          {format(['banner', 'expired tagline'], {
            teamName: (
              <React.Fragment key={displayName}>{displayName}</React.Fragment>
            ),
          })}
        </div>
        <section className={styles.ctaContainer}>
          <div className={styles.linkContainer}>
            {isStandardVariationEnabled && (
              <RouterLink
                testId={FreeTrialTestIds.ExplorePlansButton}
                role="button"
                className={styles.linkCta}
                href={billingUrl}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => dismissAndSendAnalytics('details')}
              >
                {format(['banner', 'explore-plans'])}
              </RouterLink>
            )}

            <RouterLink
              testId={FreeTrialTestIds.AddPaymentMethodButton}
              role="button"
              className={styles.linkButton}
              href={billingUrl}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => dismissAndSendAnalytics('billing')}
            >
              {format(['banner', 'add-payment-method'])}
            </RouterLink>
          </div>
          <button className={styles.closeButton} onClick={dismissBanner}>
            <CloseIcon
              size="medium"
              block
              dangerous_className={styles.closeIcon}
            />
          </button>
        </section>
      </div>
    </ErrorBoundary>
  );
};
