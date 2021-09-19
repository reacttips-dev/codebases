import React from 'react';
import Icon from './Icon';

const EcoFriendly = props => (
  <Icon
    width={45}
    height={42}
    title="Eco Friendly"
    description="A Leaf"
    {...props}>
    <defs>
      <circle id="prefix__a" cx={19.5} cy={19.5} r={19.5} />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(3 2)">
      <mask id="prefix__b" fill="#fff">
        <use xlinkHref="#prefix__a" />
      </mask>
      <use fill="#DAFBED" xlinkHref="#prefix__a" />
      <g fill="#075031" mask="url(#prefix__b)">
        <path d="M16.016 25.737c-.177-6.587 1.154-11.016 3.993-13.288 2.766-2.212 7.283-2.926 13.55-2.14a1 1 0 01.845 1.237C31.37 23.57 25.457 29.38 16.668 28.98c0 0 .357-2.083 3.575-6.482.808-1.104 2.191-2.929 4.149-5.474-1.487.925-2.736 1.95-3.746 3.075-.953 1.062-2.375 2.976-4.266 5.744a.2.2 0 01-.364-.107zm-1.018.257c.048-3.308-.667-5.543-2.146-6.705-1.398-1.099-3.631-1.495-6.7-1.189a1 1 0 00-.864 1.265c1.666 5.954 4.784 8.83 9.354 8.625 0 0-.191-1.096-1.915-3.411a172.259 172.259 0 00-2.223-2.882c.797.487 1.466 1.027 2.007 1.619.483.528 1.19 1.458 2.123 2.79a.2.2 0 00.364-.112z" />
      </g>
    </g>
  </Icon>
);

export default EcoFriendly;
