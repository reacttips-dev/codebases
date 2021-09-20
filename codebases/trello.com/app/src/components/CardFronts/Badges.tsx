import React, { useMemo } from 'react';

import { CanonicalCard } from '@atlassian/trello-canonical-components';
import { Dates } from 'app/scripts/lib/dates';

import { forTemplate } from '@trello/i18n';

const format = forTemplate('badge');

import styles from './Badges.less';

const {
  CardBadges,
  AttachmentsBadge,
  CardTemplateBadge,
  ChecklistBadge,
  CommentsBadge,
  DescriptionBadge,
  DueDateBadge,
  //   NotificationBadge, TODO format('notifications')
  ArchivedBadge,
  VotesBadge,
  TrelloAttachmentsBadge,
} = CanonicalCard;

interface BadgesProps {
  comments?: number | null;
  due?: string | null;
  start?: string | null;
  votes?: number | null;
  viewingMemberVoted?: boolean | null;
  dueComplete?: boolean | null;
  subscribed?: boolean | null; // format('subscribed')
  description?: boolean | null;
  checkItems?: number | null;
  checkItemsChecked?: number | null;
  attachments?: number | null;
  attachmentsByType?: {
    trello: {
      board: number;
      card: number;
    };
  };
  isTemplate?: boolean | null;
  isClosed?: boolean | null;
  checklists?: Array<{
    checkItems?: Array<{
      state?: string | null;
      id?: string | null;
      due?: string | null;
    }> | null;
  }>;
}

const TWENTY_FOUR_HOURS = 86400000;
const ONE_HOUR = 3600000;

export const Badges = ({
  comments,
  due,
  dueComplete,
  description,
  attachments: attachmentProps,
  isTemplate,
  isClosed,
  votes,
  viewingMemberVoted,
  checklists,
  start,
  attachmentsByType,
}: BadgesProps) => {
  const trelloAttachments =
    (attachmentsByType?.trello?.board || 0) +
    (attachmentsByType?.trello?.card || 0);

  let attachments = attachmentProps || 0;

  if (attachments > 0 && attachments >= trelloAttachments) {
    attachments = attachments - trelloAttachments;
  }

  const {
    checkItems,
    checkItemsChecked,
    checkItemsEarliestDue,
  } = useMemo(() => {
    let checkItems = 0;
    let checkItemsChecked = 0;
    let checkItemsEarliestDue = null;

    if (checklists) {
      for (let i = 0; i < checklists.length; i++) {
        const checklist = checklists[i];
        if (checklist) {
          const checklistCheckItems = checklist.checkItems;
          if (checklistCheckItems) {
            for (let x = 0; x < checklistCheckItems.length; x++) {
              const due = checklistCheckItems[x].due;
              checkItems++;
              if (checklistCheckItems[x].state === 'complete') {
                checkItemsChecked++;
              } else if (due) {
                if (!checkItemsEarliestDue) {
                  checkItemsEarliestDue = new Date(due);
                } else if (
                  checkItemsEarliestDue &&
                  due &&
                  new Date(due) < checkItemsEarliestDue
                ) {
                  checkItemsEarliestDue = new Date(due);
                }
              }
            }
          }
        }
      }
    }
    return { checkItems, checkItemsChecked, checkItemsEarliestDue };
  }, [checklists]);

  const dueTitle = useMemo(() => {
    let dueTitle;
    if (due) {
      const now = Date.now();
      const dueDateTime = new Date(due).getTime();
      dueTitle = format(['due', 'later']);
      const dueDif = dueDateTime - now;
      if (dueComplete) {
        dueTitle = format(['due', 'complete']);
      } else if (dueDif > 0 && dueDif <= ONE_HOUR) {
        dueTitle = format(['due', 'less-than-hour']);
      } else if (dueDif > 0 && dueDif <= TWENTY_FOUR_HOURS) {
        dueTitle = format(['due', 'less-than-day']);
      } else if (dueDif < 0 && dueDif + TWENTY_FOUR_HOURS >= 0) {
        dueTitle = format(['due', 'recently-overdue']);
      } else if (dueDif < 0) {
        dueTitle = format(['due', 'overdue']);
      }
    }
    return dueTitle;
  }, [due, dueComplete]);

  return (
    <CardBadges className={styles.badges}>
      {isTemplate && (
        <CardTemplateBadge title={format('template')}>
          {format('card template badge label')}
        </CardTemplateBadge>
      )}
      {!!votes && (
        <VotesBadge
          voted={viewingMemberVoted || false}
          title={format('votes')}
          numVotes={votes}
        ></VotesBadge>
      )}
      {!isTemplate && due && (
        <DueDateBadge
          title={dueTitle}
          isComplete={dueComplete || false}
          dueDate={new Date(due)}
        >
          {start
            ? `${Dates.toDateString(start)} - ${Dates.toDateString(due)}`
            : Dates.toDateString(due)}
        </DueDateBadge>
      )}
      {!!description && <DescriptionBadge title={format('description')} />}
      {!!comments && (
        <CommentsBadge title={format('comments')} numComments={comments} />
      )}
      {!!attachments && (
        <AttachmentsBadge
          title={format('attachments')}
          numAttachments={attachments}
        />
      )}
      {!!trelloAttachments && (
        <TrelloAttachmentsBadge
          title={format('trelloattachments')}
          numAttachments={trelloAttachments}
        />
      )}
      {!!checkItems && (
        <ChecklistBadge
          checkItemsEarliestDue={checkItemsEarliestDue}
          title={format('checkitems')}
          numItems={checkItems}
          numComplete={checkItemsChecked || 0}
        />
      )}
      {isClosed && (
        <ArchivedBadge title={format('archivedtitle')}>
          {format('archivedtext')}
        </ArchivedBadge>
      )}
    </CardBadges>
  );
};
