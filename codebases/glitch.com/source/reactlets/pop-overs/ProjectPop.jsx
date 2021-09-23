import React, { useEffect, useState, useRef, useCallback } from 'react';
import dedent from 'dedent';
import AutoSizeTextarea from 'react-autosize-textarea';
import cn from 'classnames';
import { isReserved } from '@glitchdotcom/glitch-reserved-names';
import styled from 'styled-components';
import { Icon, TooltipContainer } from '@glitchdotcom/shared-components';
import ToggleCheckbox from '../../components/ToggleCheckbox';
import useApplication from '../../hooks/useApplication';
import { useCurrentUser } from '../../machines/User';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import useGlitchApi from '../../hooks/useGlitchApi';
import useObservable from '../../hooks/useObservable';
import whenKeyIsEnter from '../../utils/whenKeyIsEnter';
import { BoostProjectButton, STATE_BOOST_DISABLED, useCurrentProjectBoostInfo } from '../BoostControls';
import BoostedIcon from '../../components/icons/BoostedIcon';

const MAX_PROJECT_NAME_LENGTH = 50;

const ProjectPopButtonBoostedIcon = styled(BoostedIcon)`
  margin-left: 7px;
  position: relative;
`;

function ProjectPopContent({ showProjectSpecificContent }) {
  const application = useApplication();
  const glitchApi = useGlitchApi();
  const currentUser = useCurrentUser();
  const currentProject = useObservable(application.currentProject);
  const currentProjectPrivacy = useObservable(currentProject?.privacy);
  const projectAvatarImage = useObservable(application.projectAvatarImage);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const isAdmin = useObservable(application.projectIsAdminForCurrentUser);
  const projectName = useObservable(useCallback(() => currentProject?.domain(), [currentProject]));
  const projectDescription = useObservable(useCallback(() => currentProject?.description(), [currentProject]));
  const projects = useObservable(application.projects);
  const numProjects = projects.length;
  const currentTheme = useObservable(application.currentTheme);
  const refreshPreviewOnChanges = useObservable(application.refreshPreviewOnChanges);
  const wrapText = useObservable(application.wrapText);
  const boostInfo = useCurrentProjectBoostInfo();
  const [projectNameInput, setProjectNameInput] = useState(projectName);
  const [projectNameError, setProjectNameError] = useState(null);
  const [projectDescriptionInput, setProjectDescriptionInput] = useState(projectDescription);
  const firstRender = useRef(true);
  // Public projects can always be remixed. Otherwise the current user must be a pro user to remix
  const allowRemixes = currentProjectPrivacy === 'public' || currentUser.isProUser;

  useEffect(() => {
    setProjectNameInput(projectName);
  }, [projectName]);

  useEffect(() => {
    setProjectDescriptionInput(projectDescription);
  }, [projectDescription]);

  const showProjectAvatarPop = () => {
    if (!application.projectIsReadOnlyForCurrentUser()) {
      application.projectPopVisible(false);
      application.projectAvatarPopVisible(true);
    }
  };

  const validateProjectName = useCallback(
    async (name) => {
      if (name.length > MAX_PROJECT_NAME_LENGTH) {
        return 'Project name cannot be longer than 60 characters';
      }
      if (isReserved(name)) {
        return 'This name is restricted';
      }
      const project = await glitchApi.v0.getProject(name, { showDeleted: true });
      if (project) {
        return 'Another project has that name';
      }
      return null;
    },
    [glitchApi],
  );

  const latestNameValidation = useRef(Promise.resolve(false));
  const validateProjectNameAndSetError = useCallback(
    (name) => {
      const currentValidation = validateProjectName(name)
        .catch(() => 'An unknown error occurred.')
        .then((error) => {
          if (latestNameValidation.current === currentValidation) {
            setProjectNameError(error);
          }
          return error === null;
        });
      latestNameValidation.current = currentValidation;
      return currentValidation;
    },
    [validateProjectName],
  );

  const renameProject = useCallback(
    async (newName) => {
      if (newName === projectName) {
        return;
      }
      const shouldRename = await validateProjectNameAndSetError(newName);
      if (shouldRename === false) {
        return;
      }
      application.projectIsRenaming(true);
      currentProject
        .saveImmediate(glitchApi, { domain: newName })
        .then(
          () => {
            currentProject.domain(newName);
            application.updateProjectName(newName);
            application.broadcastProjectName();
          },
          () => {
            setProjectNameError('Updating this project is not allowed');
          },
        )
        .finally(() => {
          application.projectIsRenaming(false);
        });
    },
    [application, glitchApi, currentProject, projectName, validateProjectNameAndSetError],
  );

  const debouncedProjectNameInput = useDebouncedValue(projectNameInput, 500);
  useEffect(() => {
    if (!firstRender.current) {
      renameProject(debouncedProjectNameInput);
    }
  }, [renameProject, debouncedProjectNameInput]);

  const saveDescription = () => {
    if (projectDescriptionInput === currentProject.description()) {
      return;
    }
    currentProject.description(projectDescriptionInput);
    currentProject.saveImmediate(glitchApi);
  };

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return (
    <dialog className="pop-over project-pop">
      {showProjectSpecificContent ? (
        <section className="info">
          <div className="project-info-container">
            {/* Existing accessibility issue ported to React. */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <img
              className="project-avatar-image opens-pop-over"
              alt="Project avatar"
              src={projectAvatarImage}
              onClick={showProjectAvatarPop}
              onKeyPress={whenKeyIsEnter(showProjectAvatarPop)}
              /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
              tabIndex="0"
            />
            <div className="project-info-meta">
              <div className="input-wrap">
                <input
                  className={cn('input project-name', { 'field-error': projectNameError })}
                  data-testid="project-name-input"
                  disabled={!isMember}
                  value={projectNameInput}
                  onChange={(e) => {
                    const newName = e.target.value.toLowerCase().replace(/[^a-z0-9-]/gi, '-');
                    setProjectNameInput(newName);
                    if (newName === projectName) {
                      latestNameValidation.current = Promise.resolve(false);
                      return;
                    }
                    validateProjectNameAndSetError(newName);
                  }}
                  maxLength={MAX_PROJECT_NAME_LENGTH}
                />
                {projectNameError && <div className="field-error-message">{projectNameError}</div>}
              </div>
              {isMember ? (
                <AutoSizeTextarea
                  className={cn('textarea content-editable', { 'read-only': !isMember })}
                  value={projectDescriptionInput}
                  onBlur={saveDescription}
                  onChange={(e) => {
                    setProjectDescriptionInput(e.target.value);
                  }}
                />
              ) : (
                <p className="content-editable read-only">{projectDescriptionInput}</p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="info">
          <h1>Project Menu</h1>
        </section>
      )}

      <section className="actions">
        <div className="button-wrap">
          <button
            id="new-project"
            className="button"
            onClick={() => {
              application.projectPopVisible(false);
              application.newProjectPopVisible(true);
            }}
            data-testid="new-project-button"
          >
            New Project <Icon icon="sparkles" />
          </button>
        </div>
        {showProjectSpecificContent && (
          <div className="button-wrap">
            <TooltipContainer
              target={
                <button
                  id="remix-project"
                  className="button"
                  onClick={() => {
                    if (allowRemixes) {
                      application.closeAllPopOvers();
                      application.remixCurrentProject();
                    }
                  }}
                  disabled={!allowRemixes}
                >
                  Remix Project <Icon icon="microphone" />
                </button>
              }
              tooltip={
                allowRemixes
                  ? null
                  : dedent(`Upgrade to a Glitch 
                          membership to remix 
                          this private project`)
              }
              type="action"
            />
          </div>
        )}
        {numProjects > 0 && (
          <div className="button-wrap">
            <button
              id="switch-project"
              className="button"
              onClick={() => {
                application.projectPopVisible(false);
                application.projectsSelectPopVisible(true);
              }}
            >
              Switch Project <Icon icon="hibiscus" />
            </button>
          </div>
        )}
        {showProjectSpecificContent && boostInfo.projectBoostState !== STATE_BOOST_DISABLED && (
          <div className="button-wrap">
            <BoostProjectButton className="button" {...boostInfo}>
              {(buttonText) => (
                <>
                  <span>{buttonText}</span>
                  <ProjectPopButtonBoostedIcon variant="default" size="small" />
                </>
              )}
            </BoostProjectButton>
          </div>
        )}
      </section>

      {showProjectSpecificContent && (
        <>
          <section className="info">
            <h1>On Your Website</h1>
          </section>

          <section className="actions">
            <div className="button-wrap">
              <button
                data-testid="embed-project"
                className="button button-small button-secondary"
                onClick={() => {
                  application.closeAllPopOvers();
                  application.shareEmbedOverlayVisible(true);
                }}
              >
                Embed This Project <Icon icon="bentoBox" />
              </button>
            </div>
          </section>
        </>
      )}

      <section className="info">
        <h1>Editor Settings</h1>
      </section>

      <section className="actions">
        <div className="button-wrap">
          <button
            className="button button-small button-secondary"
            onClick={() => {
              application.actionInterface.changeTheme();
            }}
          >
            Change Theme {currentTheme === 'sugar' ? <Icon icon="crescentMoon" /> : <Icon icon="sunny" />}
          </button>
        </div>
        {isMember && (
          <div className="button-wrap">
            <ToggleCheckbox
              value={refreshPreviewOnChanges}
              onChange={() => {
                application.refreshPreviewOnChanges.toggle();
                application.analytics.track('Refresh App Setting Changed', { currentSetting: application.refreshPreviewOnChanges() });
              }}
            >
              Refresh App on Changes
            </ToggleCheckbox>
          </div>
        )}
        <div className="button-wrap">
          <ToggleCheckbox
            value={wrapText}
            onChange={() => {
              application.wrapText.toggle();
              application.analytics.track('Wrap Text Setting Changed', { currentSetting: application.wrapText() });
            }}
          >
            Wrap Text
          </ToggleCheckbox>
        </div>
        <div className="button-wrap">
          <button
            className="button button-small button-secondary"
            onClick={() => {
              application.analytics.track('Keyboard Shortcuts Viewed');
              application.closeAllPopOvers();
              application.keyboardShortcutsOverlayVisible(true);
            }}
          >
            Keyboard Shortcuts <Icon icon="musicalKeyboard" />
          </button>
        </div>
      </section>

      {showProjectSpecificContent && isMember && (
        <section className={cn('danger-zone', { hidden: !isAdmin })}>
          <div className="button-wrap">
            <button
              id="delete-project"
              className="button"
              data-testid="delete-project-button"
              onClick={() => {
                application.actionInterface.deleteCurrentProject();
              }}
            >
              Archive This Project <Icon icon="zzz" />
            </button>
          </div>
        </section>
      )}
    </dialog>
  );
}

export default function ProjectPop() {
  const application = useApplication();
  const visible = useObservable(application.projectPopVisible);
  const projectLoaded = useObservable(application.projectIsLoaded);
  const currentProject = useObservable(application.currentProject);

  if (!visible) {
    return null;
  }

  return <ProjectPopContent showProjectSpecificContent={projectLoaded || currentProject} />;
}
