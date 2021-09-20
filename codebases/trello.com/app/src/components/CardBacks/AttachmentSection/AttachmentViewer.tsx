/* eslint-disable jsx-a11y/media-has-caption, @typescript-eslint/no-use-before-define */
import React, { useCallback, useMemo, useState } from 'react';
import { CloseIcon } from '@trello/nachos/icons/close';
import { ForwardIcon } from '@trello/nachos/icons/forward';
import { BackIcon } from '@trello/nachos/icons/back';
import { AttachmentModel, useAttachmentData } from './helpers';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { makePreviewCachable } from '@trello/image-previews';
import { Key, Scope, useShortcut } from '@trello/keybindings';

import styles from './AttachmentViewer.less';

const formatAttachment = forTemplate('attachment_thumb');
const formatViewerFrame = forTemplate('attachment_viewer_frame');

interface AttachmentViewerProps {
  isOpen: boolean;
  attachmentList: AttachmentList;
  currentAttachmentNode: AttachmentNode;
  closeViewer: () => void;
  viewPrev: () => void;
  viewNext: () => void;
}

export const useAttachmentViewer = (attachments: AttachmentModel[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState<AttachmentNode>(
    null,
  );
  const attachmentList = useMemo(() => new AttachmentList(attachments), [
    attachments,
  ]);

  const previewAttachment = useCallback(
    (attachment: AttachmentModel) => {
      const node = attachmentList.find(attachment);

      setIsOpen(true);
      setCurrentAttachment(node);
    },
    [setIsOpen, setCurrentAttachment, attachmentList],
  );

  const viewPrev = useCallback(() => {
    if (currentAttachment?.prev) {
      setCurrentAttachment(currentAttachment.prev);
    }
  }, [currentAttachment, setCurrentAttachment]);

  const viewNext = useCallback(() => {
    if (currentAttachment?.next) {
      setCurrentAttachment(currentAttachment.next);
    }
  }, [currentAttachment, setCurrentAttachment]);

  const closeViewer = useCallback(() => setIsOpen(false), [setIsOpen]);

  const viewerProps: AttachmentViewerProps = {
    attachmentList,
    isOpen,
    currentAttachmentNode: currentAttachment,
    closeViewer,
    viewPrev,
    viewNext,
  };

  return {
    previewAttachment,
    viewerProps,
  };
};

export const AttachmentViewer = ({
  isOpen,
  attachmentList,
  currentAttachmentNode,
  closeViewer,
  viewPrev,
  viewNext,
}: AttachmentViewerProps) => {
  const hasPrev = !!currentAttachmentNode?.prev;
  const hasNext = !!currentAttachmentNode?.next;

  const [isHintingPrev, setIsHintingPrev] = useState(false);
  const [isHintingNext, setIsHintingNext] = useState(false);

  const hintPrev = useCallback(() => setIsHintingPrev(true), [
    setIsHintingPrev,
  ]);
  const hintNext = useCallback(() => setIsHintingNext(true), [
    setIsHintingNext,
  ]);

  const removeHints = useCallback(() => {
    setIsHintingPrev(false);
    setIsHintingNext(false);
  }, [setIsHintingPrev, setIsHintingNext]);

  useShortcut(viewPrev, {
    scope: Scope.Modal,
    key: Key.ArrowLeft,
    enabled: isOpen,
  });

  useShortcut(viewNext, {
    scope: Scope.Modal,
    key: Key.ArrowRight,
    enabled: isOpen,
  });

  useShortcut(closeViewer, {
    scope: Scope.Modal,
    key: Key.Escape,
    enabled: isOpen,
  });

  if (!isOpen) return null;
  if (!currentAttachmentNode) return null;

  return (
    <div
      className={classNames(
        styles.attachmentViewer,
        isHintingPrev && hasPrev && styles.framesPrevHint,
        isHintingNext && hasNext && styles.framesNextHint,
      )}
    >
      <div className={styles.header} onClick={closeViewer} role="button">
        <span className={styles.headerCloseIcon}>
          <CloseIcon size="large" />
        </span>
      </div>

      <div className={styles.underlay} onClick={closeViewer} role="button" />

      <div className={styles.frames} onClick={closeViewer} role="button">
        {attachmentList.map((attachmentNode) => {
          let position = null;

          if (
            attachmentNode!.attachment.id ===
            currentAttachmentNode.attachment.id
          ) {
            position = 'center' as 'center';
          } else if (
            attachmentNode!.attachment.id ===
            currentAttachmentNode.prev?.attachment.id
          ) {
            position = 'left' as 'left';
          } else if (
            attachmentNode!.attachment.id ===
            currentAttachmentNode.next?.attachment.id
          ) {
            position = 'right' as 'right';
          }
          return (
            <AttachmentFrame
              key={attachmentNode!.attachment.id}
              attachment={attachmentNode!.attachment}
              position={position}
            />
          );
        })}
      </div>

      <div className={styles.overlay}>
        <AttachmentFrameDetails attachment={currentAttachmentNode.attachment} />
      </div>

      {currentAttachmentNode.prev && (
        <button
          className={styles.prevFrameButton}
          onMouseOver={hintPrev}
          onMouseOut={removeHints}
          onFocus={hintPrev}
          onBlur={removeHints}
          onClick={viewPrev}
        >
          <span className={styles.prevFrameButtonIcon}>
            <BackIcon color="light" size="large" />
          </span>
        </button>
      )}
      {currentAttachmentNode.next && (
        <button
          className={styles.nextFrameButton}
          onMouseOver={hintNext}
          onMouseOut={removeHints}
          onFocus={hintNext}
          onBlur={removeHints}
          onClick={viewNext}
        >
          <span className={styles.nextFrameButtonIcon}>
            <ForwardIcon color="light" size="large" />
          </span>
        </button>
      )}
    </div>
  );
};

const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

const AttachmentFrame = ({
  attachment,
  position,
}: {
  attachment: AttachmentModel;
  position: 'left' | 'center' | 'right' | null;
}) => {
  const {
    name,
    openText,
    previewData: {
      isAudio,
      isIFrameable,
      isImage,
      isPlaceholder,
      isVideo,
      url,
    },
  } = useAttachmentData(attachment);

  if (!position) return null;

  return (
    <div
      className={classNames(styles.frame, styles.frameLoaded, {
        [styles.frameLeft]: position === 'left',
        [styles.frameRight]: position === 'right',
      })}
    >
      <div className={styles.framePreviewWrapper}>
        <div
          className={classNames(styles.framePreview, {
            [styles.framePreviewImageWrapper]: isImage,
            [styles.center]: isAudio,
          })}
        >
          {isImage && (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <img
              className={styles.framePreviewImage}
              src={makePreviewCachable(attachment.url)}
              alt={name}
              onClick={stopPropagation}
            />
          )}
          {isAudio && (
            <audio
              className={styles.framePreviewAudio}
              controls
              onClick={stopPropagation}
            >
              <source src={url} />
            </audio>
          )}
          {isVideo && (
            <video
              className={styles.framePreviewVideo}
              src={url}
              controls
              onClick={stopPropagation}
            />
          )}
          {isIFrameable && (
            <iframe
              className={styles.framePreviewIframe}
              src={url}
              title={name}
            />
          )}
          {isPlaceholder && (
            <p className={styles.framePreviewPlaceholder}>
              {formatViewerFrame(
                'there-is-no-preview-available-for-this-attachment-opentext-safe',
                {
                  openLink: (
                    <a
                      href={url}
                      className={styles.framePreviewPlaceholderLink}
                      target="_blank\"
                      key={attachment.id}
                    >
                      {openText}
                    </a>
                  ),
                },
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const AttachmentFrameDetails = ({
  attachment,
}: {
  attachment: AttachmentModel;
}) => {
  const { name, relativeTimeAdded, metadata, openText } = useAttachmentData(
    attachment,
  );

  return (
    <div className={styles.frameDetails}>
      <h2 className={styles.frameDetailsTitle}>{name}</h2>
      <p>
        {formatAttachment('added-relative', {
          relativeTimeInPast: relativeTimeAdded,
        })}
        {metadata && (
          <>
            {' - '}
            {metadata}
          </>
        )}
      </p>
      <p>
        <a href={attachment.url} target="_blank">
          <span className={styles.optionIcon}>
            <ExternalLinkIcon color="light" size="small" />
          </span>
          {openText}
        </a>
      </p>
    </div>
  );
};

type AttachmentNode = null | {
  attachment: AttachmentModel;
  next: AttachmentNode | null;
  prev: AttachmentNode | null;
};

class AttachmentList {
  private _head: AttachmentNode = null;

  constructor(attachments: AttachmentModel[]) {
    for (let i = attachments.length - 1; i >= 0; i--) {
      const attachment = attachments[i];

      const node: AttachmentNode = {
        attachment,
        next: this._head,
        prev: null,
      };

      if (this._head) {
        this._head.prev = node;
      }

      this._head = node;
    }
  }

  find(attachment: AttachmentModel): AttachmentNode {
    let current = this._head;

    while (current !== null) {
      if (current.attachment.id === attachment.id) {
        return current;
      }
      current = current.next;
    }

    return null;
  }

  map<T>(callback: (attachmentNode: AttachmentNode) => T) {
    const values: T[] = [];

    let current = this._head;

    while (current !== null) {
      values.push(callback(current));
      current = current.next;
    }

    return values;
  }

  get head() {
    return this._head;
  }
}
