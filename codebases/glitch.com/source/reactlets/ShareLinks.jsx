import React, { useState, useCallback } from 'react';
import cn from 'classnames';
import { Loader } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import copyToClipboard from '../utils/copyToClipboard';
import { access } from '../const';

const SHARE_PROJECT_PAGE = 'SHARE_PROJECT_PAGE';
const SHARE_APP = 'SHARE_APP';
const SHARE_CODE = 'SHARE_CODE';

export default function ShareLinks({ hideSecretsMessage = false }) {
  const application = useApplication();
  const projectAccess = useObservable(application.projectAccessLevelForCurrentUser);
  const projectIsLoaded = useObservable(application.projectIsLoaded);
  const projectIsPrivate = useObservable(application.projectIsPrivate);
  const appUrl = useObservable(application.publishedUrl);
  const editorUrl = useObservable(application.editorUrl);
  const [share, setShare] = useState(SHARE_PROJECT_PAGE);

  const projectPageUrl = useObservable(
    useCallback(() => {
      if (application.currentProject()) {
        const { origin } = document.location;
        const projectPage = application.currentProject().projectPageUrl();
        return `${origin}${projectPage}`;
      }
      return '';
    }, [application]),
  );

  return (
    <>
      <div className="button-wrap">
        <div className="segmented-buttons">
          <button
            className={cn('button', { active: share === SHARE_PROJECT_PAGE })}
            onClick={() => {
              setShare(SHARE_PROJECT_PAGE);
            }}
          >
            Project Page
          </button>
          <button
            className={cn('button', { active: share === SHARE_APP })}
            onClick={() => {
              setShare(SHARE_APP);
            }}
          >
            Live App
          </button>
          <button
            className={cn('button', { active: share === SHARE_CODE })}
            onClick={() => {
              setShare(SHARE_CODE);
            }}
          >
            Code
          </button>
        </div>
      </div>

      {share === SHARE_PROJECT_PAGE && (
        <>
          {projectIsPrivate && (
            <p>
              <span className="private-icon is-private" /> Only project members or teams can view
            </p>
          )}
          <p>
            <input className="input share-link project-page-url" value={projectPageUrl} readOnly />
            <button
              className="button button-copy-only-style"
              onClick={() => {
                application.analytics.track('Glitch Link Copied', { linkType: 'project page' });
                copyToClipboard(projectPageUrl);
              }}
            >
              copy
            </button>
          </p>
        </>
      )}

      {share === SHARE_APP && (
        <p>
          <input className="input share-link app-url" value={appUrl} readOnly />
          <button
            className="button button-copy-only-style"
            onClick={() => {
              application.analytics.track('Glitch Link Copied', { linkType: 'live app' });
              copyToClipboard(appUrl);
            }}
          >
            copy
          </button>
        </p>
      )}

      {share === SHARE_CODE && (
        <>
          {projectIsPrivate && (
            <p>
              <span className="private-icon is-private" /> Only project members or teams can view
            </p>
          )}
          {!projectIsPrivate && !hideSecretsMessage && projectAccess >= access.MEMBER && (
            <p>
              <span className="secrets-sidebar-icon" /> Non-members won't be able to see your .env file secrets
            </p>
          )}
          {projectIsLoaded ? (
            <p>
              <input className="input share-link app-url" value={editorUrl} readOnly />
              <button
                className="button-copy-only-style"
                onClick={() => {
                  application.analytics.track('Glitch Link Copied', { linkType: 'code' });
                  copyToClipboard(editorUrl);
                }}
              >
                copy
              </button>
            </p>
          ) : (
            <Loader />
          )}
        </>
      )}
    </>
  );
}
