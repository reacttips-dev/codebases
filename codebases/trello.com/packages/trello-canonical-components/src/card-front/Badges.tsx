import React from 'react';
import {
  N0,
  N100,
  N40A,
  Green500,
  Red300,
  Red500,
  Yellow500,
  N400,
} from '@trello/colors';

import { formatHumanDate } from '@trello/dates';
import { BadgesTestIds } from '@trello/test-ids';
import cx from 'classnames';
import styles from './Badge.less';

import { IconBadge } from './Badge';
import ArchivedIcon from '../icons/ArchivedIcon';
import AttachmentIcon from '../icons/AttachmentIcon';
import ChecklistIconComplete from '../icons/ChecklistIconComplete';
import ChecklistIconIncomplete from '../icons/ChecklistIconIncomplete';
import CommentIcon from '../icons/CommentIcon';
import DescriptionIcon from '../icons/DescriptionIcon';
import DueDateIconComplete from '../icons/DuedateCompleteIcon';
import DueDateIcon from '../icons/DuedateIcon';
import NotificationIcon from '../icons/NotificationIcon';
import SubscribeIcon from '../icons/SubscribeIcon';
import CardTemplateIcon from '../icons/CardTemplateIcon';
import TrelloAttachmentIcon from '../icons/TrelloAttachmentIcon';
import VoteIcon from '../icons/VoteIcon';

const TWENTY_FOUR_HOURS = 86400000;
const THIRTY_SIX_HOURS = 129600000;

/**
 * Archived Badge
 */
interface ArchivedBadgeProps {
  className?: string;
  title?: string;
}

export const ArchivedBadge: React.FC<ArchivedBadgeProps> = ({
  className,
  children,
  title,
}) => (
  <IconBadge title={title} className={className} icon={<ArchivedIcon />}>
    {children}
  </IconBadge>
);

/**
 * Attachments Badge
 */
interface AttachmentsBadgeProps {
  className?: string;
  numAttachments?: number;
  title?: string;
}

export const AttachmentsBadge: React.FC<AttachmentsBadgeProps> = ({
  numAttachments = 0,
  className,
  title,
}) => (
  <IconBadge title={title} className={className} icon={<AttachmentIcon />}>
    <span data-test-class={BadgesTestIds.CardAttachmentsCount}>
      {numAttachments}
    </span>
  </IconBadge>
);

/**
 * Card Template Badge
 */

interface CardTemplateBadgeProps {
  className?: string;
  title?: string;
}

export const CardTemplateBadge: React.FC<CardTemplateBadgeProps> = ({
  className,
  children,
  title,
}) => (
  <IconBadge
    title={title}
    className={cx(className, styles.isTemplate)}
    icon={<CardTemplateIcon />}
  >
    {children}
  </IconBadge>
);

/**
 * Checklist Badge
 */
interface ChecklistBadgeProps {
  className?: string;
  iconClassName?: string;
  numItems?: number;
  numComplete?: number;
  checkItemsEarliestDue?: Date | null;
  title?: string;
}

export const ChecklistBadge: React.FC<ChecklistBadgeProps> = ({
  numComplete = 0,
  numItems = 0,
  checkItemsEarliestDue,
  className,
  iconClassName,
  title,
}) => {
  const isComplete = numComplete === numItems;

  let bgColor = isComplete ? Green500 : undefined;
  let fontColor = isComplete ? N0 : undefined;
  const icon = isComplete ? (
    <ChecklistIconComplete />
  ) : (
    <ChecklistIconIncomplete />
  );

  let innerText = `${numComplete}/${numItems}`;

  if (checkItemsEarliestDue) {
    const now = Date.now();
    const dueDateTime = checkItemsEarliestDue.getTime();
    const isDueSoon =
      dueDateTime - TWENTY_FOUR_HOURS <= now && dueDateTime > now;
    const isDueNow = dueDateTime <= now && dueDateTime + THIRTY_SIX_HOURS > now;
    const isPastDue = dueDateTime + THIRTY_SIX_HOURS <= now;

    if (isPastDue) {
      bgColor = Red300;
      fontColor = N0;
    } else if (isDueNow) {
      bgColor = Red500;
      fontColor = N0;
    } else if (isDueSoon) {
      bgColor = Yellow500;
      fontColor = N0;
    } else if (isComplete) {
      bgColor = Green500;
      fontColor = N0;
    }

    innerText += ` • ${formatHumanDate(checkItemsEarliestDue)}`;
  }

  return (
    <IconBadge
      className={className}
      iconClassName={iconClassName}
      bgColor={bgColor}
      fontColor={fontColor}
      icon={icon}
      dataTestClass={BadgesTestIds.ChecklistBadge}
      title={title}
    >
      {innerText}
    </IconBadge>
  );
};

/**
 * Comments Badge
 */
interface CommentsBadgeProps {
  className?: string;
  numComments?: number;
  title?: string;
}

export const CommentsBadge: React.FC<CommentsBadgeProps> = ({
  numComments = 0,
  className,
  title,
}) => (
  <IconBadge title={title} className={className} icon={<CommentIcon />}>
    {numComments}
  </IconBadge>
);

/**
 * Description Badge
 */
interface DescriptionBadgeProps {
  className?: string;
  title?: string;
}

export const DescriptionBadge: React.FC<DescriptionBadgeProps> = ({
  className,
  title,
}) => (
  <IconBadge title={title} className={className} icon={<DescriptionIcon />} />
);

/**
 * DueDate Badge
 */
interface DueDateBadgeProps {
  className?: string;
  dueDate?: Date | null;
  isComplete?: boolean;
  clickable?: boolean;
  title?: string;
}

export const DueDateBadge: React.FC<DueDateBadgeProps> = ({
  children,
  className,
  dueDate,
  title,
  clickable = false,
  isComplete = false,
}) => {
  const now = Date.now();
  let isDueSoon, isDueNow, isPastDue;

  if (dueDate) {
    const dueDateTime = dueDate?.getTime();
    isDueSoon = dueDateTime - TWENTY_FOUR_HOURS <= now && dueDateTime > now;
    isDueNow = dueDateTime <= now && dueDateTime + THIRTY_SIX_HOURS > now;
    isPastDue = dueDateTime + THIRTY_SIX_HOURS <= now;
  }

  // If the badge is clickable, we color it using classes so we can have
  // hover / active states
  const clickableClass = clickable
    ? cx(styles.dueDateBadge, {
        [styles.isPastDue]: !isComplete && isPastDue,
        [styles.isDueNow]: !isComplete && isDueNow,
        [styles.isDueSoon]: !isComplete && isDueSoon,
        [styles.isComplete]: isComplete,
      })
    : undefined;

  // If the badge isn't clickable we can use the bgColor/fontColor props to
  // set a fixed color
  const bgColor = clickable
    ? undefined
    : isComplete
    ? Green500
    : isDueSoon
    ? Yellow500
    : isDueNow
    ? Red500
    : isPastDue
    ? Red300
    : 'transparent';

  const fontColor = clickable
    ? undefined
    : isComplete || isDueSoon || isDueNow || isPastDue
    ? N0
    : N400;

  return (
    <IconBadge
      title={title}
      className={cx(clickableClass, className)}
      bgColor={bgColor}
      fontColor={fontColor}
      icon={isComplete ? <DueDateIconComplete /> : <DueDateIcon />}
      dataTestClass={
        isComplete
          ? BadgesTestIds.DueDateBadgeCompleted
          : BadgesTestIds.DueDateBadgeNotCompleted
      }
    >
      {children}
    </IconBadge>
  );
};

/**
 * Notification Badge
 */
interface NotificationBadgeProps {
  className?: string;
  title?: string;
  numUnread?: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  numUnread = 0,
  className,
  title,
}) => (
  <IconBadge
    title={title}
    className={className}
    bgColor={Red500}
    fontColor={N0}
    icon={<NotificationIcon />}
  >
    {numUnread}
  </IconBadge>
);

/**
 * Subscribed Badge
 */
interface SubscribedBadgeProps {
  title?: string;
  className?: string;
}

export const SubscribedBadge: React.FC<SubscribedBadgeProps> = ({
  className,
  title,
}) => (
  <IconBadge
    title={title}
    className={className}
    dataTestClass={BadgesTestIds.CardSubscribed}
    icon={<SubscribeIcon />}
  />
);

/**
 * Trello Attachments Badge
 */
interface TrelloAttachmentsBadgeProps {
  className?: string;
  numAttachments?: number;
  title?: string;
}

export const TrelloAttachmentsBadge: React.FC<TrelloAttachmentsBadgeProps> = ({
  numAttachments = 0,
  className,
  title,
}) => (
  <IconBadge
    title={title}
    className={className}
    icon={<TrelloAttachmentIcon />}
  >
    {numAttachments}
  </IconBadge>
);

/**
 * Votes Badge
 */
interface VotesBadgeProps {
  className?: string;
  numVotes?: number;
  title?: string;
  voted?: boolean;
}

export const VotesBadge: React.FC<VotesBadgeProps> = ({
  className,
  numVotes = 0,
  voted = false,
  title,
}) => (
  <IconBadge
    title={title}
    className={className}
    bgColor={voted ? N40A : 'transparent'}
    fontColor={N100}
    icon={<VoteIcon />}
  >
    <span data-test-class={BadgesTestIds.CardSubscribed}>{numVotes}</span>
  </IconBadge>
);
