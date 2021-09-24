import React, { useRef } from 'react';
import useClickOut from '../../hooks/useClickOut';

export default function SelectFirebaseProjectPop({ projects, selectProject, onClickOut }) {
  const dialog = useRef();
  useClickOut(dialog, onClickOut);

  if (projects.length === 0) {
    return (
      <dialog className="pop-over" ref={dialog}>
        <section className="pop-over-actions">
          You don't have any Firebase projects! Go to the{' '}
          <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
            Firebase console
          </a>{' '}
          to create one.
        </section>
      </dialog>
    );
  }
  return (
    <dialog className="pop-over" ref={dialog}>
      <section className="info">
        <h1>Your Firebase Projects</h1>
        <p>Select one of your Firebase projects to link. This will allow you to deploy from Glitch to your selected project.</p>
      </section>
      <section className="pop-over-actions results-list">
        <ul className="results">
          {projects.map((project) => (
            /* ESLINT-CLEAN-UP */
            /* eslint-disable-next-line */
            <li key={project.projectId} className="result" onClick={() => selectProject(project)}>
              <div className="result-name">{project.displayName}</div>
              <div className="result-description">{project.name}</div>
            </li>
          ))}
        </ul>
      </section>
    </dialog>
  );
}
