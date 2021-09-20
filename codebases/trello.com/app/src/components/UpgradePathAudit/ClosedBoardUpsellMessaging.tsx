import React from 'react';
import styles from './ClosedBoardUpsellMessaging.less';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts/useUpgradePromptRules';
import { forNamespace } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';

const format = forNamespace(['upgrade-path-audit']);

interface Props {
  orgId: string;
  teamName: string;
}

export const ClosedBoardUpsellMessaging: React.FC<Props> = ({
  orgId,
  teamName,
}) => {
  const { openPlanSelection } = useUpgradePromptRules(
    orgId,
    `closed-board-upsell-${orgId}`,
  );
  const { isEligible } = useFreeTrialEligibilityRules(orgId, { skip: !orgId });

  const onClick = () => {
    openPlanSelection();

    Analytics.sendClickedLinkEvent({
      linkName: 'bcUpgradePrompt',
      source: 'closeBoardScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        isFreeTrial: !!isEligible,
        promptId: 'closeBoardUpgradeLink',
      },
    });
  };

  return (
    <span className={styles.messaging}>
      {format('cannot-reopen-board-limit-reached', {
        upgrade: (
          <a
            key="cannot-reopen-board-limit-reached"
            className={styles.ctaLink}
            role="button"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={onClick}
          >
            {format('upgrade-team-to-business-class', {
              // This prevents team names with special characters from getting escaped
              teamName: <span key={'team-name'}>{teamName}</span>,
            })}
          </a>
        ),
      })}
    </span>
  );
};
