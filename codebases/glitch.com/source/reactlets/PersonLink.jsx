import React from 'react';
import useObservable from '../hooks/useObservable';
import PersonAvatar from './PersonAvatar';

export default function PersonLink({ user }) {
  const login = useObservable(user.login) || 'Anonymous';
  const profileUrl = useObservable(user.profileUrl);

  return (
    <span className="person" data-tooltip={login} data-tooltip-top>
      <a href={profileUrl} aria-label={login} target="_blank" rel="noopener noreferrer">
        <PersonAvatar user={user} hideOnlineStatus />
      </a>
    </span>
  );
}
