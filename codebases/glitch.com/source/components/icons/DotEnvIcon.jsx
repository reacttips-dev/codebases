import React from 'react';
import styled from 'styled-components';

const SVGWrapper = styled.svg`
  display: inline-block;
  width: 25px;
  vertical-align: middle;
  transform: translate(-5px, -2.5px) rotate(-25deg);

  /* this gets .env to line up with assets in the filetree
   TODO: cleanup when redoing filetree structure/styling */
  & + .display-file-name {
    left: -5px;
  }
`;

const HeadPath = styled.path`
  fill: var(--colors-primary);
  .active & {
    fill: var(--colors-background);
  }
`;

const KeyPath = styled.path`
  stroke: var(--colors-primary);
  .active & {
    stroke: var(--colors-background);
  }
`;

export default function DotenvIcon() {
  return (
    <SVGWrapper height="11" viewBox="0 0 16 11" width="16" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd" transform="translate(0 1)">
        <HeadPath d="m16 9h-1v-1h-1v1h-1v-1h-1v1h-1v-2h2v-1.5h-5v-1h8v1h-2v1.5h2z" />
        <KeyPath
          d="m4.5 8.8c-4-3.33333333-5.33333333-5.66666667-4-7s2.66666667-1 4 1c1.33333333-2 2.66666667-2.33333333 4-1s0 3.66666667-4 7z"
          strokeLinejoin="round"
          transform="matrix(0 -1 1 0 -.4 9.4)"
        />
      </g>
    </SVGWrapper>
  );
}
