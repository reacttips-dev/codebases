/** @jsx jsx */
import { forwardRef, Ref } from 'react';
import { jsx } from '@emotion/core';
import classNames from 'classnames';
import { FieldTextAreaProps } from './types';
import fieldStyles from '../Field/styles.sass';
import styles from './styles.sass';

const FieldTextArea = forwardRef(
  (
    {
      name,
      maxLength,
      error,
      isShowingError = !!error,
      className,
      rows = 12,
      value,
      cssProp,
      ...rest
    }: FieldTextAreaProps,
    ref: Ref<HTMLTextAreaElement>
  ) => {
    return (
      <div
        className={classNames(styles.container, {
          [className as string]: !!className,
        })}
        css={cssProp}
      >
        <textarea
          ref={ref}
          {...rest}
          value={value}
          className={classNames(fieldStyles.input, styles.textarea, {
            [fieldStyles.inputError]: isShowingError,
          })}
          rows={rows}
          name={name}
          id={name}
          data-cy={name}
          maxLength={maxLength}
        />
        <div className={styles.bottomSection}>
          <div
            className={classNames({
              [fieldStyles.errorWrapper]: true,
              [fieldStyles.errorWrapperVisible]: isShowingError,
            })}
          >
            <span className={fieldStyles.errorText}>{error?.message}</span>
          </div>
          {maxLength && (
            <div className={styles.characterCount}>
              {value?.toString().length || 0} / {maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export { FieldTextArea };
export { ControlledFieldTextArea } from './ControlledFieldTextArea';
