import React, { useMemo, useCallback } from 'react';
import * as Markdown from '../../utils/markdown';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

function useTeamValue(team, property) {
  return useObservable(useCallback(() => team && team[property](), [team, property]));
}

export default function TeamPop() {
  const application = useApplication();
  const top = useObservable(application.collaboratorPositionTop) + 24;
  const left = useObservable(application.collaboratorPositionLeft) + 4;
  const team = useObservable(application.teamPopCurrentTeam);
  const visible = useObservable(useCallback(() => team !== null, [team]));
  const name = useTeamValue(team, 'name');
  const url = useTeamValue(team, 'url');
  const avatarUrl = useTeamValue(team, 'avatarUrl');
  const teamPageUrl = useTeamValue(team, 'teamPageUrl');
  const backgroundColor = useTeamValue(team, 'backgroundColor');
  const description = useTeamValue(team, 'description');
  const renderedDescription = useMemo(() => description && Markdown.render(description), [description]);

  if (!visible) {
    return null;
  }

  return (
    // Shouldn't be an a11y issue since we're just stopping the event propagation
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <dialog
      className="pop-over team-pop"
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      <section className="info">
        <h1>Team</h1>
      </section>
      <a href={teamPageUrl}>
        <section className="profile-summary no-bottom-border">
          <div className="profile-wrap">
            <div className="avatar team-avatar icon" style={{ backgroundImage: `url(${avatarUrl})`, backgroundColor }} />
            <div className="user-info">
              <h1>{name}</h1>
              <p className="login">{url}</p>
            </div>
          </div>
        </section>
      </a>

      {/* eslint-disable-next-line react/no-danger */}
      {description && <section dangerouslySetInnerHTML={{ __html: renderedDescription }} />}
    </dialog>
  );
}
