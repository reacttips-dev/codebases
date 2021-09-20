import classNames from 'classnames';
import React from 'react';

import styles from './PowerUpAttachmentSectionSuggestion.less';
import { CloseIcon } from '@trello/nachos/icons/close';
import { ClaimedAttachment } from './ClaimedAttachment';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('power_up_attachment_section_suggestion');

interface Attachment {
  id: string;
  date: string;
  name: string;
  url: string;
}

export interface PowerUpAttachmentSectionSuggestionProps {
  attachments: Attachment[];
  name: string;
  overview: string;
  mark: string;
  onDismissBtn: (target: EventTarget) => void;
  onRemoveAttachment: (idAttachment: string) => void;
  onEnableBtn: (target: EventTarget) => void;
}

export const PowerUpAttachmentSectionSuggestion: React.FunctionComponent<PowerUpAttachmentSectionSuggestionProps> = ({
  attachments,
  name,
  overview,
  mark,
  onDismissBtn,
  onRemoveAttachment,
  onEnableBtn,
}) => {
  if (attachments.length === 0) {
    return null;
  }
  return (
    <div className="window-module">
      <div className={styles.moduleTitleBlock}>
        <img
          className={styles.mark}
          src={mark}
          height="24"
          width="24"
          alt={''}
        />
        <div className={styles.headerContent}>
          <h3 className={styles.moduleTitle}>{name}</h3>
          <div className={styles.headerActions}>
            <button
              className={classNames(styles.headerBtn, styles.dismissBtn)}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(e) => onDismissBtn(e.target)}
            >
              <CloseIcon />
            </button>
            <button
              className={classNames(styles.headerBtn, styles.enableBtn)}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(e) => onEnableBtn(e.target)}
            >
              <img
                className={styles.btnMark}
                src={mark}
                height="20"
                width="20"
                alt={''}
              />
              <span>{format('enable', { name })}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="u-gutter">
        <p className={styles.sectionMeta}>{overview}</p>
        <div className={styles.attachmentsGrid}>
          {attachments.map((attachment) => (
            <ClaimedAttachment
              key={attachment.id}
              pluginName={name}
              mark={mark}
              attachment={attachment}
              onRemoveAttachment={onRemoveAttachment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
