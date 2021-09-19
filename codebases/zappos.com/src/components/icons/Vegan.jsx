import React from 'react';
import Icon from './Icon';

const Vegan = props => (
  <Icon
    width={45}
    height={42}
    title="Vegan"
    description="The letter 'V'"
    {...props}>
    <defs>
      <circle id="prefix__a" cx={19.625} cy={19.5} r={19.5} />
    </defs>
    <g transform="translate(3 1)" fill="none" fillRule="evenodd">
      <mask id="prefix__b" fill="#fff">
        <use xlinkHref="#prefix__a" />
      </mask>
      <use fill="#D4EFFF" xlinkHref="#prefix__a" />
      <g mask="url(#prefix__b)">
        <path
          d="M19.283 31.456a1 1 0 01-.487-.127l-2.76-1.54a1 1 0 01-.453-.533L9.5 12.456l.206-1.556a1 1 0 011.622-.645l2.553 2.071a1 1 0 01.257.314l7.616 14.58 6.919-16.55a1 1 0 01.133-.228l.088-.099a1 1 0 011.414.01l1.68 1.705a1 1 0 01.173 1.167L22.872 30.92a1 1 0 01-.885.535h-2.704z"
          fill="#075031"
        />
        <path
          d="M16.64 29.456a1 1 0 01-.894-.552l-8.52-17a1 1 0 01.894-1.448h2.303a1 1 0 01.895.555l7.424 14.912 7.423-14.912a1 1 0 01.77-.547l.126-.008h2.302a1 1 0 01.894 1.448l-8.52 17a1 1 0 01-.894.552H16.64z"
          stroke="#52AA85"
          fill="#52AA85"
        />
      </g>
    </g>
  </Icon>
);

export default Vegan;
