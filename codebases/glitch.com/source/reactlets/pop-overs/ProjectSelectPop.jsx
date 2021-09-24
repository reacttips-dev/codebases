import React, { useCallback, useEffect, useState } from 'react';
import { Icon, Loader } from '@glitchdotcom/shared-components';
import once from 'lodash/once';
import uniqBy from 'lodash/uniqBy';
import ProjectItem from '../ProjectItem';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import fuzzy from '../../utils/fuzzy';
import isCmdHeld from '../../utils/isCmdHeld';
import whenKeyIsEnter from '../../utils/whenKeyIsEnter';

function ProjectSelectItem({ project, onClick }) {
  const href = useObservable(project.editorUrl);

  return (
    <li className="result">
      <a className="no-select" role="button" tabIndex={0} onClick={onClick} href={href} onKeyPress={whenKeyIsEnter(onClick)}>
        <ProjectItem project={project} />
      </a>
    </li>
  );
}

const fetchProjects = once((application) => {
  application.fetchUserProjects();
});

function ProjectSelectPopContent() {
  const application = useApplication();
  const loadedProjectList = useObservable(application.projectListIsLoaded);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    fetchProjects(application);
  }, [application]);

  const swapProject = (e) => {
    setSearchValue('');
    application.projectsSelectPopVisible(false);
    if (!isCmdHeld(e, application.isMacOS)) {
      application.rewindPanelVisible(false);
    }
  };

  const results = useObservable(
    useCallback(() => {
      const currentProject = application.currentProject();
      const projects = application.projects().filter((project) => (currentProject ? project.id() !== currentProject.id() : true));
      const query = searchValue.toLowerCase().trim();

      const domainResults = fuzzy(projects, query, (project) => project.domain().toLowerCase());
      const descriptionResults = fuzzy(projects, query, (project) => project.description().toLowerCase());

      return uniqBy([...domainResults, ...descriptionResults], (result) => result.item)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)
        .map((project) => ({ key: project.id(), project }));
    }, [searchValue, application]),
  );

  const hideProjectSelectPop = () => {
    application.projectsSelectPopVisible(false);
    application.projectPopVisible(true);
  };

  const focusOnOpen = useCallback((node) => {
    if (node) {
      node.focus();
    }
  }, []);

  return (
    <dialog className="pop-over project-select-pop">
      {/* Existing accessibility issue ported to React. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <section role="presentation" className="info clickable-label" onClick={hideProjectSelectPop}>
        <div className="back icon" />
        <h1>
          Your Projects <Icon icon="hibiscus" />
        </h1>
      </section>
      <section className="info">
        <div className="input-wrap">
          <input
            id="project-search"
            className="input search-input"
            value={searchValue}
            aria-label="Search Projects"
            placeholder="Search Projects"
            onChange={(e) => setSearchValue(e.target.value)}
            ref={focusOnOpen}
          />
        </div>
      </section>
      <section className="actions results-list swapped-li-a">
        {!loadedProjectList ? (
          <div className="projects-list-loading">
            <Loader />
          </div>
        ) : (
          <ul className="results">
            {results.map(({ key, project }) => (
              <ProjectSelectItem key={key} project={project} onClick={(e) => swapProject(e, project)} />
            ))}
          </ul>
        )}
      </section>
    </dialog>
  );
}

export default function ProjectSelectPop() {
  const application = useApplication();
  const visible = useObservable(application.projectsSelectPopVisible);

  if (!visible) {
    return null;
  }

  return <ProjectSelectPopContent />;
}
