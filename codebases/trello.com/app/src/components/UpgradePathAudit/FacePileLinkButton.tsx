import React, { useEffect, useRef } from 'react';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';
import { forNamespace } from '@trello/i18n';
import styles from './FacePileLinkButton.less';
import { Analytics } from '@trello/atlassian-analytics';

interface Props {
  orgId: string;
}

const format = forNamespace(['upgrade-path-audit']);

export const FacePileLinkButton: React.FC<Props> = ({ orgId }) => {
  const { openPlanSelection } = useUpgradePromptRules(
    orgId,
    `face-file-upsell-link-button`,
  );
  const { isEligible } = useFreeTrialEligibilityRules(orgId);

  const buttonEl = useRef<HTMLButtonElement>(null);

  // https://github.com/facebook/react/issues/7094
  // Stupid hack since React has it's own event handling system
  // TLDR there is a stopPropagation getting called which is
  // preventing the button onClick event from bubbling up to react’s
  // synthetic event handler.
  useEffect(() => {
    const onClick = (e: {
      stopPropagation: () => void;
      preventDefault: () => void;
    }) => {
      e.stopPropagation();
      e.preventDefault();
      openPlanSelection();

      Analytics.sendClickedLinkEvent({
        linkName: 'bcUpgradePrompt',
        source: 'allBoardMembersInlineDialog',
        containers: {
          organization: {
            id: orgId,
          },
        },
        attributes: {
          isFreeTrial: isEligible,
          promptId: 'boardMemberDialogInline',
        },
      });
    };

    buttonEl?.current?.addEventListener('click', onClick);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => buttonEl?.current?.removeEventListener('click', onClick);
  });

  return (
    <div className={styles.container}>
      {format('for-more-user-roles', {
        upgrade: (
          <button
            key={'face-pile-upsell-link-button'}
            ref={buttonEl}
            className={styles.upgradeButton}
          >
            {format('explore-bc-1')}
          </button>
        ),
      })}
    </div>
  );
};
