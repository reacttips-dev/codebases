import React, { useMemo } from 'react';
import classNames from 'classnames';
import { CheckboxCheckedIcon } from '@trello/nachos/icons/checkbox-checked';
import { Checkbox } from '@trello/nachos/checkbox';
import {
  MarkdownContentType,
  TrelloMarkdown,
} from 'app/src/components/TrelloMarkdown';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { DueDateBadge } from 'app/src/components/DueDateBadge';
import { forTemplate } from '@trello/i18n';
import { MemberState } from 'app/scripts/view-models/member-state';
import {
  FriendlyLinksRenderer,
  FRIENDLY_LINKS_CONTAINER_CLASS,
} from 'app/gamma/src/components/friendly-links-renderer';

import { CardBackSectionHeading } from './CardBackSectionHeading';

import styles from './ChecklistSection.less';

const formatChecklist = forTemplate('checklist');

interface CheckItemModel {
  id: string;
  name: string;
  nameData?: string | null;
  pos: number;
  state: 'complete' | 'incomplete';
  due?: string | null;
  idMember?: string | null;
}

interface ChecklistModel {
  id: string;
  name: string;
  pos: number;

  checkItems: CheckItemModel[];
}

interface ChecklistSectionProps {
  checklist: ChecklistModel;
}

const ProgressBar = ({
  numChecked,
  totalCount,
}: {
  numChecked: number;
  totalCount: number;
}) => {
  const percent =
    totalCount > 0 ? Math.round((100 * numChecked) / totalCount) : 0;

  return (
    <div className={styles.progressSection}>
      <div className={styles.progressPercentage}>{percent}%</div>
      <div className={styles.progressBarBackground}>
        <div
          className={classNames(styles.progressBarForeground, {
            [styles.complete]: totalCount > 0 && numChecked === totalCount,
          })}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const CheckItem = ({
  name,
  nameData,
  state,
  due,
  idMember,
}: CheckItemModel) => {
  const customEmojis = {
    textData: JSON.parse(nameData || '{ "emoji": {} }'),
  };

  const dueDate = due ? new Date(due) : null;
  const hasDueDate = dueDate && !isNaN(dueDate.valueOf());

  const isComplete = state === 'complete';

  return (
    <div className={styles.checkItem}>
      <Checkbox readOnly isChecked={isComplete} className={styles.checkbox} />

      <FriendlyLinksRenderer>
        <div
          className={classNames(
            styles.checkItemName,
            isComplete && styles.complete,
          )}
        >
          <div className={FRIENDLY_LINKS_CONTAINER_CLASS}>
            <TrelloMarkdown
              contentType={MarkdownContentType.CheckItems}
              text={name}
              options={customEmojis}
            />
          </div>
        </div>
      </FriendlyLinksRenderer>

      <div className={styles.dueDateAndAvatar}>
        {idMember && (
          <MemberAvatar
            className={styles.avatarContainer}
            avatarClassName={styles.avatar}
            idMember={idMember}
            size={30}
          />
        )}
        {hasDueDate && (
          <DueDateBadge
            className={styles.dueDate}
            due={dueDate}
            complete={isComplete}
          />
        )}
      </div>
    </div>
  );
};

export const ChecklistSection = ({ checklist }: ChecklistSectionProps) => {
  const isHidingCheckedItems = MemberState.getCollapsedChecklists().includes(
    checklist.id,
  );

  const checkItems = useMemo(() => {
    const checkItems = isHidingCheckedItems
      ? checklist.checkItems.filter((c) => c.state !== 'complete')
      : [...checklist.checkItems];

    return checkItems.sort((a, b) => {
      return a.pos - b.pos;
    });
  }, [checklist.checkItems, isHidingCheckedItems]);

  const numCheckedItems = useMemo(() => {
    return checklist.checkItems.reduce(
      (sum, c) => (c.state === 'complete' ? sum + 1 : sum),
      0,
    );
  }, [checklist.checkItems]);

  return (
    <div>
      <CardBackSectionHeading
        title={checklist.name}
        icon={<CheckboxCheckedIcon size="large" />}
      />
      <ProgressBar
        numChecked={numCheckedItems}
        totalCount={checklist.checkItems.length}
      />
      {isHidingCheckedItems &&
        numCheckedItems === checklist.checkItems.length && (
          <p className={styles.everythingCompleteMessage}>
            {formatChecklist('everything-in-this-checklist-is-complete')}
          </p>
        )}
      <div>
        {checkItems.map((checkItem) => (
          <CheckItem key={checkItem.id} {...checkItem} />
        ))}
      </div>
    </div>
  );
};
