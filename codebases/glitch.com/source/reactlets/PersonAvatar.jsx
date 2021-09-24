import React from 'react';
import cn from 'classnames';
import useObservable from '../hooks/useObservable';

export default function PersonAvatar({ user, hideOnlineStatus = false }) {
  const isOnline = useObservable(user.isOnline);
  const avatarUrl = useObservable(user.avatarUrl);
  const color = useObservable(user.color);

  return (
    <div
      className={cn('avatar icon', { 'anon-avatar': !avatarUrl, 'online-active-user': isOnline && !hideOnlineStatus })}
      style={{
        backgroundImage: avatarUrl && `url("${avatarUrl}")`,
        backgroundColor: !avatarUrl && color,
        boxShadow: isOnline && !hideOnlineStatus && `0 0 0 1.5px ${color}, inset 0 0 0 1px var(--primary-background)`,
      }}
    />
  );
}
