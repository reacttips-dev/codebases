import React from 'react';
import { useNotifications } from '@glitchdotcom/shared-components';
import classnames from 'classnames';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import whenKeyIsEnter from '../utils/whenKeyIsEnter';
import File from './File';
import CenterTruncatedText from './CenterTruncatedText';
import SearchResultsBadge from './filetree/SearchResultsBadge';
import UserPresenceBadge from './filetree/UserPresenceBadge';
import RewindStateBadge from './filetree/RewindStateBadge';
import { useFiletreeEntryOptionsPop } from './pop-overs/FiletreeEntryOptionsPop';
import { pathIsInvalid } from '../util';
import { ProjectIsReadOnlyForCurrentUser } from './NotificationTemplates';

export default function Folder({ folder }) {
  const application = useApplication();
  const { createNotification } = useNotifications();
  const searchResults = useObservable(application.fileSearch.searchedResults);
  const editorIsPreviewingRewind = useObservable(application.editorIsPreviewingRewind);
  const currentUser = useObservable(application.currentUser);

  const renamingFolder = useObservable(folder.renaming);
  const folderId = useObservable(folder.uuid);
  const openFolderIds = useObservable(application.openFolderIds);

  const { pop: fileOptionsPop, toggle: toggleFileOptionsPop } = useFiletreeEntryOptionsPop();

  const folderPath = () => {
    // During rewind, we can't get paths from OT state, because they only go there when the rewind is accepted.
    // We therefore use the rewindPreviewPath on the folder that is built during rewind
    // TODO: We should enable these to be combined in a future version of the editor.
    if (editorIsPreviewingRewind) {
      return folder.rewindPreviewPath();
    }

    // If we're not in rewind, we try to get the path from OT.
    // It might not be there, as Jadelet/Observables seems to keep some state around (due to a bug with handling code behind conditionals,
    // which are included in the filetree logic), so we have to account for that case too
    const otPath = application.otClient().idToPath(folderId);

    // ot Paths have "./" at the front, so we have to strip that off in the response.
    // We also add "/" to the end, so we make sure we're not comparing with folder names that are substrings of other folder names.
    return otPath ? `${otPath.substring(2)}/` : '';
  };

  const pathInFolder = (path) => {
    if (folderPath() === '') {
      return false;
    }
    return path.startsWith(folderPath());
  };

  const badgeIfSearchResults = () => {
    const matches = searchResults.filter((result) => {
      return pathInFolder(result.path);
    });
    return matches.length > 0 ? <SearchResultsBadge resultCount={matches.length} /> : false;
  };

  const badgeIfRewindChangedFolder = () => {
    // See if *all* of the files included at any level in this folder were added by rewind.
    // If so, this folder counts as added too.
    const filesInFolder = application.files().filter((file) => {
      return pathInFolder(file.path());
    });
    const added = filesInFolder.every((file) => file.addedByRewind());
    if (added) return <RewindStateBadge state="modified" />;

    // We only get here if added is not true
    const deleted = filesInFolder.every((file) => file.deletedByRewind());
    if (deleted) return <RewindStateBadge state="deleted" />;

    // If added or deleted is not true, then see if any of the files in this folder were added, removed or modified.
    // If so, this folder counts as modified too.
    const modified = application.files().some((file) => {
      return pathInFolder(file.path()) && (file.modifiedByRewind() || file.addedByRewind() || file.deletedByRewind());
    });
    if (modified) return <RewindStateBadge state="modified" />;

    return false;
  };

  const badgeIfUsersViewingFolder = () => {
    const currentUsersViewingFolder = application.currentUsers().filter((user) => {
      // If it's the current user, we don't show a badge
      if (user.id() === currentUser.id()) {
        return false;
      }
      const userCurrentFile = application.fileByUuid(user.currentDocument());
      return userCurrentFile ? pathInFolder(userCurrentFile.path()) : false;
    });
    return currentUsersViewingFolder.length > 0 ? <UserPresenceBadge users={currentUsersViewingFolder} /> : false;
  };

  const folderIndentation = () => {
    return { paddingLeft: `${5 + folder.level() * 12}px` };
  };

  const handleRename = (newName) => {
    const oldName = folder.name();
    let invalid = false;
    folder.renaming(false);

    if (newName === oldName) {
      invalid = true;
    } else if (newName === '') {
      invalid = true;
    }
    // TODO: once we fix file renaming to only be for the filename part (i.e. users won't be putting the path in there),
    // this check for "/" can go into pathIsInvalid for both files and folders
    else if (pathIsInvalid(newName) || newName.indexOf('/') !== -1) {
      invalid = true;
      application.notifyInvalidFolderName(true);
    }
    // check to see if this folder's parent already contains a folder with this new name that is currently visible
    // Note that OT keeps old folders around, so it may already have a folder with that name that's not currently being used.
    else {
      const { parentId } = application.otClient().documentImmediate(folderId);
      const existingFolderId = application.otClient().documentImmediate(parentId).children[newName];
      if (existingFolderId) {
        const existingFolderPath = application
          .otClient()
          .idToPath(existingFolderId)
          .substring(2);
        // See if there are already files in this folder
        const filesAlreadyInFolder = application.files().some((file) => {
          return file.path().startsWith(existingFolderPath);
        });
        if (filesAlreadyInFolder.length > 0) {
          invalid = true;
          application.notifyInvalidFolderName(true);
        }
      }
    }

    if (!invalid) {
      application.renameFolder(folderId, folderPath(), newName);
    }
  };

  const enableRename = () => {
    if (application.projectIsReadOnlyForCurrentUser()) {
      return createNotification(ProjectIsReadOnlyForCurrentUser);
    }
    if (!application.projectIsReadOnlyForCurrentUser() && !editorIsPreviewingRewind) {
      return folder.renaming(true);
    }
    return false;
  };

  const inputBlurHandler = (event) => {
    // Question for Chance: using renamingFolder does not work here
    if (folder.renaming()) {
      handleRename(event.target.value);
    }
  };

  const inputRenameHandler = (event) => {
    if (['Enter', 'Escape', 'Tab'].includes(event.key)) {
      handleRename(event.target.value);
    }
  };

  const shouldFolderBeOpen = () => {
    // If the application state currently shows this folder open, display it open
    if (openFolderIds.has(folderId)) {
      return true;
    }
    return false;
  };

  const toggleOpen = (event) => {
    event.preventDefault();
    if (renamingFolder) {
      return;
    }

    // nested folders all get clicked, so we need to make sure only the one directly under the click
    // is the one that gets the select event
    const summaryEl = event.target.closest('summary');
    if (!(summaryEl.dataset.id && summaryEl.dataset.id === folderId)) {
      return;
    }
    application.changeOpenFolderIds(folderId);
  };

  const summaryClassName = classnames({
    'folder-path': true,
    other: true,
    active: application.selectedFile() && pathInFolder(application.selectedFile().path()),
  });

  return (
    <>
      <li
        className="filetree-child folder"
        /* ESLINT-CLEAN-UP */
        /* eslint-disable-next-line */
        title={folder.name()}
      >
        <details open={shouldFolderBeOpen()}>
          {/* ESLINT-CLEAN-UP */
          /* eslint-disable-next-line */}
          <summary className={summaryClassName} style={folderIndentation()} onClick={toggleOpen} onDoubleClick={enableRename} data-id={folderId}>
            {badgeIfUsersViewingFolder()}
            {badgeIfRewindChangedFolder()}
            {badgeIfSearchResults()}
            {renamingFolder ? (
              <input
                className="input folder-rename-input"
                /* eslint-disable-next-line */
                autoFocus
                onBlur={inputBlurHandler}
                onKeyUp={whenKeyIsEnter(inputRenameHandler)}
                spellCheck="false"
                defaultValue={`${folder.name()}`}
                data-testid="folder-rename-input"
              />
            ) : (
              <div className="display-folder-name">
                <CenterTruncatedText text={`${folder.name()}/`} />
              </div>
            )}
            {!application.projectIsReadOnlyForCurrentUser() && !editorIsPreviewingRewind && (
              /* ESLINT-CLEAN-UP */
              /* eslint-disable-next-line */
              <div
                className="options icon opens-pop-over"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const element = e.currentTarget;
                  const rect = element.getBoundingClientRect();
                  toggleFileOptionsPop(folder, rect.top, rect.left);
                }}
              />
            )}
          </summary>
          {folder.children().map((entry) => {
            if (entry.type() === 'file') {
              return <File file={entry} key={entry.id()} />;
            }
            return <Folder folder={entry} key={entry.id()} />;
          })}
        </details>
      </li>
      {fileOptionsPop}
    </>
  );
}
