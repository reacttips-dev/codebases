import React, { useCallback, useState } from 'react';
import { PopOver } from 'app/scripts/views/lib/pop-over';

import { forTemplate } from '@trello/i18n';
import styles from './upsell-advanced-checklist.less';
import cx from 'classnames';
import { Util } from 'app/scripts/lib/util';
import { Analytics } from '@trello/atlassian-analytics';
import { UpgradePromptButtonConnected } from 'app/src/components/UpgradePrompts/UpgradePromptButton';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import {
  PlanSelectionOverlay,
  useFreeTrialEligibilityRules,
} from 'app/src/components/FreeTrial';

const format = forTemplate('upsell_advanced_checklist');
interface Props {
  orgId?: string;
  teamName?: string;
}

export function AdvancedChecklistUpsell({ orgId, teamName }: Props) {
  const { isEligible } = useFreeTrialEligibilityRules(orgId, {
    skip: !orgId,
  });

  const [showPlanOverlay, setShowPlanOverlay] = useState(false);
  const closeOverlay = useCallback(() => {
    setShowPlanOverlay(false);
    PopOver.hide();
  }, []);
  const openOverlay = () => setShowPlanOverlay(true);
  const hidePlanOverlay = false;

  const upgradeUrl =
    isEligible && teamName
      ? '' // Pop show plan instead of link to another page.
      : teamName
      ? '' // Pop show plan instead of link to another page.
      : '/business-class';

  const onClickUpgrade = useCallback(() => {
    if (!hidePlanOverlay) {
      openOverlay();
    }

    Analytics.sendClickedButtonEvent({
      buttonName: 'upgradeToBCButton',
      source: 'advancedChecklistUpsellInlineDialog',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        isFreeTrial: !!isEligible,
      },
    });
  }, [isEligible, orgId, hidePlanOverlay]);

  return (
    <div className={styles.acContainer} key="acContainer">
      <div className={cx(styles.text, 'informational')} key="information">
        <p className={styles.checklistTitle}>
          {format('assign-dates-and-add-members-to-checklists')}
        </p>
        <p className="information">
          {format('upgrade-your-workspace-to-make-your-checklists-even-better')}
        </p>
        <div className="feedback-section" key="feedback-section" />
        <div className={styles.upgradeWrapper}>
          <UpgradePromptButtonConnected
            shouldFitContainer
            cta={isEligible ? format('free-trial-cta') : format('upgrade')}
            ctaLink={upgradeUrl}
            ctaOnClick={onClickUpgrade}
            openInNewTab
          />
        </div>
      </div>
      {!hidePlanOverlay && showPlanOverlay && orgId && (
        <PlanSelectionOverlay onClose={closeOverlay} orgId={orgId} />
      )}
    </div>
  );
}

interface Options {
  toggleSource: string;
  orgId?: string;
  teamName?: string;
}

export function toggleUpsellAdvancedChecklist({
  toggleSource,
  orgId,
  teamName,
}: Options) {
  return function toggle(e: MouseEvent) {
    Util.stop(e);

    Analytics.sendUIEvent({
      action: 'toggled',
      actionSubject: 'inlineDialog',
      actionSubjectId: 'advancedChecklistUpsellInlineDialog',
      source: 'cardDetailScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        toggleSource: toggleSource,
      },
    });

    PopOver.toggle({
      elem: e.currentTarget,
      keepEdits: true,
      hideHeader: true,
      reactElement: (
        <ErrorBoundary
          tags={{
            ownershipArea: 'trello-panorama',
            feature: Feature.Checklists,
          }}
        >
          <ComponentWrapper key="advanced-checklists-info">
            <AdvancedChecklistUpsell orgId={orgId} teamName={teamName} />
          </ComponentWrapper>
        </ErrorBoundary>
      ),
    });
  };
}
