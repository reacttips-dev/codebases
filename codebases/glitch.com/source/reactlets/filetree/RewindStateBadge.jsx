import React from 'react';
import classnames from 'classnames';

/*
 * Badge for filetree items if they've been altered by Rewind
 * Possible state values:
 * * deleted
 * * added
 * * modified
 */

export default function RewindStateBadge({ state }) {
  const className = classnames({
    'rewind-state-icon': true,
    deleted: state === 'deleted',
  });

  // Note: "added" is the default and requires no classes on rewind-state-icon.
  return (
    <div className="rewind-state">
      <div className={className}>{state === 'modified' && <div className="mixed-lines-background" />}</div>
    </div>
  );
}
