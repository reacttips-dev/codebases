import React, { useCallback } from 'react';
import useObservable from '../hooks/useObservable';
import useApplication from '../hooks/useApplication';

export default function SidebarProjectActions() {
  const application = useApplication();
  const currentUserAwaitingInvite = useObservable(useCallback(() => application.currentUser().awaitingInvite(), [application]));
  const currentUserOnAnyCurrentProjectTeam = useObservable(application.currentUserOnAnyCurrentProjectTeam);
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);
  const editorIsEmbedded = useObservable(application.editorIsEmbedded);

  const userHasOrRequestedProjectEditAccess = !projectIsReadOnlyForCurrentUser || currentUserAwaitingInvite;

  if (userHasOrRequestedProjectEditAccess || editorIsEmbedded) {
    return null;
  }

  return (
    <section className="sidebar-project-actions-wrap sidebar-section">
      {!userHasOrRequestedProjectEditAccess && (
        <section className="actions join-people">
          <button className="button join-project-button" onClick={application.askToJoinProject}>
            {currentUserOnAnyCurrentProjectTeam ? 'Join This Team Project' : 'Request to Join Project'}
          </button>
        </section>
      )}
    </section>
  );
}
