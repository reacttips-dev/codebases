import React, { useCallback } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import Project from '../../models/project';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import ProjectItem from '../ProjectItem';
import whenKeyIsEnter from '../../utils/whenKeyIsEnter';

function NewProjectItem({ project, onClick }) {
  const href = useObservable(project.remixUrl);

  return (
    <li className="result">
      <a className="no-select" tabIndex={0} href={href} onClick={onClick} onKeyPress={whenKeyIsEnter(onClick)}>
        <ProjectItem project={project} />
      </a>
    </li>
  );
}

export default function NewProjectPop() {
  const application = useApplication();
  const visible = useObservable(application.newProjectPopVisible);

  const createNewProject = () => {
    application.newProjectPopVisible(false);
  };

  const newProjects = useObservable(
    useCallback(
      () =>
        application
          .newProjectTemplates()
          .map((project) => Project(project))
          .map((project) => ({ key: project.id(), project })),
      [application],
    ),
  );

  const hideNewProjectPop = () => {
    application.newProjectPopVisible(false);
    application.projectPopVisible(true);
  };

  const importFromRepo = () => {
    application.closeAllPopOvers();
    const repoUrl = window.prompt('Paste the full URL of your repository', 'https://github.com/orgname/reponame.git');
    if (!repoUrl) {
      return;
    }
    try {
      // Prove that this is a valid URL by using URL deconstruction
      // If it's not valid, we bail out here with a user message to that effect.
      const parsedURL = new URL(repoUrl);
      if (parsedURL.username) {
        throw new Error(`We can't import repo URLs with credentials in them`);
      }
      application.history.push(`/import/git?url=${repoUrl}`);
    } catch (error) {
      if (error.message.includes('Invalid URL')) {
        application.notifyGenericError({ message: "That doesn't look like a valid git repo URL. Please check and try again" });
      } else if (error.message) {
        application.notifyGenericError({ message: error.message });
      } else {
        application.notifyGenericError();
      }
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <dialog className="pop-over new-project-pop">
      {/* Existing accessibility issue ported to React. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <section role="presentation" className="info clickable-label" onClick={hideNewProjectPop}>
        <div className="back icon" />
        <h1>
          New Project <Icon icon="sparkles" />
        </h1>
      </section>
      <section className="actions results-list swapped-li-a">
        <ul className="results">
          {newProjects.map(({ key, project }) => (
            <NewProjectItem key={key} project={project} onClick={() => createNewProject(project)} />
          ))}
        </ul>
      </section>
      <section className="info">
        <div className="button-wrap">
          <button className="button" onClick={importFromRepo} data-testid="new-project-from-github-button">
            Import from GitHub
          </button>
        </div>
      </section>
    </dialog>
  );
}
