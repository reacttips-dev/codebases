import React from 'react';
import Icon from './Icon';

const icon = (
  <svg width='8' height='10' viewBox='0 0 16 16'>
    <defs>
      <path id='run' d='M11.852 7.726L4.43 3.044a.264.264 0 0 0-.29-.002.319.319 0 0 0-.141.275v9.366a.319.319 0 0 0 .142.275c.09.057.2.056.289-.002l7.42-4.682A.317.317 0 0 0 12 8a.317.317 0 0 0-.148-.274z' />
    </defs>
    <use fill='#282828' fillRule='evenodd' xlinkHref='#run' />
  </svg>
);

export default function RunIcon (props) {
  return (
    <Icon
      {...props}
      icon={icon}
    />
  );
}
