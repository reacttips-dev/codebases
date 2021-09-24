import React, { useCallback, useEffect, useState } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import classnames from 'classnames';
import PopPortal from '../../components/PopPortal';
import useApplication from '../../hooks/useApplication';

const { access } = require('../../const');

export default function FiletreeEntryOptionsPop({ entry, top, left }) {
  const application = useApplication();

  const style = () => {
    const POP_HEIGHT = 120;
    const LEFT_OFFSET = 18;
    const minPositionFromBottom = window.innerHeight - POP_HEIGHT;
    if (minPositionFromBottom < top) {
      return {
        top: `${minPositionFromBottom}px`,
        left: `${left + LEFT_OFFSET}px`,
      };
    }
    return {
      top: `${top + 15}px`,
      left: `${left + LEFT_OFFSET}px`,
    };
  };

  const extensionType = entry.type() === 'file' ? entry.extensionType : '';

  const canEditFiletreeEntry = () => {
    if (application.projectAccessLevelForCurrentUser() < access.HELPER) {
      return false;
    }
    if (entry.type() === 'file' && entry.hasImmutableFilename()) {
      return false;
    }
    return true;
  };

  const renameEntry = () => {
    application.closeAllPopOvers();
    if (entry.type() === 'folder') {
      return application.actionInterface.renameFolder(entry);
    }
    return application.actionInterface.renameFile(entry);
  };

  const deleteEntry = () => {
    application.closeAllPopOvers();
    if (entry.type() === 'folder') {
      return application.actionInterface.deleteFolder(entry);
    }
    return application.actionInterface.deleteFile(entry);
  };

  const copyEntry = () => {
    application.closeAllPopOvers();
    if (entry.type() === 'folder') {
      return null;
    }
    return application.actionInterface.copyFile(entry);
  };

  const addFileToFolderEntry = () => {
    application.closeAllPopOvers();
    application.selectedFolder(entry);
    application.newFilePopVisible(true);
  };

  return (
    <PopPortal>
      <dialog className={classnames('pop-over', 'mini-pop', 'file-options-pop', extensionType)} style={style()} data-testid="filetree-options-pop">
        {canEditFiletreeEntry() && (
          /* ESLINT-CLEAN-UP */
          /* eslint-disable-next-line */
          <div className="mini-pop-action" onClick={renameEntry} data-testid="rename">
            Rename
            <Icon icon="eyes" />
          </div>
        )}
        {entry.type() !== 'folder' && canEditFiletreeEntry() && (
          /* ESLINT-CLEAN-UP */
          /* eslint-disable-next-line */
          <div className="mini-pop-action" onClick={copyEntry} data-testid="duplicate">
            Duplicate
            <Icon icon="two" />
          </div>
        )}
        {entry.type() === 'folder' && canEditFiletreeEntry() && (
          /* ESLINT-CLEAN-UP */
          /* eslint-disable-next-line */
          <div className="mini-pop-action" onClick={addFileToFolderEntry} data-testid="add-file-to-folder">
            Add File to Folder
            <Icon icon="seedling" />
          </div>
        )}
        {application.projectAccessLevelForCurrentUser() >= access.MEMBER && (
          /* ESLINT-CLEAN-UP */
          /* eslint-disable-next-line */
          <div className="mini-pop-action" onClick={deleteEntry} data-testid="delete">
            Delete
            <Icon icon="bomb" />
          </div>
        )}
      </dialog>
    </PopPortal>
  );
}

export function useFiletreeEntryOptionsPop() {
  const application = useApplication();
  const [props, setProps] = useState(null);

  const pop = props ? <FiletreeEntryOptionsPop {...props} /> : null;

  const show = useCallback((entry, top, left) => {
    setProps({ entry, top, left });
  }, []);

  const hide = useCallback(() => {
    setProps(null);
  }, []);

  const toggle = useCallback(
    (entry, top, left) => {
      application.closeAllPopOvers();
      setProps((currentProps) => (currentProps ? null : { entry, top, left }));
    },
    [application],
  );

  useEffect(() => {
    return application.onCloseAllPopOvers(hide);
  }, [application, hide]);

  return { pop, show, hide, toggle };
}
