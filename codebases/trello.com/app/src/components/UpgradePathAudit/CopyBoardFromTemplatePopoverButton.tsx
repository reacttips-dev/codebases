import React, { useCallback } from 'react';
import styles from './CopyBoardFromTemplatePopoverButton.less';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts/useUpgradePromptRules';
import { Analytics } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { useStandard } from 'app/src/components/StandardGenerics';

const format = forNamespace(['upgrade-path-audit']);

interface Props {
  orgId: string;
  teamName: string;
}

export const CopyBoardFromTemplatePopoverButton: React.FC<Props> = ({
  orgId,
  teamName,
}) => {
  const { isStandardVariationEnabled } = useStandard({ orgId });
  const { isEligible } = useFreeTrialEligibilityRules(orgId, { skip: !orgId });

  const { openPlanSelection } = useUpgradePromptRules(
    orgId,
    `copy-board-from-template-popover-button-${orgId}`,
  );

  const onClick = useCallback(() => {
    openPlanSelection();
    Analytics.sendClickedLinkEvent({
      linkName: 'bcUpgradePrompt',
      source: 'createFromTemplateInlineDialog',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        isFreeTrial: isEligible,
        promptId: 'creatBoardFromTemplatePrompt',
      },
    });
  }, [openPlanSelection, orgId, isEligible]);

  {
    format('cannot-copy-board-limit-reached', {
      teamName: <span key={'team-name'}>{teamName}</span>,
    });
  }
  return (
    <>
      <p>
        {isStandardVariationEnabled
          ? format('free-workspace-can-only-have-10-open-boards')
          : format('cannot-copy-board-limit-reached', {
              teamName: <span key={'team-name'}>{teamName}</span>,
            })}
      </p>
      <a
        href="#"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onClick}
        className={styles.ctaButton}
      >
        {isStandardVariationEnabled
          ? format('upgrade-now')
          : format('upgrade-team-to-business-class', {
              teamName: <span key={'team-name'}>{teamName}</span>,
            })}
      </a>
    </>
  );
};
