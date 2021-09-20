import React from 'react';
import styles from './ExpiredTrialPlanSelection.less';
import classNames from 'classnames';
import { forNamespace } from '@trello/i18n';
import { UpgradePromptTestIds } from '@trello/test-ids';
import { PlanSelection } from './PlanSelection';
import { PlanSelectionProps } from './types';
import { TrustedByTeams } from './TrustedByTeams';
import { TrelloEnterpriseLearnMore } from './TrelloEnterpriseLearnMore';

interface OwnProps extends PlanSelectionProps {
  cta: React.ReactNode;
  isRepackagedGtm?: boolean;
}

const format = forNamespace('upgrade-prompt-plan-selection-consolidated');

export const ExpiredTrialPlanSelection: React.FunctionComponent<OwnProps> = ({
  cta,
  isStandardVariationEnabled,
  isRepackagedGtm,
}) => (
  <>
    <div
      className={styles.heading}
      data-test-id={UpgradePromptTestIds.PlanSelection}
    >
      <h1>
        <img
          className={styles.briefcase}
          src={require('resources/images/moonshot/bc-sparkle.svg')}
          alt="briefcase"
          width="50"
        />{' '}
        {format(['expired-free-trial-upgrade', 'headline'])}
      </h1>
      <h2> {format(['expired-free-trial-upgrade', 'description'])}</h2>
    </div>
    <PlanSelection isStandardVariationEnabled={isStandardVariationEnabled} />
    <div
      className={
        isRepackagedGtm
          ? classNames(styles.actions, styles.actionsRebrand)
          : styles.actions
      }
    >
      {cta}
      {!isRepackagedGtm && <TrustedByTeams />}
      {isRepackagedGtm && <TrelloEnterpriseLearnMore />}
    </div>
  </>
);
