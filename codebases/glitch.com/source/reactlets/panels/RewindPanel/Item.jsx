import React, { useCallback, useMemo } from 'react';
import File from './File';
import Person from '../../Person';
import useObservable from '../../../hooks/useObservable';

function revisionIsRewind(revision) {
  if (!revision) {
    return false;
  }
  return revision.commitMessage.includes('Rewound to commit');
}

export default function Item({ revision, previousRevision, user, index }) {
  const userId = useObservable(user.id);
  const userColor = useObservable(user.color);
  const userGitUser = useObservable(user.gitUser);
  const userIsGlitchRewind = useObservable(user.isGlitchRewind);

  const getChangedFiles = useCallback(
    (rev) => {
      const edits = rev.editsByUser.find((edit) => edit.user === userId);
      if (edits) {
        return edits.files;
      }
      if (rev.gitEdits.files.length && rev.gitUser === userGitUser) {
        return rev.gitEdits.files;
      }
      return [];
    },
    [userId, userGitUser],
  );

  const isRewindCommit = revisionIsRewind(revision);
  const previousIsRewindCommit = revisionIsRewind(previousRevision);

  const changedFiles = useMemo(() => getChangedFiles(revision), [revision, getChangedFiles]);
  const changedFilesInPreviousRevision = useMemo(
    // Since glitch and rewind commits should be shown on separate rows, `isRewindCommit === previousIsRewindCommit`
    // separates the two.
    () => (previousRevision && isRewindCommit === previousIsRewindCommit ? getChangedFiles(previousRevision) : []),
    [previousRevision, getChangedFiles, isRewindCommit, previousIsRewindCommit],
  );

  // `userIsGlitchRewind !== isRewindCommit` so that rewind commits don't show for the glitch user and vice-versa
  if (changedFiles.length === 0 || userIsGlitchRewind !== isRewindCommit) {
    return <div className="rewind-item cell" />;
  }

  const showTooltipOnTop = index >= 2;

  return (
    <div className="rewind-item cell">
      <div className="revisions">
        {changedFiles.map((file, i) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <File key={i} showTooltipOnTop={showTooltipOnTop} file={file} />
        ))}
      </div>
      {changedFilesInPreviousRevision.length === 0 && (
        <div className="person-container">
          {userIsGlitchRewind ? (
            <span className="person">
              <div className="avatar" style={{ backgroundColor: userColor }} data-tooltip="Glitch Rewind" data-tooltip-left>
                <span className="rewind icon rewind-icon" />
              </div>
            </span>
          ) : (
            <Person user={user} showPopOnClick={false} hideOnlineStatus showTooltipOnTop={showTooltipOnTop} />
          )}
        </div>
      )}
    </div>
  );
}
