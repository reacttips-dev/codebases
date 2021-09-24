import React from 'react';

export default function UserPresenceBadge({ users }) {
  return (
    <div className="current-users">
      {users.map((user) => (
        <div key={user.id()} className="current-user" style={{ backgroundColor: user.color() }} data-user={user.id()} />
      ))}
    </div>
  );
}
