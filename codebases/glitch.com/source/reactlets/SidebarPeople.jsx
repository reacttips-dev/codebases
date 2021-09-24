import React from 'react';
import { Loader } from '@glitchdotcom/shared-components';

import { Overlay } from '@glitchdotcom/glitch-design-system';
import useObservable from '../hooks/useObservable';
import useApplication from '../hooks/useApplication';
import Person from './Person';
import Team from './Team';
import ProjectVisibilityIcon from '../components/icons/ProjectVisibilityIcon';
import ShareProjectOverlay from '../components/overlays/ShareProjectOverlay';

const PeopleListForProject = () => {
  const application = useApplication();
  const currentUsers = useObservable(application.currentUsers);
  const offlineMembers = useObservable(application.offlineMembers);

  const filteredSidebarUsersForDuplicates = (arr) => {
    return arr.reduce((acc, current) => {
      const x = acc.find((item) => item.id() === current.id());
      if (!x) {
        return acc.concat([current]);
      }
      return acc;
    }, []);
  };

  const currentUsersFiltered = filteredSidebarUsersForDuplicates(currentUsers);
  const offlineMembersFiltered = filteredSidebarUsersForDuplicates(offlineMembers);

  return (
    <div className="collaborators opens-pop-over">
      {currentUsersFiltered.map((user) => (
        <Person application={application} user={user} key={user.id()} />
      ))}
      {offlineMembersFiltered.map((user) => (
        <Person application={application} user={user} key={user.id()} />
      ))}
    </div>
  );
};

const TeamsListForProject = () => {
  const application = useApplication();
  const currentProject = useObservable(application.currentProject);
  const currentProjectTeams = useObservable(currentProject.teams);
  if (currentProjectTeams.length > 0) {
    return (
      <div className="collaborators opens-pop-over teams-list">
        {application
          .currentProject()
          .teams()
          .map((team) => (
            <Team application={application} team={team} key={team.id()} />
          ))}
      </div>
    );
  }
  return null;
};

export default function SidebarPeople() {
  const application = useApplication();
  const userIsLoggingIn = useObservable(application.userIsLoggingIn);
  const editorIsEmbedded = useObservable(application.editorIsEmbedded);
  const currentProject = useObservable(application.currentProject);
  const currentProjectPrivacy = useObservable(currentProject?.privacy);
  const currentUserIsOwner = useObservable(application.projectIsAdminForCurrentUser);

  const overlayTitle = currentUserIsOwner ? 'Share your project' : 'Share this project';

  if (!currentProject || editorIsEmbedded) {
    return null;
  }

  const passButton = (
    <button
      onClick={() => application.analytics.track('Share Menu Viewed')}
      id="share-project"
      data-testid="share-button"
      className="button share-project opens-pop-over"
      aria-label="Open share popover menu"
    >
      <ProjectVisibilityIcon privacy={currentProjectPrivacy} />
      <span className="label">Share</span>
    </button>
  );

  return (
    <section className="sidebar-section sidebar-people-wrap">
      <div className="sidebar-people grouped-avatars">
        {userIsLoggingIn ? <Loader /> : <PeopleListForProject application={application} />}
        <div className="collaborators-buttons">
          <Overlay title={overlayTitle} passThroughTrigger={passButton}>
            {() => {
              return <ShareProjectOverlay currentProject={currentProject} />;
            }}
          </Overlay>
        </div>
      </div>
      <TeamsListForProject application={application} />
    </section>
  );
}
