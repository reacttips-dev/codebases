import React from 'react';

import { Auth } from 'app/scripts/db/auth';
import { PopOver } from 'app/scripts/views/lib/pop-over';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('claimed_attachment');

import styles from './ClaimedAttachment.less';
import { OverflowMenuHorizontalIcon } from '@trello/nachos/icons/overflow-menu-horizontal';
import { AttachmentEditPopover } from './AttachmentEditPopover';

interface Attachment {
  id: string;
  date: string;
  name: string;
  url: string;
}

interface ClaimedAttachmentProps {
  attachment: Attachment;
  pluginName: string;
  mark: string;
  onRemoveAttachment: (idAttachment: string) => void;
}

export const ClaimedAttachment: React.FunctionComponent<ClaimedAttachmentProps> = ({
  attachment,
  pluginName,
  mark,
  onRemoveAttachment,
}) => {
  const dateAdded = new Date(attachment.date);
  // an empty string is bad, but undefined will make it fall back to browser locale
  const locale = Auth.myLocale() || undefined;
  const longDate = dateAdded.toLocaleString(locale, {
    dateStyle: 'long',
    timeStyle: 'medium',
  });
  const shortDate = dateAdded.toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
  });

  const openLink = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(attachment.url, attachment.url, 'noopener,noreferrer');
  };

  const editAttachment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    PopOver.toggle({
      elem: e.target,
      getViewTitle: () => format('edit-attachment'),
      reactElement: AttachmentEditPopover({
        onRemoveAttachment: () => {
          onRemoveAttachment(attachment.id);
        },
      }),
    });
  };

  return (
    // eslint-disable-next-line react/jsx-no-bind
    <div role="button" className={styles.attachmentCard} onClick={openLink}>
      <a
        className={styles.attachmentCover}
        href={attachment.url}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        title={attachment.name}
        rel="noreferrer nofollow noopener"
      >
        <img src={mark} height="40" width="40" alt={''} />
      </a>
      <div className={styles.attachmentDetail}>
        <div>
          <span className={styles.attachmentTitle}>{attachment.name}</span>
          <div className={styles.attachmentMeta}>
            <span className={styles.subtitle}>{pluginName}</span>
            <span className={styles.metaSeparator}> • </span>
            <span title={longDate}>{shortDate}</span>
          </div>
        </div>
        <a
          className={styles.attachmentMenu}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={editAttachment}
          role="button"
        >
          <OverflowMenuHorizontalIcon />
        </a>
      </div>
    </div>
  );
};
