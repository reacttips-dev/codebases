import React, { useCallback } from 'react';
import cx from 'classnames';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial/useFreeTrialEligibilityRules';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts/useUpgradePromptRules';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { forNamespace } from '@trello/i18n';
import styles from './BoardTileUpsell.less';

const format = forNamespace(['upgrade prompt', 'board tile', 'create']);

interface Props {
  orgId: string;
}

export const BoardTileUpsell: React.FC<Props> = ({ orgId }) => {
  const { openPlanSelection, org } = useUpgradePromptRules(
    orgId,
    `board-tile-${orgId}`,
  );
  const { isEligible } = useFreeTrialEligibilityRules(orgId);

  const onClickUpsell = useCallback(() => {
    openPlanSelection();

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'tile',
      actionSubjectId: 'createBoardTile',
      source: getScreenFromUrl({ orgName: org?.name }),
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        isFreeTrial: !!isEligible,
      },
    });
  }, [isEligible, org?.name, orgId, openPlanSelection]);

  return (
    <button className={styles.boardTileContainer} onClick={onClickUpsell}>
      <p className={styles.content}>{format(['headline'])}</p>
      <p className={cx(styles.content, styles.cta)}>{format(['content'])}</p>
    </button>
  );
};

export const BoardTileUpsellConnected: React.FC<Props> = (props) => (
  <ComponentWrapper>
    <BoardTileUpsell {...props} />
  </ComponentWrapper>
);
