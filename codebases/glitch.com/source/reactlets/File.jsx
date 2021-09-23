import React from 'react';
import { useNotifications } from '@glitchdotcom/shared-components';
import classnames from 'classnames';
import { basename } from 'path';
import CenterTruncatedText from './CenterTruncatedText';

import SearchResultsBadge from './filetree/SearchResultsBadge';
import UserPresenceBadge from './filetree/UserPresenceBadge';
import RewindStateBadge from './filetree/RewindStateBadge';
import DotenvIcon from '../components/icons/DotEnvIcon';

import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import whenKeyIsEnter from '../utils/whenKeyIsEnter';
import { useFiletreeEntryOptionsPop } from './pop-overs/FiletreeEntryOptionsPop';
import { ProjectIsReadOnlyForCurrentUser } from './NotificationTemplates';

const { pathIsInvalid } = require('../util');
const { ASSET_FILE_PATH, APP_TYPE_CONFIG_FILE_PATH } = require('../const');

const hiddenFiles = [ASSET_FILE_PATH, APP_TYPE_CONFIG_FILE_PATH];

export default function File({ file, options = {} }) {
  const application = useApplication();
  const { createNotification } = useNotifications();

  if (options.prefix == null) {
    options.prefix = /^/;
  }
  if (options.exclude == null) {
    options.exclude = /a^/;
  }
  const selectedFileId = useObservable(application.selectedFileId);
  const searchResults = useObservable(application.fileSearch.searchedResults);
  const editorIsPreviewingRewind = useObservable(application.editorIsPreviewingRewind);
  const filesWithDiffTooBig = useObservable(application.filesWithDiffTooBig);
  const currentUser = useObservable(application.currentUser);

  const renamingFile = useObservable(file.renaming);
  const fileId = useObservable(file.uuid);
  const filePath = useObservable(file.path);
  const modifiedByRewind = useObservable(file.modifiedByRewind);
  const addedByRewind = useObservable(file.addedByRewind);
  const deletedByRewind = useObservable(file.deletedByRewind);
  const extensionType = useObservable(file.extensionType);

  const { pop: fileOptionsPop, toggle: toggleFileOptionsPop } = useFiletreeEntryOptionsPop();

  const fileNameWithoutExtension = () => {
    return basename(file.name(), `.${file.extension()}`);
  };

  const folderIndentation = () => {
    return { paddingLeft: `${5 + file.folders().length * 12}px` };
  };

  const getFileNameFromPath = (path) => path.replace(/(.*\/)/g, '');

  const handleRename = (newPath) => {
    const originalPath = filePath;
    file.renaming(false);

    let invalid = false;
    if (newPath === originalPath) {
      invalid = true;
    } else {
      const newFileName = getFileNameFromPath(newPath);
      if (newFileName === '') {
        invalid = true;
      } else if (pathIsInvalid(newPath)) {
        invalid = true;
        application.notifyInvalidFileName(true);
      } else if (application.fileByPath(newPath)) {
        // A file with that name exists
        invalid = true;
      }
    }

    if (!invalid) {
      application.renameFile(file, newPath);
    }
  };

  const hidden = () => {
    const hide = !filePath.match(options.prefix) || filePath.match(options.exclude) || hiddenFiles.includes(filePath);
    /* istanbul ignore else */
    if (hide) {
      return true;
    }
    return false;
  };
  const inputBlurHandler = (event) => {
    if (renamingFile) {
      handleRename(event.target.value);
    }
  };

  const inputRenameHandler = (event) => {
    if (['Enter', 'Escape', 'Tab'].includes(event.key)) {
      handleRename(event.target.value);
    }
  };

  const badgeIfSearchResults = () => {
    const matches = searchResults.filter((result) => result.path === filePath);
    return matches.length > 0 ? <SearchResultsBadge resultCount={matches.length} /> : false;
  };

  const enableRename = () => {
    if (application.projectIsReadOnlyForCurrentUser()) {
      createNotification(ProjectIsReadOnlyForCurrentUser);
    }
    if (!(application.projectIsReadOnlyForCurrentUser() || editorIsPreviewingRewind)) {
      return file.renaming(true);
    }
    return false;
  };

  const badgeIfRewindChangedFile = () => {
    if (filesWithDiffTooBig.includes(filePath)) {
      return false;
    }
    if (modifiedByRewind) {
      return <RewindStateBadge state="modified" />;
    }
    if (addedByRewind) {
      return <RewindStateBadge state="added" />;
    }
    if (deletedByRewind) {
      return <RewindStateBadge state="deleted" />;
    }
    return false;
  };

  const select = (event) => {
    event.stopPropagation();
    if (
      application.files().includes(file) &&
      // If we're in the process of renaming this file, don't select it
      !renamingFile &&
      // If we're disconnected, only switch if the file is already loaded
      (application.otClient().isConnected() || file.session)
    ) {
      application.selectTextFile();
      return application.selectFileByUuid(fileId);
    }
    return undefined;
  };

  const badgeIfUsersViewingFile = () => {
    const currentUsersViewingFile = application.currentUsers().filter((user) => {
      // If it's the current user, we don't show a badge
      if (user.id() === currentUser.id()) {
        return false;
      }
      if (user.currentDocument() === fileId) {
        return true;
      }
      return false;
    });
    return currentUsersViewingFile.length > 0 ? <UserPresenceBadge users={currentUsersViewingFile} /> : false;
  };

  const className = classnames({
    'filetree-child': true,
    file: true,
    active: fileId === selectedFileId,
    hidden: hidden(),
    [extensionType]: true,
  });

  return (
    <>
      {/* ESLINT-CLEAN-UP */}
      {/* eslint-disable-next-line */}
      <li
        className={className}
        onClick={select}
        onDoubleClick={enableRename}
        onKeyUp={whenKeyIsEnter(select)}
        style={folderIndentation()}
        /* ESLINT-CLEAN-UP */
        /* eslint-disable-next-line */
        tabIndex="0"
        title={filePath}
      >
        {badgeIfUsersViewingFile()}
        {badgeIfRewindChangedFile()}
        {badgeIfSearchResults()}
        {filePath === '.env' && <DotenvIcon />}
        {renamingFile ? (
          <input
            className="input file-rename-input"
            /* eslint-disable-next-line */
            autoFocus
            onBlur={inputBlurHandler}
            onKeyUp={whenKeyIsEnter(inputRenameHandler)}
            spellCheck="false"
            defaultValue={`${filePath}`}
            data-testid="file-rename-input"
          />
        ) : (
          <div className="display-file-name" aria-label={file.name()}>
            <span className="filename">
              <CenterTruncatedText text={fileNameWithoutExtension()} />
              <span className={`extension-type ${extensionType}`}>{file.extension() && `.${file.extension()}`}</span>
            </span>
          </div>
        )}
        {!application.projectIsReadOnlyForCurrentUser() && !editorIsPreviewingRewind && (
          /* ESLINT-CLEAN-UP */
          /* eslint-disable-next-line */
          <div
            className="options icon opens-pop-over"
            onClick={(e) => {
              e.stopPropagation();
              const element = e.currentTarget;
              const rect = element.getBoundingClientRect();
              toggleFileOptionsPop(file, rect.top, rect.left);
            }}
          />
        )}
      </li>
      {fileOptionsPop}
    </>
  );
}
