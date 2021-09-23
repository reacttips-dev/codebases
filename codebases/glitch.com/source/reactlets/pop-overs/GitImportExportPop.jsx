import React, { useState, useCallback, useEffect } from 'react';
import { Icon, useNotifications, Notification } from '@glitchdotcom/shared-components';
import cn from 'classnames';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import copyToClipboard from '../../utils/copyToClipboard';
import { Copied } from '../NotificationTemplates';

export default function GitImportExportPop() {
  const application = useApplication();
  const { createNotification } = useNotifications();
  const visible = useObservable(application.gitImportExportPopVisible);
  const embedded = useObservable(application.editorIsEmbedded);
  const projectLoaded = useObservable(application.projectIsLoaded);
  const member = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const signedIn = useObservable(application.currentUserIsLoggedIn);
  const [canPublish, setCanPublish] = useState(false);
  const currentProject = useObservable(application.currentProject);
  const constructedGitUrl = useObservable(
    useCallback(() => {
      if (!currentProject) {
        return undefined;
      }
      const readGitUrl = currentProject.readGitUrl();
      if (currentProject.gitAccessToken()) {
        return readGitUrl.replace('://', `://${currentProject.gitAccessToken()}@`);
      }
      return readGitUrl;
    }, [currentProject]),
  );
  const downloadProject = useObservable(application.projectDownloadUrl);
  const currentUser = useObservable(application.currentUser);
  const githubToken = useObservable(currentUser.githubToken);

  useEffect(() => {
    async function fetchData() {
      const response = await application.currentUserHasGithubRepoScope();
      setCanPublish(response);
    }
    fetchData();
  }, [application, githubToken]);

  const hideGitImportExportPop = () => {
    application.gitImportExportPopVisible(false);
    application.toolsPopVisible(true);
  };

  const copyUrl = () => {
    application.analytics.track('Git Link Copied');
    copyToClipboard(constructedGitUrl);
    createNotification(Copied);
  };

  const revokeRepoAccess = (e) => {
    e.preventDefault();
    application.redirectToGitHubLogin('user:email');
  };

  const importFromGitHub = async () => {
    await application.importFromGitHub();
  };

  const exportToGitHub = async () => {
    await application.exportToGitHub();
  };

  /* Returns an object with the description and button text needed when the user doesn't have publish rights
   * {
   *   descriptionHTML: HTML,
   *   buttonText: String
   }
   */
  const noPublishScopeText = () => {
    if (!signedIn) {
      return {
        descriptionHTML: (
          <div>
            <strong>Sign in to Glitch, or create an account</strong>, by connecting your GitHub account. Easily export and import between Glitch and
            GitHub.
          </div>
        ),
        buttonText: 'Sign In',
      };
    }
    if (!githubToken) {
      return {
        descriptionHTML: (
          <div>
            <strong>Connect your GitHub account</strong> to import private GitHub repos, and export projects from Glitch to GitHub.
          </div>
        ),
        buttonText: 'Connect to GitHub',
      };
    }
    return {
      descriptionHTML: (
        <div>
          <strong>Grant us access</strong> to your GitHub repos in order to export projects from Glitch to GitHub.
        </div>
      ),
      buttonText: 'Grant access',
    };
  };

  const redirectToGitHubLogin = (e) => {
    e.preventDefault();
    // Adding button text to the GitHub publishing scope analytics
    application.analytics.track('Grant GitHub Publishing Access Clicked', {
      targetText: noPublishScopeText().buttonText,
    });
    application.redirectToGitHubLogin('repo user:email');
  };

  if (!visible) {
    return null;
  }

  return (
    <dialog className="pop-over git-import-export-pop">
      {/* Existing accessibility issue ported to React.  */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
      <section role="presentation" className="info clickable-label" onClick={hideGitImportExportPop}>
        <div className="back icon" />
        <h1>
          Import and Export <Icon icon="tokyoTower" />
        </h1>
      </section>

      <section className="info">
        <p>Every Glitch project is also a Git repository you can access.</p>
      </section>

      <section className="actions">
        {projectLoaded && (
          <>
            <p>Your project's Git URL:</p>
            <div className="input-wrap">
              <input className="input" readOnly value={constructedGitUrl} />
              <button className="button button-copy-only-style" onClick={copyUrl}>
                Copy
              </button>
            </div>
            <Notification
              persistent
              variant="error"
              message="Your project's Git URL is private and shouldn't be shared with anyone, including other members of this project."
            />
          </>
        )}
      </section>

      <section className="actions">
        {member && (
          <div className="button-wrap">
            <button id="github-import" className="button" onClick={importFromGitHub} data-testid="import-github-button">
              Import from GitHub <Icon icon="octocat" />
            </button>
          </div>
        )}
        {member && canPublish && (
          <>
            <div className="button-wrap">
              <button id="button-github-connect" className="button" onClick={exportToGitHub} data-testid="export-github-button">
                Export to GitHub <Icon icon="octocat" />
              </button>
            </div>
            <p>
              {/* Existing accessibility issue ported to React.  */}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" className="repo-access revoke" onClick={revokeRepoAccess}>
                Revoke GitHub repo access
              </a>
            </p>
          </>
        )}
        {member && !canPublish && !embedded && (
          <div className="onboarding-tip">
            {noPublishScopeText().descriptionHTML}
            <div className="button-wrap">
              <button
                onClick={redirectToGitHubLogin}
                className={signedIn ? 'button button-small button-secondary' : 'button button-small button-cta'}
              >
                {noPublishScopeText().buttonText}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="actions">
        <div className={cn('button-wrap', { disabled: !member || embedded })}>
          <a
            id="download-project"
            className="button button-small button-secondary"
            onClick={() => application.analytics.track('Project Downloaded', { clickLocation: 'Import and Export' })}
            href={downloadProject}
          >
            Download Project <Icon icon="turtle" />
          </a>
        </div>
      </section>
    </dialog>
  );
}
