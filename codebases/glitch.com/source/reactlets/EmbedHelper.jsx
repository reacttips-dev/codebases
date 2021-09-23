import React, { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import PersonLink from './PersonLink';
import ShareLinks from './ShareLinks';
import User from '../models/user';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import PopPortal from '../components/PopPortal';

function EmbedHelperContents() {
  const application = useApplication();
  const projectPageUrl = useObservable(
    useCallback(() => {
      if (application.currentProject()) {
        return application.currentProject().projectPageUrl();
      }
      return null;
    }, [application]),
  );
  const projectAvatarImage = useObservable(application.projectAvatarImage);
  const projectName = useObservable(application.projectName);
  const projectCollaborators = useObservable(
    useCallback(() => {
      if (application.currentProject()) {
        return application.currentProject().users();
      }
      return [];
    }, [application]),
  );
  const collaborators = useMemo(
    () => projectCollaborators.map((collaboratorData) => ({ key: collaboratorData.id, user: User(collaboratorData) })),
    [projectCollaborators],
  );
  const editorUrl = useObservable(application.editorUrl);
  const appUrl = useObservable(application.publishedUrl);
  const embedAppPreviewSize = useObservable(application.embedAppPreviewSize);
  const embedAttributionHidden = useObservable(application.embedAttributionHidden);
  const bottombarCollapsed = useObservable(application.embedBottombarCollapsed);
  const viewingApp = embedAppPreviewSize === 100;
  const viewingSource = !viewingApp;

  const [sharePopPosition, setSharePopPosition] = useState(null);

  useEffect(() => {
    const off = application.onCloseAllPopOvers(() => {
      setSharePopPosition(null);
    });
    return off;
  }, [application]);

  const onSharePopOpen = useCallback((node) => {
    if (node) {
      node.querySelector('.project-page-url').select();
    }
  }, []);

  // We skip this entirely if we've removed the bottom bar
  if (bottombarCollapsed) {
    return null;
  }

  return (
    <div className="embed-helper">
      <a className="project-name" href={projectPageUrl} target="_blank" rel="noopener noreferrer">
        <img className="project-avatar" src={projectAvatarImage} alt={`Avatar for ${projectName}`} />
        {projectName}
      </a>

      {!embedAttributionHidden ? (
        <>
          <div className="preposition">by</div>

          <div className="collaborators">
            <div className="grouped-avatars">
              {collaborators.map(({ key, user }) => (
                <PersonLink key={key} user={user} />
              ))}
            </div>
          </div>
        </>
      ) : (
        // Instead of rendering nothing, we render this so that the 'Share', 'View App',
        // 'View Code', etc is pushed all the way to the right.
        <div style={{ flex: 1 }} />
      )}

      <div className="share-project">
        <button
          className={cn('button opens-pop-over', { active: sharePopPosition !== null })}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setSharePopPosition((prevSharePopOpen) =>
              prevSharePopOpen
                ? null
                : { top: 'initial', bottom: window.innerHeight - rect.top + 5, left: 'initial', right: window.innerWidth - rect.right },
            );
            application.analytics.track('Share Menu Viewed');
          }}
        >
          <span className="label">Share</span>
        </button>
        {sharePopPosition && (
          <PopPortal>
            <dialog ref={onSharePopOpen} className="pop-over embed-share-pop" style={sharePopPosition}>
              <section className="actions">
                <ShareLinks hideSecretsMessage />
              </section>
            </dialog>
          </PopPortal>
        )}
      </div>

      <div className="switch-view">
        {viewingApp && (
          <button
            className="button view-source"
            data-testid="view-source"
            onClick={() => {
              application.appPreviewVisible(false);
              application.appPreviewIsCollapsed(true);
              application.appPreviewSize(0);
              application.embedAppPreviewSize(0);
              application.analytics.page('Editor');
              application.analytics.track('Project Source Viewed');
              application.trackFileHelper(application.selectedFile(), 'File Viewed');
            }}
          >
            View Source
          </button>
        )}
        {viewingSource && (
          <button
            className="button view-app"
            onClick={() => {
              application.embedAppPreviewSize(100);
            }}
          >
            View App
          </button>
        )}
      </div>

      <div className="fullscreen-button">
        <a
          className="button"
          href={viewingSource ? editorUrl : appUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={viewingSource ? 'Open Source' : 'Open App'}
        >
          <span className="fullscreen emoji" />
        </a>
      </div>

      <div className="helper-icon">
        {/* Should be okay since it has an aria-label */}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a className="glitch-logo" href={projectPageUrl} target="_blank" rel="noreferrer noopener" aria-label={projectName} />
      </div>
    </div>
  );
}

export default function EmbedHelper() {
  const application = useApplication();
  const editorIsEmbedded = useObservable(application.editorIsEmbedded);
  const currentProject = useObservable(application.currentProject);

  if (!editorIsEmbedded || !currentProject) {
    return null;
  }

  return <EmbedHelperContents />;
}
