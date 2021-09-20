/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import { AttachmentIcon } from '@trello/nachos/icons/attachment';
import { BoardIcon } from '@trello/nachos/icons/board';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { forNamespace, forTemplate } from '@trello/i18n';
import { CardBackSectionHeading } from 'app/src/components/CardBacks/CardBackSectionHeading';
import { Gutter } from 'app/src/components/CardBacks/Gutter';
import { parseTrelloUrl } from 'app/scripts/lib/util/url/parse-trello-url';
import { TrelloBoardAttachment } from './TrelloBoardAttachment';
import { TrelloCardAttachment } from './TrelloCardAttachment';
import moment from 'moment';
import {
  AttachmentModel,
  useAttachmentData,
  useHideAttachments,
  useSeparateAttachments,
} from './helpers';

import styles from './AttachmentSection.less';
import { useAttachmentViewer, AttachmentViewer } from './AttachmentViewer';

const localize = forNamespace('');
const formatCardDetail = forTemplate('card_detail');
const formatAttachment = forTemplate('attachment_thumb');

interface AttachmentSectionProps {
  attachments: AttachmentModel[];
}

export const AttachmentSection = ({ attachments }: AttachmentSectionProps) => {
  const { trelloAttachments, normalAttachments } = useSeparateAttachments(
    attachments,
  );

  return (
    <>
      {trelloAttachments.length > 0 && (
        <TrelloAttachments attachments={trelloAttachments} />
      )}
      {normalAttachments.length > 0 && (
        <Attachments attachments={normalAttachments} />
      )}
    </>
  );
};

const TrelloAttachments = ({ attachments }: AttachmentSectionProps) => {
  const {
    hasMoreAttachments,
    isHidingAttachments,
    toggleViewMore,
    displayedAttachments,
  } = useHideAttachments(attachments);

  return (
    <div>
      <CardBackSectionHeading
        title={formatCardDetail('trello attachments')}
        icon={<BoardIcon size="large" />}
      />
      <Gutter>
        <div className={styles.trelloAttachments}>
          {displayedAttachments.map((attachment) => (
            <TrelloAttachment key={attachment.id} attachment={attachment} />
          ))}
        </div>
        {hasMoreAttachments && (
          <button
            onClick={toggleViewMore}
            className={styles.toggleViewMoreButton}
          >
            {isHidingAttachments
              ? localize('view all trello attachments', {
                  hiddenCount: attachments.length - displayedAttachments.length,
                })
              : formatCardDetail('show-fewer-trello-attachments')}
          </button>
        )}
      </Gutter>
    </div>
  );
};

const Attachments = ({ attachments }: AttachmentSectionProps) => {
  const {
    hasMoreAttachments,
    isHidingAttachments,
    toggleViewMore,
    displayedAttachments,
  } = useHideAttachments(attachments);
  const { previewAttachment, viewerProps } = useAttachmentViewer(attachments);

  return (
    <div>
      <CardBackSectionHeading
        title={formatCardDetail('attachments')}
        icon={<AttachmentIcon size="large" />}
      />
      <Gutter>
        <div className={styles.attachments}>
          {displayedAttachments.map((attachment) => (
            <Attachment
              key={attachment.id}
              attachment={attachment}
              previewAttachment={previewAttachment}
            />
          ))}
        </div>
        {hasMoreAttachments && (
          <button
            onClick={toggleViewMore}
            className={styles.toggleViewMoreButton}
          >
            {isHidingAttachments
              ? localize('view all attachments', {
                  hiddenCount: attachments.length - displayedAttachments.length,
                })
              : formatCardDetail('show-fewer-attachments')}
          </button>
        )}
      </Gutter>
      <AttachmentViewer {...viewerProps} />
    </div>
  );
};

const TrelloAttachment = ({ attachment }: { attachment: AttachmentModel }) => {
  const { type, shortLink } = parseTrelloUrl(attachment.url);

  return (
    <div className={styles.trelloAttachment}>
      {type === 'card' ? (
        <TrelloCardAttachment shortLink={shortLink!} />
      ) : (
        <TrelloBoardAttachment shortLink={shortLink!} />
      )}
    </div>
  );
};

interface AttachmentProps {
  attachment: AttachmentModel;
  previewAttachment: (attachment: AttachmentModel) => void;
}

const Attachment = ({ attachment, previewAttachment }: AttachmentProps) => {
  const {
    thumbnailStyles,
    preview,
    relativeTimeAdded,
    name,
    thumbnailLogoClass,
    canPreview,
    extension,
  } = useAttachmentData(attachment);

  const link = useRef<HTMLAnchorElement>(null);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) {
        return;
      }

      if (!canPreview) {
        if (!link.current?.contains(e.target)) {
          link.current?.click();
        }
      } else {
        e.preventDefault();
        previewAttachment(attachment);
      }
    },
    [canPreview, link, previewAttachment, attachment],
  );

  return (
    <div className={styles.attachment} onClick={onClick} role="button">
      <a
        className={styles.attachmentThumbnail}
        style={thumbnailStyles}
        href={attachment.url}
        target="_blank"
        title={name}
        rel="noreferrer nofollow noopener"
        ref={link}
      >
        {thumbnailLogoClass && (
          <span
            className={classNames(
              styles.attachmentThumbnailServiceLogo,
              thumbnailLogoClass,
            )}
          ></span>
        )}
        {!preview && !thumbnailLogoClass && extension && (
          <span className={styles.attachmentExtension}>{extension}</span>
        )}
        {!preview && !thumbnailLogoClass && !extension && (
          <span className={styles.attachmentThumbnailAttachmentIcon}>
            <AttachmentIcon size="large" />
          </span>
        )}
      </a>
      <div className={styles.attachmentDetails}>
        <span className={styles.attachmentName}>{name}</span>
        <a
          className={styles.attachmentAction}
          href={attachment.url}
          target="_blank"
          rel="noreferrer nofollow noopener"
        >
          <ExternalLinkIcon size="xsmall" />
        </a>
        <div
          className={styles.attachmentDate}
          title={moment(attachment.date).format('LLL')}
        >
          {formatAttachment('added-relative', {
            relativeTimeInPast: relativeTimeAdded,
          })}
        </div>
      </div>
    </div>
  );
};
