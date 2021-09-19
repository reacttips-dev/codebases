import React from 'react';
import Icon from './Icon';

const GiveBack = props => (
  <Icon
    width={45}
    height={42}
    title="Give Back"
    description="A heart"
    {...props}>
    <defs>
      <circle id="prefix__a" cx={19.5} cy={19.5} r={19.5} />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(3 1)">
      <mask id="prefix__b" fill="#fff">
        <use xlinkHref="#prefix__a" />
      </mask>
      <use fill="#ECE0FD" xlinkHref="#prefix__a" />
      <path
        fill="#8F1775"
        stroke="#8F1775"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.221 12a4.795 4.795 0 00-3.889 1.979l-.832 1.153-.832-1.153A4.795 4.795 0 0014.778 12C12.14 12 10 14.116 10 16.726c0 1.844.74 3.612 2.059 4.915L19.5 29l7.441-7.359A6.913 6.913 0 0029 16.726C29 14.116 26.86 12 24.221 12z"
        mask="url(#prefix__b)"
      />
    </g>
  </Icon>
);

export default GiveBack;
