/** @jsx jsx */
import { forwardRef, Ref } from 'react';
import { css, jsx } from '@emotion/core';
import classnames from 'classnames/bind';
import styles from 'components/FieldInput/styles.sass';
import { FieldInputProps } from 'components/FieldInput/types';
import serverRenderingUtils from 'helpers/serverRenderingUtils';
import { Icon } from 'shared/Icon';
import Text from 'shared/Text/index';

const cx = classnames.bind(styles);

const isMobile =
  serverRenderingUtils.isIOS() || serverRenderingUtils.isAndroidChrome();

function getCharacterCountText({
  maxCharacterLength,
  value,
}: Pick<FieldInputProps, 'maxCharacterLength' | 'value'>) {
  const displayValue =
    typeof value === 'number' ? value.toString().length : value?.length || 0;
  return maxCharacterLength !== undefined
    ? `${displayValue} / ${maxCharacterLength}`
    : displayValue;
}

export const FieldInput = forwardRef(
  (
    {
      name,
      type,
      onChange,
      onBlur,
      onFocus,
      onClear,
      placeholder,
      value,
      min,
      max,
      autoFocus,
      maxCharacterLength,
      error,
      isShowingError = !!error,
      iconType,
      cssProp,
      showCharacterCount,
      disabled,
      'aria-describedby': ariaDescribedBy,
      ...props
    }: FieldInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const isShowingBottomSection =
      showCharacterCount || (isShowingError && error?.message);
    const showClearButton = !!onClear && value !== '';
    return (
      <div css={cssProp}>
        <div className={styles.inputContainer}>
          {iconType && (
            <div className={styles.iconWrapper}>
              <Icon type={iconType} fillColor="#dedfe0" />
            </div>
          )}
          <input
            {...props}
            ref={ref}
            className={cx({
              input: true,
              numberInput: type === 'number',
              numberInputMobile: isMobile,
              inputError: isShowingError,
              inputWithClearButton: onClear,
              inputWithIcon: iconType,
              disabled,
            })}
            name={name}
            id={name}
            data-cy={name}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            value={value}
            type={type}
            min={type === 'number' ? min : undefined}
            max={type === 'number' ? max : undefined}
            maxLength={maxCharacterLength}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            aria-describedby={ariaDescribedBy}
          />
          {showClearButton && (
            <button
              type="button"
              onClick={onClear}
              name="Clear input"
              className={styles.clearButton}
            >
              <Icon type="x" fillColor="#fff" />
            </button>
          )}
        </div>
        {isShowingBottomSection && (
          <div className={styles.bottomSection}>
            <div
              className={cx({
                errorText: true,
                errorTextVisible: isShowingError,
              })}
            >
              <div
                css={css`
                  color: #d0021b;
                  font-size: 1.4rem;
                  line-height: 1.8rem;
                `}
                id={ariaDescribedBy}
              >
                {error?.message}
              </div>
            </div>
            {showCharacterCount && (
              <Text size="sm" color="#7f8287">
                {getCharacterCountText({ maxCharacterLength, value })}
              </Text>
            )}
          </div>
        )}
      </div>
    );
  }
);

export { FieldInputWithRedux } from './FieldInputWithRedux';
export { ControlledFieldInput } from './ControlledFieldInput';
