import React from 'react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select`
  width: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  font-size: 1rem;
  padding-left: 8px;
  padding-right: 2rem;
  height: 36px;
  background: var(--colors-background);
  transition: all 0.2s ease 0s;
  border-radius: 4px;
  border: 1px solid var(--colors-primary);
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
`;

const SelectIconWrapper = styled.div`
  position: absolute;
  display: inline-flex;
  height: 100%;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  right: 12px;
  top: 50%;
  pointer-events: none;
  z-index: 2;
  transform: translateY(-50%);
  path {
    fill: var(--colors-primary);
  }
`;

const SelectIcon = () => (
  <SelectIconWrapper>
    <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 3.22763L7.64801 0L9 1.38618L4.5 6L0 1.38618L1.35199 0L4.5 3.22763Z" />
    </svg>
  </SelectIconWrapper>
);

export default function Select({ name, id, value, onChange, onFocus, children }) {
  return (
    <SelectWrapper>
      <StyledSelect
        name={name}
        id={id}
        onFocus={onFocus}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        value={value}
      >
        {children}
      </StyledSelect>
      <SelectIcon />
    </SelectWrapper>
  );
}
