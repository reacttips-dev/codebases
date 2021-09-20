import React, { useEffect } from 'react';
import styles from './BoardViewsUpsellPrompt.less';
import { Button } from '@trello/nachos/button';
import { BoardHeaderTestIds } from '@trello/test-ids';
import { Analytics } from '@trello/atlassian-analytics';
import { dontUpsell } from '@trello/browser';
import { forTemplate } from '@trello/i18n';
import RouterLink from 'app/src/components/RouterLink/RouterLink';

const format = forTemplate('views_prompt');

interface OwnProps {
  orgId?: string;
  boardId?: string;
  orgName?: string;
  isAdmin: boolean;
  isUpgrade: boolean;
  activateFreeTrial: () => void;
  hidePopover: () => void;
}

type Views = 'timeline' | 'table' | 'calendar' | 'dashboard' | 'map';

interface View {
  image: Views;
  content: {
    name: string;
    description: string;
  };
}

const getSectionText = (promptType: string, section: string) =>
  format([promptType, section]);

const getViewText = (view: Views, key: string) =>
  format(['upsell-trial-prompt', 'views-list', view, key]);

export const BoardViewsUpsellPrompt: React.FC<OwnProps> = ({
  isAdmin,
  isUpgrade,
  activateFreeTrial,
  hidePopover,
  orgId,
  boardId,
  orgName,
}) => {
  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'upsellPromptBoardViewsInlineDialog',
      containers: {
        board: {
          id: boardId,
        },
        organization: {
          id: orgId,
        },
      },
      attributes: {
        promptType: isUpgrade ? 'upgrade' : 'freeTrial',
      },
    });
  }, [boardId, orgId, isUpgrade]);

  const onClickPrimary = (isUpgradeButton: boolean) => {
    hidePopover();
    Analytics.sendClickedButtonEvent({
      buttonName: isUpgradeButton
        ? 'upgradeToBCButton'
        : 'startFreeTrialButton',
      source: 'upsellPromptBoardViewsInlineDialog',
      containers: {
        board: {
          id: boardId,
        },
        organization: {
          id: orgId,
        },
      },
    });
    if (isUpgradeButton) {
      window.open(`/${orgName}/billing`, '_blank');
    } else {
      activateFreeTrial();
    }
  };

  const onClickLearnMoreLink = () => {
    Analytics.sendClickedLinkEvent({
      linkName: 'learnMoreLink',
      source: 'upsellPromptBoardViewsInlineDialog',
      containers: {
        board: {
          id: boardId,
        },
        organization: {
          id: orgId,
        },
      },
    });
  };
  const viewList: View[] = [
    {
      image: 'timeline',
      content: {
        name: getViewText('timeline', 'name'),
        description: getViewText('timeline', 'description'),
      },
    },
    {
      image: 'table',
      content: {
        name: getViewText('table', 'name'),
        description: getViewText('table', 'description'),
      },
    },
    {
      image: 'calendar',
      content: {
        name: getViewText('calendar', 'name'),
        description: getViewText('calendar', 'description'),
      },
    },
    {
      image: 'dashboard',
      content: {
        name: getViewText('dashboard', 'name'),
        description: getViewText('dashboard', 'description'),
      },
    },
    {
      image: 'map',
      content: {
        name: getViewText('map', 'name'),
        description: getViewText('map', 'description'),
      },
    },
  ];

  return (
    <div
      className={styles.container}
      data-test-id={BoardHeaderTestIds.BoardViewsSwitcherUpsellPrompt}
    >
      <section className={styles.header}>
        <div className={styles.promptHeader}>
          {isUpgrade && !dontUpsell()
            ? getSectionText('bc-trial-prompt', 'admin-upgrade-bc-header')
            : getSectionText('upsell-trial-prompt', 'header')}
        </div>
        <article className={styles.promptDescription}>
          {getSectionText('upsell-trial-prompt', 'description')}
        </article>
      </section>
      <section className={styles.content}>
        <ul>
          {viewList.map(({ content: { name, description }, image }) => (
            <li className={styles.view} key={name}>
              <img
                className={styles.viewIcon}
                alt={`${name} view`}
                src={require(`resources/images/views-upsell/${image}.svg`)}
              />
              <div>
                <div className={styles.viewName}>{name}</div>
                <div className={styles.viewDescription}>{description}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {/* Possible to break cta section into it's own component */}
      <section className={styles.ctaSection}>
        {!dontUpsell() && (
          <>
            {isUpgrade && !isAdmin ? (
              <p>{getSectionText('bc-trial-prompt', 'contact-team-admin')}</p>
            ) : (
              <Button
                appearance="primary"
                size="fullwidth"
                data-test-id={
                  isUpgrade
                    ? BoardHeaderTestIds.UpsellPromptUpgradeBCButton
                    : BoardHeaderTestIds.UpsellPromptStartFreeTrialButton
                }
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => onClickPrimary(isUpgrade)}
              >
                {isUpgrade
                  ? getSectionText('bc-trial-prompt', 'upgrade-button')
                  : getSectionText('upsell-trial-prompt', 'button')}
              </Button>
            )}
          </>
        )}
        <RouterLink
          data-test-id={BoardHeaderTestIds.UpsellPromptLearnMoreLink}
          className={styles.link}
          href="/business-class"
          target="_blank"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={onClickLearnMoreLink}
        >
          {isUpgrade && !dontUpsell()
            ? getSectionText('bc-trial-prompt', 'link')
            : getSectionText('upsell-trial-prompt', 'link')}
        </RouterLink>
      </section>
    </div>
  );
};
