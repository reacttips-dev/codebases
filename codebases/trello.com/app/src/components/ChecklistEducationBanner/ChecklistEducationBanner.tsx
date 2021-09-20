import React, { useCallback, useMemo } from 'react';
import styles from './ChecklistEducationBanner.less';
import { forTemplate } from '@trello/i18n';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Analytics } from '@trello/atlassian-analytics';
import { isDesktop } from '@trello/browser';

const format = forTemplate('checklist_education_banner');

interface ChecklistEducationBannerProps {
  onDismiss: () => void;
  idBoard?: string;
  idCard?: string;
  idOrganization?: string;
}

export const ChecklistEducationBanner: React.FunctionComponent<ChecklistEducationBannerProps> = ({
  onDismiss,
  idBoard,
  idCard,
  idOrganization,
}) => {
  const containers = useMemo(
    () => ({
      card: {
        id: idCard,
      },
      board: {
        id: idBoard,
      },
      organization: {
        id: idOrganization,
      },
    }),
    [idBoard, idCard, idOrganization],
  );

  const onClickYourItems = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: 'yourItemsLink',
        source: 'advancedChecklistEducationBanner',
        containers,
      }),
    [containers],
  );

  const onClickLearnMore = useCallback(
    () =>
      Analytics.sendClickedLinkEvent({
        linkName: 'advancedChecklistLearnMoreLink',
        source: 'advancedChecklistEducationBanner',
        containers,
      }),
    [containers],
  );

  const onClickDismiss = useCallback(() => {
    onDismiss();

    Analytics.sendClickedButtonEvent({
      buttonName: 'dismissButton',
      source: 'advancedChecklistEducationBanner',
      containers,
    });
  }, [containers, onDismiss]);

  return (
    <div className={styles.banner}>
      <h2 className={styles.heading}>{format('assign-people-and-dates')}</h2>
      <div className={styles.content}>
        {format('plus-see-all-your-assigned-items', {
          yourItems: (
            <a
              key="your-items"
              target={isDesktop() ? undefined : '_blank'}
              href="/my/tasks"
              onClick={onClickYourItems}
            >
              {format('your-items')}
            </a>
          ),
        })}
      </div>
      <div className={styles.footer}>
        <a
          target="_blank"
          href="https://help.trello.com/article/942-assigning-people-and-due-dates-to-specific-checklist-items"
          onClick={onClickLearnMore}
        >
          {format('learn-more')}
        </a>
      </div>
      <button className={styles.dismiss} onClick={onClickDismiss}>
        <CloseIcon size="small" />
      </button>
    </div>
  );
};
