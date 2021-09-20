import React from 'react';
import Icon from './Icon';

const icon = (
  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='38' viewBox='0 0 16 38'>
    <path fill='none' fillRule='nonzero' stroke='#ECECEC' d='M1 0l14.308 18.758L1 37.516' />
  </svg>
);

export default function ForwardIcon (props) {
  return (
    <Icon
      {...props}
      icon={icon}
    />
  );
}
