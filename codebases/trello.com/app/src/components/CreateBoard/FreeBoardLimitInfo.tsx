import { forNamespace, localizeCount } from '@trello/i18n';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts/useUpgradePromptRules';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { Analytics } from '@trello/atlassian-analytics';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';

import React, { useCallback } from 'react';
import styles from './FreeBoardLimitInfo.less';
import { Button } from '@trello/nachos/button';
import { useStandard } from 'app/src/components/StandardGenerics';

const format = forNamespace('free board limit board create info', {
  shouldEscapeStrings: false,
});

interface FreeBoardLimitInfoProps {
  isInline?: boolean;
  isAtOrOverLimit?: boolean;
  isLimitOverridden?: boolean;
  isDesktop?: boolean;
  isEligible?: boolean;
  openBoardCount: number;
  orgName: string;
  orgId: string;
  teamName?: string;
  upgradeUrl: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  isStandardVariationEnabled?: boolean;
  openPlanSelection: () => void;
}

const FreeBoardLimitInfoText: React.FC<FreeBoardLimitInfoProps> = ({
  isAtOrOverLimit,
  openBoardCount,
  orgName,
  orgId,
  isDesktop,
  isEligible,
  openPlanSelection,
  isStandardVariationEnabled,
}) => {
  // Localize the translations to be used within other translations (translaception)
  const openBoards = localizeCount('open-boards', openBoardCount);

  const onUpgradeToBC = useCallback(() => {
    openPlanSelection();

    Analytics.sendClickedLinkEvent({
      linkName: 'bcUpgradePrompt',
      source: 'freeBoardLimitTooltip',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        isFreeTrial: !!isEligible,
        promptId: 'boardLimitTooltipPrompt',
      },
    });
  }, [openPlanSelection, isEligible, orgId]);

  const upgradeLink = (
    <a key="upgrade-link" href="#" role="button" onClick={onUpgradeToBC}>
      {format('upgrade to business class', { orgName })}
    </a>
  );

  if (!isDesktop && !isAtOrOverLimit) {
    return (
      <p>
        {format(
          isStandardVariationEnabled ? 'warn on web standard' : 'warn on web',
          {
            openBoards,
            upgradeLink,
          },
        )}
      </p>
    );
  }

  if (!isDesktop && isAtOrOverLimit) {
    return (
      <p>
        {format('block on web', {
          upgradeLink,
        })}
      </p>
    );
  }

  if (isDesktop && !isAtOrOverLimit) {
    return (
      <p>
        {format('warn on desktop', {
          orgName,
          openBoards,
        })}
      </p>
    );
  }

  if (isDesktop && isAtOrOverLimit) {
    return <p>{format('block on desktop')}</p>;
  }

  return <p></p>;
};

export const FreeBoardLimitInfo: React.FunctionComponent<FreeBoardLimitInfoProps> = ({
  onMouseEnter,
  onMouseLeave,
  isInline,
  orgId,
  teamName,
  ...otherProps
}) => {
  const { openPlanSelection } = useUpgradePromptRules(
    orgId,
    'board-list-item-add-' + orgId,
  );
  const { isStandardVariationEnabled } = useStandard({ orgId });

  const { isEligible } = useFreeTrialEligibilityRules(orgId);
  return (
    <div
      className={isInline ? styles.purpleBox : styles.whiteBox}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <FreeBoardLimitInfoText
        {...otherProps}
        orgId={orgId}
        isEligible={isEligible}
        openPlanSelection={openPlanSelection}
        isStandardVariationEnabled={isStandardVariationEnabled}
      />
      <div className={styles.learnMoreLinkContainer}>
        {isStandardVariationEnabled ? (
          <Button appearance="link" onClick={openPlanSelection}>
            {format('upgrade')}
          </Button>
        ) : (
          <a
            className={styles.learnMoreLink}
            href="https://help.trello.com/article/1177-personal-vs-team-boards"
            target="_blank"
            rel="noopener noreferrer"
          >
            {format('learn more')}
          </a>
        )}
      </div>
    </div>
  );
};

export const FreeBoardLimitInfoConnected: React.FC<FreeBoardLimitInfoProps> = (
  props,
) => (
  <ComponentWrapper>
    <FreeBoardLimitInfo {...props} />
  </ComponentWrapper>
);
