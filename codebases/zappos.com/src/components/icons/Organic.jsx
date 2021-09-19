import React from 'react';
import Icon from './Icon';

const Organic = props => (
  <Icon
    width={45}
    height={42}
    title="Organic"
    description="The letter 'O'"
    {...props}>
    <defs>
      <circle id="prefix__a" cx={19.625} cy={19.5} r={19.5} />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(2 2)">
      <mask id="prefix__b" fill="#fff">
        <use xlinkHref="#prefix__a" />
      </mask>
      <use fill="#FBEAE5" xlinkHref="#prefix__a" />
      <g mask="url(#prefix__b)">
        <path
          fill="#075031"
          d="M20 9c6.075 0 11 4.925 11 11s-4.925 11-11 11S9 26.075 9 20 13.925 9 20 9zm0 4a7 7 0 100 14 7 7 0 000-14z"
        />
        <path
          fill="#52AA85"
          d="M19 8c6.075 0 11 4.925 11 11s-4.925 11-11 11S8 25.075 8 19 12.925 8 19 8zm0 4a7 7 0 100 14 7 7 0 000-14z"
        />
      </g>
    </g>
  </Icon>
);

export default Organic;
