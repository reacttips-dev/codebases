import React from 'react';
import cn from 'classnames';
import useObservable from '../hooks/useObservable';

export default function TeamButton({ team }) {
  const name = useObservable(team.name);
  const avatarUrl = useObservable(team.avatarUrl);
  const teamPageUrl = useObservable(team.teamPageUrl);

  return (
    <a className="button button-small button-secondary" href={teamPageUrl}>
      {name}
      <div className={cn('avatar icon team-avatar', { 'anon-avatar': !avatarUrl })} style={{ backgroundImage: `url(${avatarUrl})` }} />
    </a>
  );
}
