import React from 'react';
import { Progress } from '@glitchdotcom/shared-components';
import styled from 'styled-components';

export const StyledProgress = styled(Progress)`
  -webkit-appearance: none;
  appearance: none;
  position: relative;
  width: inherit;
  height: 10px;
  border: solid var(--colors-border) 1px;
  border-radius: 12px;

  /* For Firefox, -moz-progress-value doesn't exist, so you use the element itself and -moz-progress-bar, rather than 
  -moz-progress-bar and -moz-progress-value */
  background-color: var(--colors-secondary-background);
  border-radius: 12px;
  &[value]::-moz-progress-bar {
    background-color: var(--colors-border);
    border-radius: 12px;
  }

  /* For others */
  &[value]::-webkit-progress-bar {
    background-color: var(--colors-secondary-background);
    border-radius: 12px;
  }
  &[value]::-webkit-progress-value {
    background-color: var(--colors-border);
    border-radius: 12px;
  }
`;
const SplitProgressDivWrapper = styled.div`
  display: grid;
  position: relative;
  width: 80px;
  height: 10px;
`;
const SplitProgressDivWrapperLeft = styled(SplitProgressDivWrapper)`
  /* Here we're using two triangles on top of each other and slightly offset to create the illusion of a border on the triangle 
  This is then placed on top of the progress bar to make it look like it has an angle */
  &:before {
    position: absolute;
    top: 0;
    right: 0.7px;
    content: '';
    width: 0;
    height: 0;
    border-bottom: 10px solid var(--colors-border);
    border-left: 10px solid transparent;
    z-index: 1;
  }
  &:after {
    position: absolute;
    top: 0;
    right: -0.7px;
    content: '';
    width: 0;
    height: 0;
    border-bottom: 11px solid var(--colors-background);
    border-left: 11px solid transparent;
    z-index: 1;
  }
`;
const SplitProgressDivWrapperRight = styled(SplitProgressDivWrapper)`
  /* Here we're using two triangles on top of each other and slightly offset to create the illusion of a border on the triangle 
  This is then placed on top of the progress bar to make it look like it has an angle */
  &:before {
    position: absolute;
    left: 0.7px;
    bottom: 0;
    content: '';
    width: 0;
    height: 0;
    border-top: 10px solid var(--colors-border);
    border-right: 10px solid transparent;
    z-index: 1;
  }
  &:after {
    position: absolute;
    left: -0.7px;
    bottom: 0;
    content: '';
    width: 0;
    height: 0;
    border-top: 11px solid var(--colors-background);
    border-right: 11px solid transparent;
    z-index: 1;
  }
`;
const SplitProgressLeft = styled(StyledProgress)`
  border-radius: 12px 0 0 12px;

  /* For Firefox (see note above) */
  &[value]::-moz-progress-bar {
    border-radius: 12px 0 0 12px;
  }

  /* For others */
  &[value]::-webkit-progress-bar {
    border-radius: 12px 0 0 12px;
  }
  &[value]::-webkit-progress-value {
    border-radius: 12px 0 0 12px;
  }
`;
const SplitProgressRight = styled(StyledProgress)`
  border-radius: 0 12px 12px 0;

  /* For Firefox (see note above) */
  &[value]::-moz-progress-bar {
    border-radius: 0 12px 12px 0;
  }

  /* For others */
  &[value]::-webkit-progress-bar {
    border-radius: 0 12px 12px 0;
  }
  &[value]::-webkit-progress-value {
    border-radius: 12px 0 0 12px;
  }
`;

const SplitProgressWrapper = styled.div`
  position: relative;
  display: flex;
  width: 180px;
  height: 8px;
`;

export default function SplitProgress({ value, max, tooltip }) {
  return (
    <SplitProgressWrapper>
      <SplitProgressDivWrapperLeft>
        <SplitProgressLeft value={value} max={max}>
          {value}
        </SplitProgressLeft>
      </SplitProgressDivWrapperLeft>
      <SplitProgressDivWrapperRight>
        <SplitProgressRight value={0} max={max} data-tooltip={tooltip}>
          {0}
        </SplitProgressRight>
      </SplitProgressDivWrapperRight>
    </SplitProgressWrapper>
  );
}
