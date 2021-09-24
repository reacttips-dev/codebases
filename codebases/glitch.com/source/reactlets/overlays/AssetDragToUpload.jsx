import React, { useEffect, useRef } from 'react';
import { useNotifications } from '@glitchdotcom/shared-components';
import uuid from 'uuid';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import createAssetUtils from '../../utils/assets';
import { cancelEvent, isTextFile } from '../../util';
import { UploadLocalFileOnly } from '../NotificationTemplates';

export default function AssetDragToUpload() {
  const application = useApplication();
  const { createNotification } = useNotifications();
  const visible = useObservable(application.dragToUploadOverlayVisible);
  const destination = typeof visible === 'string' ? visible : null;
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const assetUtils = useRef();
  const activeDragOvers = useRef(0);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);

  if (!assetUtils.current) {
    assetUtils.current = createAssetUtils(application);
  }

  const paste = (e) => {
    const { items } = e.clipboardData;

    Array.from(items).forEach((item) => {
      if (item.kind === 'file') {
        // Add random UUID to pasted files as they often (always?) have a
        // generic filename that may match other pasted files.
        const originalFile = item.getAsFile();
        const renamedFile = new File([originalFile], `${uuid()}.${originalFile.name}`, {
          type: originalFile.type,
          lastModified: originalFile.lastModified,
        });
        assetUtils.current.addFile(renamedFile);
      }
    });
  };

  useEffect(() => {
    const dragEnter = (e) => {
      e.preventDefault();
      activeDragOvers.current += 1;

      const isDraggingLocalFile = e.dataTransfer && e.dataTransfer.types.includes('Files');
      if (!isDraggingLocalFile || application.userIsDraggingText()) {
        return;
      }

      let isDraggingMediaFiles;
      let isDraggingTextFiles;
      for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
        if (isTextFile(e.dataTransfer.items[i])) {
          isDraggingTextFiles = true;
        } else {
          isDraggingMediaFiles = true;
        }

        // user is dragging both types of files
        if (isDraggingMediaFiles && isDraggingTextFiles) {
          break;
        }
      }

      let uploadDestination = 'your project';
      // dragging only text files
      if (isDraggingTextFiles && !isDraggingMediaFiles) {
        uploadDestination = "your project's files";
      }
      // dragging only media files
      if (isDraggingMediaFiles && !isDraggingTextFiles) {
        uploadDestination = 'assets';
      }

      application.dragToUploadOverlayVisible(uploadDestination);
    };

    const dragLeave = () => {
      activeDragOvers.current -= 1;
      if (activeDragOvers.current < 1) {
        application.dragToUploadOverlayVisible(false);
      }
    };

    const drop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      activeDragOvers.current = 0;

      if (e.dataTransfer.files.length >= 1) {
        for (const file of Array.from(e.dataTransfer.files)) {
          assetUtils.current.addFile(file);
        }
      } else if (e.dataTransfer.types.includes('text/uri-list')) {
        // Notify if the user was trying to drop a list of URLs (e.g. dropping
        // and image from another webpage)
        createNotification(UploadLocalFileOnly);
      }

      application.dragToUploadOverlayVisible(false);
    };

    const showMessage = (e) => {
      e.preventDefault();
      application.notifyProjectVisitorCannotUploadAssets(true);
      application.jiggleTakeActionToEditNotification(true);
    };

    const el = document.documentElement;

    if (isMember) {
      // Checks if user attempting to drag and drop assets is at least a project member
      el.addEventListener('paste', paste);
      el.addEventListener('dragover', cancelEvent);
      el.addEventListener('dragenter', dragEnter);
      el.addEventListener('dragleave', dragLeave);
      el.addEventListener('drop', drop);
    } else {
      // Show project visitor an error notification
      el.addEventListener('dragover', cancelEvent);
      el.addEventListener('dragenter', cancelEvent);
      el.addEventListener('drop', showMessage);
    }

    return () => {
      el.removeEventListener('paste', paste);
      el.removeEventListener('dragover', cancelEvent);
      el.removeEventListener('dragenter', dragEnter);
      el.removeEventListener('dragenter', cancelEvent);
      el.removeEventListener('dragleave', dragLeave);
      el.removeEventListener('drop', drop);
      el.removeEventListener('drop', showMessage);
    };
  }, [application, isMember, createNotification]);

  if (!visible || projectIsReadOnlyForCurrentUser) {
    return null;
  }

  const emojiClass = `emoji ${destination === 'assets' ? 'truck' : 'paperclip'}`;

  return (
    <div className="overlay-background">
      <div className="overlay drag-to-upload">
        <p>Drop to upload to {destination}</p>
        <div className={emojiClass} />
      </div>
    </div>
  );
}
