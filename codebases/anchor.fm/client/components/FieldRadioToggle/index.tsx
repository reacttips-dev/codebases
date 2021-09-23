/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import classnames from 'classnames/bind';
import styles from './styles.sass';
import { FieldRadioToggleProps } from './types';

const cx = classnames.bind(styles);

const FieldRadioToggle = React.forwardRef(
  (
    {
      label,
      name,
      options,
      disabled,
      onChange,
      value,
      cssProp,
      ...rest
    }: FieldRadioToggleProps,
    ref: React.Ref<HTMLInputElement>
  ) => (
    <fieldset css={cssProp}>
      {label && <legend className={styles.legend}>{label}</legend>}
      <div
        css={css`
          display: flex;
        `}
      >
        {options.map((option, index) => {
          const { value: optionValue, label: optionLabel } = option;
          const inputId = `${name}_${index}`;
          const lastIndex = options.length - 1;
          const isSelected = value === optionValue;

          return (
            <label
              key={`${optionValue}-radio-option`}
              htmlFor={inputId}
              data-cy={inputId}
              className={cx({
                option: true,
                firstOption: index === 0,
                lastOption: index === lastIndex,
                selected: isSelected,
                optionDisabled: disabled,
                selectedDisabled: isSelected && disabled,
              })}
            >
              {optionLabel}
              <input
                {...rest}
                ref={ref}
                className={cx({
                  input: true,
                })}
                id={inputId}
                name={name}
                onChange={disabled ? () => null : onChange}
                value={optionValue}
                type="radio"
                checked={isSelected}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  )
);

export { FieldRadioToggle };
export { ControlledFieldRadioToggle } from './ControlledFieldRadioToggle';
