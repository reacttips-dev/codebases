/** @jsx jsx */
import { forwardRef } from 'react';
import { jsx } from '@emotion/core';
import Toggle from 'react-toggle';
import styles from './styles.sass';
import { FieldToggleProps } from './types';

/**
 * This component just glues the redux-form and react-toggle
 * implementations together
 * https://github.com/react-bootstrap/react-bootstrap/issues/2210#issuecomment-246933578
 */
export const FieldToggle = forwardRef(
  (
    { name, value, cssProp, ...props }: FieldToggleProps,
    ref: React.Ref<Toggle>
  ) => {
    // redux form defaults value to an empty string, but we'll check
    // for a non-empty string too and assume that's true
    let checked = false;
    if (typeof value === 'string') checked = value.length > 0;
    if (typeof value === 'boolean') checked = value;
    return (
      <div className={styles.container} css={cssProp}>
        <Toggle ref={ref} icons={false} checked={checked} {...props} />
      </div>
    );
  }
);

export { ControlledFieldToggle } from './ControlledFieldToggle';
export { FieldToggleWithRedux } from './FieldToggleWithRedux';
