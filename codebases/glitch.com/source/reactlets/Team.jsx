import React from 'react';
import cn from 'classnames';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

export default function Team({ team }) {
  const application = useApplication();
  const name = useObservable(team.name);
  const avatarUrl = useObservable(team.avatarUrl);
  const borderColor = useObservable(team.backgroundColor);

  return (
    <button
      className="person team no-button-styles"
      data-tooltip={name}
      data-tooltip-left
      aria-label={`Open team pop-over for the team "${name}"`}
      onClick={(e) => {
        if (application.teamPopCurrentTeam() === team) {
          application.teamPopCurrentTeam(null);
          return;
        }
        application.closeAllPopOvers();
        e.stopPropagation();
        const rect = e.target.getBoundingClientRect();
        application.collaboratorPositionTop(rect.top);
        application.collaboratorPositionLeft(rect.left);
        application.teamPopCurrentTeam(team);
      }}
    >
      <div className={cn('avatar icon team-avatar', { 'anon-avatar': !avatarUrl })} style={{ backgroundImage: `url(${avatarUrl})`, borderColor }} />
    </button>
  );
}
