import React, { useCallback, useEffect, useState } from 'react';
import { Button, Icon, Loader, Notification, Progress } from '@glitchdotcom/shared-components';
import cn from 'classnames';
import RewindTapeIcon from '../components/icons/RewindTapeIcon';
import Stack from '../components/primitives/Stack';
import Row from '../components/primitives/Row';
import useObservable from '../hooks/useObservable';

// Used for GitHub notifications
const useCurrentUserHasGitHubRepoScope = (application) => {
  const [userHasGithubRepoScope, setUserHasGithubRepoScope] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const response = await application.currentUserHasGithubRepoScope();
      setUserHasGithubRepoScope(response);
    }
    fetchData();
  }, [application]);

  return userHasGithubRepoScope;
};

// Called directly from React code (i.e. you need to provide a data-testid here if you want one)
export const Copied = (props) => <Notification {...props} variant="success" message="Copied" />;
export const MarkdownCSPError = (props) => {
  const message = 'We couldn’t load an image in this file. Try using an image from the Glitch assets folder instead.';
  return (
    <Notification {...props} variant="error" persistent message={message}>
      <Stack>
        <span>{message}</span>
        <Row className="button-wrap">
          <Button size="tiny" className="no-button-styles" onClick={props.onClose}>
            Got it
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const PackageAdded = (props) => <Notification {...props} variant="success" message="Package Added" data-testid="notifyPackageAdded" />;
export const PackageUpdated = (props) => <Notification {...props} variant="success" message="Package Updated" data-testid="notifyPackageUpdated" />;
export const ProjectIsReadOnlyForCurrentUser = (props) => <Notification {...props} message="Remix or join to edit" />;
export const UploadLocalFileOnly = (props) => (
  <Notification {...props} message="To add this file, you’ll need to save it to your computer first" variant="error" persistent />
);

// Called from non-React code
// Keep notifications alphabetised to make them easy to find 💚
export const AnonProjectLimits = ({ application, ...props }) => {
  const message = 'Hey! Anonymous projects expire after 5 days. Create an account to save your progress.';
  return (
    <Notification {...props} variant="onboarding" message={message} persistent>
      <Stack>
        <span>{message}</span>
        <Row>
          <Button as="a" href="//glitch.com/signin" variant="cta" size="tiny" onClick={application.setDestinationAfterAuth}>
            Create Account
          </Button>
          <Button className="no-button-styles" size="tiny" onClick={props.onClose}>
            Hide
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};

export const AnonUserLimits = ({ application, ...props }) => {
  const message = 'Sign in to access all your projects anywhere';
  return (
    <Notification {...props} message={message} persistent>
      <Stack>
        <span>{message}</span>
        <Row>
          <Button size="tiny" as="a" href="//glitch.com/signin" className="no-button-styles" onClick={application.setDestinationAfterAuth}>
            Sign In
          </Button>
          <Button size="tiny" onClick={props.onClose} className="no-button-styles">
            Got It
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const Autosave = (props) => <Notification {...props} variant="success" message="psst, Glitch autosaves 八(＾□＾*)" />;
export const CanEdit = (props) => <Notification {...props} variant="success" message="You are now editing your live project" persistent />;
export const CanEditInEmbedRemixedEmbed = ({ application, ...props }) => {
  const editorIsEmbedded = useObservable(application.editorIsEmbedded);
  const message = `You can now edit this project here${editorIsEmbedded ? ' or fullscreen.' : '.'}`;
  return (
    <Notification {...props} message={message} variant="success" persistent>
      <Stack>
        <span>{message}</span>
        <Row>
          <Button size="tiny" className="no-button-styles" onClick={props.onClose}>
            Got it
          </Button>
          {editorIsEmbedded && (
            <Button
              size="tiny"
              className="no-button-styles"
              onClick={() => {
                window.top.location.href = application.editorUrl();
              }}
            >
              Edit Fullscreen <Icon icon="carpStreamer" />
            </Button>
          )}
        </Row>
      </Stack>
    </Notification>
  );
};
export const CloneError = ({ application, ...props }) => {
  const repoName = useObservable(application.notifyCloneError);
  const userHasGithubRepoScope = useCurrentUserHasGitHubRepoScope(application);
  const message = userHasGithubRepoScope ? `Couldn't clone ${repoName}, maybe a typo?` : `Couldn't clone ${repoName}, maybe it's private?`;
  return (
    <Notification {...props} message={message} variant="error" persistent>
      <Stack>
        {userHasGithubRepoScope ? (
          <>
            <span>{message}</span>
            <Row>
              <Button size="tiny" className="no-button-styles" onClick={props.onClose}>
                Got it
              </Button>
            </Row>
          </>
        ) : (
          <>
            <span>{message}</span>
            <Row>
              <Button
                size="tiny"
                className="no-button-styles"
                onClick={() => {
                  props.onClose();
                  application.redirectToGitHubLogin('repo user:email');
                }}
              >
                Grant Access
              </Button>
              <Button size="tiny" className="no-button-styles" onClick={props.onClose}>
                Cancel
              </Button>
            </Row>
          </>
        )}
      </Stack>
    </Notification>
  );
};
export const ConnectionError = (props) => {
  return (
    <Notification
      {...props}
      variant="error"
      message="Uh oh, we can’t connect to Glitch, which means your changes aren’t being saved. To keep your changes, copy them to your clipboard, reload, and
      paste them back in."
      persistent
      onClose={null}
    />
  );
};
export const ConnectionNotEstablished = (props) => {
  return (
    <Notification
      {...props}
      variant="error"
      message="We can’t seem to connect to your project at the moment, apologies. Please try refreshing your browser. If that doesn't work, contact support and
      they'll be able to help you out."
      persistent
      onClose={null}
    />
  );
};
export const DebuggerIsChromeOnly = (props) => {
  return <Notification {...props} variant="error" message="Sorry, the debugger is only available on Google Chrome" />;
};
export const DeletedProject = ({ application, ...props }) => {
  const lastDeletedProject = useObservable(application.lastDeletedProject);
  const lastDeletedProjectDomain = useObservable(useCallback(() => lastDeletedProject && lastDeletedProject.domain(), [lastDeletedProject]));
  const message = `Archived ${lastDeletedProjectDomain}`;
  return (
    <Notification {...props} message={message} persistent>
      <Stack>
        <span>{message}</span>
        <Row>
          <Button
            size="tiny"
            className="no-button-styles"
            onClick={() => {
              application.undeleteLastDeletedProject();
              props.onClose();
            }}
          >
            Undo <Icon icon="zzz" />
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const DotenvRemovedVariable = (props) => <Notification {...props} variant="success" message="Successfully removed variable" />;
export const DotenvUpdatesAsYouType = (props) => <Notification {...props} variant="success" message="Environment variables update as you type" />;
export const DotenvVisibility = (props) => (
  <Notification
    {...props}
    name="DotenvRemovedVariable"
    message="Showing and hiding secret variable values only changes the visibility for you, not for other project members"
  />
);
export const EditorIsPreviewingRewind = ({ application, ...props }) => {
  const displayedRevision = useObservable(application.displayedRevision);
  const jigglePreviewingRewindNotification = useObservable(application.jigglePreviewingRewindNotification);
  const message = 'Previewing Rewind';
  return (
    <Notification {...props} message={message} persistent onClose={null}>
      <Stack>
        <span>{message}</span>
        <Row>
          {displayedRevision && (
            <Button
              size="tiny"
              variant="cta"
              className={cn({ jiggle: jigglePreviewingRewindNotification }, 'no-button-styles')}
              onAnimationEnd={(e) => {
                e.stopPropagation();
                application.jigglePreviewingRewindNotification(false);
              }}
              onClick={() => {
                application.analytics.track('Rewind Applied', {
                  checkpointDate: new Date(application.selectedRevision().timestamp * 1000).toISOString(),
                });
                application.rewindToRevision(application.selectedRevision());
              }}
            >
              Rewind Project <div className="rewind icon" />
            </Button>
          )}
          <Button
            size="tiny"
            className={cn({ jiggle: jigglePreviewingRewindNotification }, 'no-button-styles')}
            onAnimationEnd={(e) => {
              e.stopPropagation();
              application.jigglePreviewingRewindNotification(false);
            }}
            onClick={() => {
              application.rewindPanelVisible(false);
              props.onClose();
            }}
          >
            Cancel
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};

export const EditorIsRewindingProject = (props) => {
  return (
    <Notification {...props} message="Rewinding project" persistent onClose={null}>
      <Row>
        <RewindTapeIcon />
        <Loader style={{ width: '20px' }} />
      </Row>
    </Notification>
  );
};
export const EditorRewoundProject = ({ application, ...props }) => {
  const rewoundRevision = useObservable(application.rewoundRevision);
  const message = 'Project has been rewound';
  return (
    <Notification {...props} variant="success" message={message}>
      <Row>
        <RewindTapeIcon />
        <span>{rewoundRevision && message}</span>
      </Row>
    </Notification>
  );
};
export const FileHiddenByGitIgnore = (props) => {
  const message =
    'This file already exists but is currently hidden by .gitignore. You can view it in the console or by removing from .gitignore and refreshing the editor.';
  return (
    <Notification {...props} message={message} persistent variant="error">
      <Stack>
        <span>{message}</span>
        <Row>
          <Button size="tiny" className="no-button-styles" onClick={props.onClose}>
            Dismiss
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const FirstSwitchToStatic = (props) => {
  const message = 'It looks like you just made this project a static site. Did you know that static sites stay awake and are always on for free?';
  return (
    <Notification {...props} message={message} persistent>
      <Stack>
        <div>
          {message} <Icon icon="gift" />
        </div>
        <Row>
          <Button
            as="a"
            size="tiny"
            className="no-button-styles"
            href="https://glitch.com/help/kb/article/38-what-types-of-apps-can-i-make-on-glitch/#Static%20websites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More <Icon icon="arrowRight" />
          </Button>
          <Button size="tiny" className="no-button-styles" data-testid="close-notify-first-switch-to-static" onClick={props.onClose}>
            Close
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};

export const FirstSwitchToNonStatic = (props) => {
  const message = "It looks like this project is no longer a static site and will go to sleep after it's idle for five minutes.";
  return (
    <Notification {...props} message={message} persistent>
      <Stack>
        <div>
          {message} <Icon icon="zzz" />
        </div>
        <Row>
          <Button
            as="a"
            size="tiny"
            href="https://glitch.com/help/kb/article/38-what-types-of-apps-can-i-make-on-glitch/#Static%20websites"
            className="no-button-styles"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More &nbsp; <Icon icon="arrowRight" />
          </Button>
          <Button size="tiny" className="no-button-styles" data-testid="close-notify-first-switch-to-non-static" onClick={props.onClose}>
            Close
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};

export const GenericError = ({ application, ...props }) => {
  const error = useObservable(application.notifyGenericError);
  return (
    <Notification
      {...props}
      variant="error"
      message={error.message || `We're sorry, something went wrong! Please try again, or try refreshing the editor.`}
      timeout={10000}
    />
  );
};
export const GithubEmptyRepositoryError = (props) => {
  return <Notification {...props} variant="error" message="Oops, that repo doesn't have any files so we can't import it." persistent />;
};
export const GithubExporting = ({ application, ...props }) => {
  const lastUsedGithubRepoExport = useObservable(
    useCallback(() => {
      const projectId = application.currentProjectId();
      return application.getUserPref('lastUsedGitHubRepoExport')?.[projectId] || 'GitHub';
    }, [application]),
  );
  const message = `Exporting to ${lastUsedGithubRepoExport}`;
  return (
    <Notification {...props} message={message} persistent onClose={null}>
      <Row>
        <Loader />
        <span>{message}</span>
      </Row>
    </Notification>
  );
};
export const GithubExportFailure = ({ application, ...props }) => {
  const error = useObservable(application.notifyGithubExportFailure);
  const message = `We could not export your project to the Github repo ${error.repo}. ${error.message}`;
  return (
    <Notification {...props} variant="error" persistent message={message}>
      {message}
    </Notification>
  );
};
export const GithubExportNoRepoScopeError = ({ application, ...props }) => {
  const currentUserIsLoggedIn = useObservable(application.currentUserIsLoggedIn);
  const message = 'Sign in and connect to GitHub in order to export projects';

  return (
    <Notification {...props} variant="error" persistent message={message}>
      <Stack>
        <span>{message}</span>
        <Row>
          <Button
            size="tiny"
            className="no-button-styles opens-pop-over"
            onClick={() => {
              application.gitImportExportPopVisible(true);
              props.onClose();
            }}
          >
            {currentUserIsLoggedIn ? 'Connect to GitHub' : 'Sign In'}
          </Button>
          <Button size="tiny" className="no-button-styles" onClick={props.onClose}>
            Dismiss
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const GithubExportSuccess = (props) => <Notification {...props} variant="success" timeout={5000} message="Export Successful" />;
export const GitImportSuccess = (props) => <Notification {...props} variant="success" timeout={5000} message="Import Successful" />;
export const GitRepositoryNotFoundError = ({ application, ...props }) => {
  const userHasGithubRepoScope = useCurrentUserHasGitHubRepoScope(application);
  const { gitRepoUrl } = useObservable(application.notifyGitRepositoryNotFoundError);
  if (!gitRepoUrl) {
    return null;
  }
  const { pathname } = new URL(gitRepoUrl);
  const shouldShowGithubPrompt = gitRepoUrl?.includes('github.com') && !userHasGithubRepoScope;
  const message = `Couldn't find ${pathname.substring(1)}. ${
    shouldShowGithubPrompt ? "If it's private, you can sign in with GitHub to import it." : ''
  }`;
  return (
    <Notification {...props} variant="error" persistent message={message}>
      <Stack>
        <span>{message}</span>
        <Row className="button-wrap">
          {shouldShowGithubPrompt && (
            <Button
              size="tiny"
              className="no-button-styles opens-pop-over"
              onClick={() => {
                props.onClose();
                application.redirectToGitHubLogin('repo user:email');
              }}
            >
              Sign In
            </Button>
          )}
          <Button size="tiny" className="no-button-styles" onClick={props.onClose}>
            Dismiss
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const GitImportUrlInvalid = (props) => {
  const message = "It doesn't look like that was a valid GitHub URL. Please check and try again from the Project menu";
  return (
    <Notification {...props} variant="error" message={message} persistent>
      <Stack>
        <span>{message}</span>
        <Row>
          <Button onClick={props.onClose} size="tiny">
            Dismiss
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const ImportingGitRepo = ({ application, ...props }) => {
  const { repoUrl } = useObservable(application.notifyImportingGitRepo);
  const { hostname, pathname } = new URL(repoUrl);
  // remove the leading "/" from the pathname before entering it into the notification
  const message = `Importing ${pathname.substring(1)} from ${hostname}`;
  return (
    <Notification {...props} message={message} persistent onClose={null}>
      <Row>
        <Loader />
        <span>{message}</span>
      </Row>
    </Notification>
  );
};
export const InvalidFileName = (props) => (
  <Notification {...props} variant="error" message="Names can’t have .., $, ~, \, *, or start with /" timeout={5000} />
);
export const InvalidFolderName = (props) => {
  return (
    <Notification
      {...props}
      variant="error"
      message="Folder can’t be named the same as an existing folder, or include /, .., $, ~, \, *"
      timeout={5000}
    />
  );
};
export const InvalidGitRepository = (props) => {
  return <Notification {...props} variant="error" message="Invalid git repository. Use the username/repository format." />;
};
export const JoinedProject = (props) => <Notification {...props} variant="success" message="You're now able to edit" />;
export const LeftProject = (props) => <Notification {...props} variant="success" message="You’ve left this project" />;
export const PrettierParseError = ({ application, ...props }) => {
  const error = useObservable(application.notifyPrettierParseError);
  const message = `We can't format this file yet because there's a syntax error${error.loc ? ` on line ${error.loc.start.line}.` : '.'}`;
  return (
    <Notification {...props} variant="error" persistent message={message}>
      {message}
    </Notification>
  );
};
export const PrettierFirstRun = (props) => {
  const message = 'Nice! Your code is now formatted.';
  return (
    <Notification {...props} variant="success" persistent message={message}>
      <Stack>
        <span>{message}</span>
        <Row>
          <Button
            as="a"
            href="https://glitch.happyfox.com/kb/article/5"
            className="no-button-styles"
            target="_blank"
            rel="noopener noreferrer"
            size="tiny"
            onClick={props.onClose}
          >
            Learn More <span aria-label="">→</span>
          </Button>
        </Row>
      </Stack>
    </Notification>
  );
};
export const PrettierLoadError = (props) => {
  return <Notification {...props} variant="error" message="Whoops, we couldn't run the code formatter. Try formatting again." />;
};
export const PreviewWindowOpened = (props) => <Notification {...props} variant="success" message="Opened in another tab or window" />;
export const ProjectConnectionFailed = (props) => (
  <Notification {...props} variant="error" message="Couldn't connect to your project. Try refreshing?" />
);
export const ProjectLoadFailed = (props) => <Notification {...props} variant="error" message="Couldn't load your project. Try refreshing?" />;
export const ProjectVisitorCannotUploadAssets = (props) => {
  return <Notification {...props} variant="error" message="Sorry, you must be logged in to upload assets." />;
};
export const RecaptchaUnavailable = (props) => {
  return (
    <Notification
      {...props}
      variant="error"
      message="Could not load Google Recaptcha. To remix a project, please disable any extensions that might block Google Recaptcha and try again."
    />
  );
};
export const Reconnected = (props) => <Notification {...props} variant="success" timeout={5000} message="Connected" />;
export const Reconnecting = (props) => {
  const message = 'Reconnecting';
  return (
    <Notification {...props} message={message} persistent onClose={null}>
      <span>{message}</span>
      <span className="loader-ellipses" />
    </Notification>
  );
};
export const TakeActionToEdit = ({ application, ...props }) => {
  const jiggleTakeActionToEditNotification = useObservable(application.jiggleTakeActionToEditNotification);
  const projectIsReadOnlyForCurrentUser = useObservable(application.projectIsReadOnlyForCurrentUser);

  return (
    <Notification {...props} message="Take action to edit your project" persistent>
      <Button
        className={cn({ jiggle: jiggleTakeActionToEditNotification }, 'no-button-styles')}
        size="tiny"
        onAnimationEnd={(e) => {
          e.stopPropagation();
          application.jiggleTakeActionToEditNotification(false);
        }}
        onClick={async () => {
          props.onClose();
          if (projectIsReadOnlyForCurrentUser) {
            await application.remixCurrentProject();
            application.notifyCanEditInEmbedRemixedEmbed(true);
          } else {
            application.notifyCanEdit(true);
          }
          application.embedEditingEnabled(true);
          application.setCurrentSession(application.selectedFile(), { maintainScrollPosition: true });
        }}
        data-testid={projectIsReadOnlyForCurrentUser ? 'remix-to-edit' : 'edit-embed-here'}
      >
        {projectIsReadOnlyForCurrentUser ? (
          <>
            <span>Remix to Edit </span>
            <Icon icon="microphone" />
          </>
        ) : (
          'Edit Project'
        )}
      </Button>
    </Notification>
  );
};
export const UploadFailure = (props) => <Notification {...props} variant="error" message="File upload failed. Try again in a few minutes?" />;
export const Uploading = ({ application, ...props }) => {
  const uploadProgress = useObservable(application.uploadProgress);
  const value = useObservable(application.notifyUploading);
  const message = `Uploading ${value.numFiles > 1 ? `${value.numFiles} assets` : 'asset'}`;
  return (
    <Notification {...props} message={message} persistent onClose={null}>
      <Stack>
        <span>{message}</span>
        <Progress value={uploadProgress} max={100}>
          {uploadProgress}
        </Progress>
      </Stack>
    </Notification>
  );
};
