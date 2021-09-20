import React from 'react';
import classnames from 'classnames';

/**
 * Badge Component
 */
export default function Badge (props) {
  return (
    <div
      className={classnames('search-result-badge', props.className)}
      onMouseDown={props.onMouseDown}
      onClick={props.onClick}
      ref={props.inputRef}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      data-id={props['data-id']}
    >
      {props.children}
    </div>
  );
}
