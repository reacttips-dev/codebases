import React, { MouseEventHandler, useCallback } from 'react';

import CrossIcon from '@atlaskit/icon/glyph/cross';

import { FlagActions } from './FlagActions';
import { useFlagGroup } from './FlagGroup';
import { FlagProps } from './types';
import styles from './Flag.less';

function noop() {}

export const Flag = (props: FlagProps) => {
  const {
    actions = [],
    icon,
    title,
    description,
    isUndismissable,
    onMouseOver,
    onFocus = noop,
    onMouseOut,
    onBlur = noop,
    testId,
    id,
  } = props;

  const { onDismissed = noop, dismissAllowed } = useFlagGroup();
  const isDismissAllowed = !isUndismissable && dismissAllowed(id);

  const renderDismissButton = () => {
    // Ensure onDismissed is defined and isDismissAllowed is true to render
    // the dismiss button
    if (!isDismissAllowed) {
      return null;
    }

    return (
      <button
        className={styles.dismissButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          if (isDismissAllowed) {
            onDismissed({ id, dismissedVia: 'click' });
          }
        }}
        data-testid={testId && `${testId}-dismiss`}
        type="button"
      >
        <CrossIcon label="Dismiss flag" size="small" />
      </button>
    );
  };

  // We prevent default on mouse down to avoid focus ring when the flag is clicked,
  // while still allowing it to be focused with the keyboard.
  const handleMouseDown: MouseEventHandler<HTMLElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  const autoDismissProps = {
    onMouseOver,
    onFocus,
    onMouseOut,
    onBlur,
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className={styles.flag}
      role="alert"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      onMouseDown={handleMouseDown}
      data-testid={testId}
      {...autoDismissProps}
    >
      <div className={styles.header}>
        {icon}
        <span className={styles.title}>{title}</span>
        {renderDismissButton()}
      </div>
      <div className={styles.expander}>
        {description && (
          <div
            className={styles.description}
            data-testid={testId && `${testId}-description`}
          >
            {description}
          </div>
        )}
        <FlagActions actions={actions} testId={testId} />
      </div>
    </div>
  );
};
