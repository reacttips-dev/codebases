import React, { useEffect } from 'react';
import styles from './FreeTrialPlanSelection.less';
import classNames from 'classnames';
import { forNamespace, asMoney } from '@trello/i18n';
import { ProductFeatures, Products } from '@trello/product-features';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Analytics } from '@trello/atlassian-analytics';
import { FreeTrialTestIds } from '@trello/test-ids';
import { PlanSelection } from './PlanSelection';
import { TrustedByTeams } from './TrustedByTeams';
import { TrelloEnterpriseLearnMore } from './TrelloEnterpriseLearnMore';

type PlanSelectionType = 'try-business-class' | 'have-business-class';
type TrialLength = 14 | 30;

const format = forNamespace('upgrade-prompt-plan-selection-consolidated');

interface PlanSelectionProps {
  orgId: string;
  type: PlanSelectionType;
  trialLength: TrialLength;
  cta: React.ReactNode;
  hideSecondaryCta?: boolean;
  isStandardVariationEnabled?: boolean;
  isRepackagedGtm?: boolean;
}

const afterTrial = format('after-trial', {
  // eslint-disable-next-line @trello/no-module-logic
  price: `$${asMoney(
    // eslint-disable-next-line @trello/no-module-logic
    ProductFeatures.getPrice(
      Products.Organization.BusinessClass.current.yearly,
    )! / 12,
  )}`,
  downgradeOption: (
    <a
      key="after-trial-downgrade"
      target="_blank"
      href="https://help.trello.com/article/836-cancel-trello-business-class"
    >
      {format('after-trial-downgrade')}
    </a>
  ),
});

export const FreeTrialPlanSelection: React.FunctionComponent<PlanSelectionProps> = ({
  type,
  trialLength,
  cta,
  orgId,
  hideSecondaryCta = false,
  isStandardVariationEnabled,
  isRepackagedGtm,
}) => {
  const learnMoreBCButtonWithTracking = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'learnMoreAboutBCButton',
      source: 'planSelectionModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  };

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'planSelectionModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  }, [orgId]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.FreeTrialExistingTeam,
      }}
    >
      <div
        data-test-id={
          type === 'have-business-class'
            ? FreeTrialTestIds.HaveBCPlanSelection
            : FreeTrialTestIds.TryBCPlanSelection
        }
        className={styles.heading}
      >
        <h1>
          <img
            src={require('resources/images/moonshot/bc-sparkle.svg')}
            alt=""
            aria-hidden="true"
          />
          {format([type, 'headline'], { dayCount: trialLength })}
        </h1>
        <h2>{format([type, 'description'], { dayCount: trialLength })}</h2>
      </div>
      <PlanSelection
        trialLength={trialLength}
        isStandardVariationEnabled={isStandardVariationEnabled}
      />
      <div
        className={
          isRepackagedGtm
            ? classNames(styles.actions, styles.actionsRebrand)
            : styles.actions
        }
      >
        {cta}
        {!isRepackagedGtm && <TrustedByTeams />}
        {!isRepackagedGtm && <p className={styles.afterTrial}>{afterTrial}</p>}
        {type === 'try-business-class' &&
          !hideSecondaryCta &&
          !isRepackagedGtm && (
            <a
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => learnMoreBCButtonWithTracking()}
              href="/business-class"
              className={styles.secondaryCta}
              data-test-id={FreeTrialTestIds.LearnMoreAboutBCButton}
            >
              {format([type, 'secondary-cta'])}
            </a>
          )}
        {isRepackagedGtm && <TrelloEnterpriseLearnMore />}
      </div>
    </ErrorBoundary>
  );
};
