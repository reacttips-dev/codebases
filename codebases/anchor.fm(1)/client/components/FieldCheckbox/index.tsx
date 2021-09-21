import React from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';
import { FieldCheckboxProps } from './types';

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: normal;
  font-size: 1.4rem;
  color: #292f36;
  & input[type='checkbox'] {
    margin-right: 11px;
    margin-top: 0;
    position: relative;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #cccdcf;
    border-radius: 4px;
    -webkit-appearance: none;

    &:checked {
      background: #5000b9;
    }

    &::before {
      visibility: hidden;
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 6px;
      height: 10px;
      border: solid #fff;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }

    &:checked::before {
      visibility: visible;
    }

    &:focus {
      outline: 0;
      border: 1px solid #5000b9;
    }
  }
`;

const FieldCheckbox = React.forwardRef(
  (
    { label, name, cssProp, ...rest }: FieldCheckboxProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div
        className={css`
          display: flex;
          justify-content: center;
          ${cssProp}
        `}
      >
        <CheckboxLabel>
          <input ref={ref} {...rest} id={name} type="checkbox" name={name} />
          {label}
        </CheckboxLabel>
      </div>
    );
  }
);

export { FieldCheckbox };
export { ControlledFieldCheckbox } from './ControlledFieldCheckbox';
