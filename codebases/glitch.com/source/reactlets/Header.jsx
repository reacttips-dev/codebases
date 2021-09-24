import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import { Loader } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';
import AboutPop from './pop-overs/AboutPop';
import AccountPop from './pop-overs/AccountPop';
import ProjectPop from './pop-overs/ProjectPop';
import ProjectAvatarPop from './pop-overs/ProjectAvatarPop';
import ProjectSearchPop from './pop-overs/ProjectSearchPop';
import ProjectSelectPop from './pop-overs/ProjectSelectPop';
import NewProjectPop from './pop-overs/NewProjectPop';
import ShowAppPop from './pop-overs/ShowAppPop';
import SmallViewportOptionsPop from './pop-overs/SmallViewportOptionsPop';
import BoostedIcon from '../components/icons/BoostedIcon';
import { useProjectMachine } from '../machines/Project';

const ProjectNameBoostedIcon = styled(BoostedIcon)`
  && {
    position: absolute;
    left: 1px;
    top: 0;
  }
`;

function HeaderContent() {
  const application = useApplication();
  const [projectMachineState] = useProjectMachine();
  const projectIsBoosted = useObservable(application.currentProjectIsBoosted);
  const projectIsRenaming = useObservable(application.projectIsRenaming);
  const projectAvatarImage = useObservable(application.projectAvatarImage);
  const projectName = useObservable(application.projectName);
  const loggingIn = useObservable(application.userIsLoggingIn);
  const loggedIn = useObservable(application.currentUserIsLoggedIn);
  const currentFile = useObservable(application.currentFileInfo);
  const projectSearchBoxValue = useObservable(application.projectSearchBoxValue);
  const currentUser = useObservable(application.currentUser);
  const currentUserColor = useObservable(currentUser.color);
  const userAvatarUrl = useObservable(currentUser.userAvatarUrl);

  const projectPopVisible = useObservable(application.projectPopVisible);
  const projectSelectPopVisible = useObservable(application.projectsSelectPopVisible);
  const newProjectPopVisible = useObservable(application.newProjectPopVisible);
  const anyProjectPopVisible = projectPopVisible || projectSelectPopVisible || newProjectPopVisible;

  const showAppPopVisible = useObservable(application.showAppPopVisible);
  const accountPopVisible = useObservable(application.accountPopVisible);
  const aboutPopVisible = useObservable(application.aboutPopVisible);
  const smallViewportOptionsPopVisible = useObservable(application.smallViewportOptionsPopVisible);

  const toggle = (visibilityObservable) => () => {
    const next = !visibilityObservable();
    application.closeAllPopOvers();
    visibilityObservable(next);
  };

  const openSearchPopover = () => {
    application.closeAllPopOvers();
    application.projectSearchPopVisible(true);
  };

  return (
    <header className="header">
      <nav>
        {/* Project */}
        <button
          id="header-project"
          className={cn('header-project nav-item no-button-styles opens-pop-over', { active: anyProjectPopVisible })}
          onClick={toggle((next) => (typeof next !== 'undefined' ? application.projectPopVisible(next) : anyProjectPopVisible))}
          data-tooltip={!anyProjectPopVisible ? 'Project options' : null}
          data-tooltip-left
          aria-label="Open project options popover menu"
          data-testid="project-options-button"
        >
          {projectIsBoosted && <ProjectNameBoostedIcon size="tiny" />}

          <div className="context">
            {projectIsRenaming && (
              <span className="project-name-loader">
                <Loader />
              </span>
            )}
            <img className="project-avatar-image" src={projectAvatarImage} alt="" />
            {projectName ? (
              <span className="project-name" data-testid="project-name">
                {projectName}
              </span>
            ) : (
              <span className="project-name-width-placeholder">{projectMachineState.value === 'projectCreateFailed' ? 'Project Menu' : ''}</span>
            )}
          </div>
          <span className="down-arrow icon" />
        </button>

        {/* Show App */}
        <div className="show-app-wrapper">
          <button
            id="show-app"
            className={cn('show-app icon nav-item no-button-styles opens-pop-over', { active: showAppPopVisible })}
            onClick={toggle(application.showAppPopVisible)}
            data-tooltip={!showAppPopVisible ? 'Preview your app' : null}
            aria-label="Open popover menu for previewing your app"
          >
            <span className="show-app-icon icon" />
            <span className="show-text">Show</span>
            <span className="down-arrow icon" />
          </button>
          <ShowAppPop />
        </div>

        {/* Project Search */}
        <div className="project-search-wrapper">
          <input
            id="project-search-input"
            className="input search-input opens-pop-over"
            placeholder={currentFile ? currentFile.path : 'Project search'}
            type="text"
            name="search"
            onFocus={() => {
              openSearchPopover();
            }}
            onClick={() => {
              openSearchPopover();
            }}
            onChange={(e) => {
              openSearchPopover();
              application.projectSearchBoxValue(e.target.value);
            }}
            value={projectSearchBoxValue}
            autoComplete="off"
            aria-label="Project search"
          />
          <ProjectSearchPop />
        </div>

        {/* User and Glitch Options for large viewports */}
        <div className="right-options hidden-on-small-viewport">
          {loggingIn && <Loader />}
          {loggedIn ? (
            <button
              id="account-pop-button"
              className={cn('action account-pop-button no-button-styles opens-pop-over', { active: accountPopVisible })}
              onClick={toggle(application.accountPopVisible)}
              data-tooltip={!accountPopVisible ? 'Your account' : null}
              aria-label="Open popover menu for your account"
            >
              <div
                className={cn('avatar icon', { 'anon-avatar': !userAvatarUrl })}
                style={{ backgroundColor: currentUserColor, backgroundImage: userAvatarUrl ? `url("${userAvatarUrl}")` : null }}
              />
              <span className="down-arrow icon" />
            </button>
          ) : (
            <a href="//glitch.com/signin" className="sign-in-button button" onClick={application.setDestinationAfterAuth}>
              Sign In
            </a>
          )}
          <button
            className="action about-button no-button-styles opens-pop-over"
            data-tooltip={!aboutPopVisible ? 'Glitch options' : null}
            data-tooltip-right
            onClick={toggle(application.aboutPopVisible)}
            aria-label="Open popover menu for Glitch options"
          >
            <span className="glitch-logo icon" />
            <span className="down-arrow icon" />
          </button>
        </div>

        {/* User and Glitch Options for small viewports */}
        <div className="right-options small-viewport-only">
          <button
            className={cn('action no-button-styles opens-pop-over', { active: smallViewportOptionsPopVisible })}
            onClick={toggle(application.smallViewportOptionsPopVisible)}
            aria-label="Open popover menu for your account and Glitch options"
          >
            <span className="glitch-logo icon" />
            <span className="down-arrow icon" />
          </button>
        </div>
      </nav>

      {/* Pops! */}
      <AboutPop />
      <AccountPop />
      <ProjectPop />
      <ProjectAvatarPop />
      <ProjectSelectPop />
      <NewProjectPop />
      <SmallViewportOptionsPop />
    </header>
  );
}

export default function Header() {
  const application = useApplication();
  const embedded = useObservable(application.editorIsEmbedded);

  if (embedded) {
    return null;
  }

  return <HeaderContent />;
}
