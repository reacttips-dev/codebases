import React from 'react';
import Icon from './Icon';

const icon = (
  <svg width='16' height='16' viewBox='0 0 16 16'>
    <defs>
      <path id='time' d='M8 0C3.583 0 0 3.583 0 8s3.583 8 8 8 8-3.583 8-8-3.583-8-8-8zm-.35 1.802h.679v.678H7.65v-.678zM2.48 8.349h-.678v-.678h.678v.678zm5.87 5.85H7.67v-.679h.678v.678zm1.897-3.041l-3.177-2.5V3.68h1.124v4.436l2.75 2.15-.697.892zm3.951-2.809h-.678v-.678h.678v.678z' />
    </defs>
    <use fill='#282828' fillRule='evenodd' xlinkHref='#time' />
  </svg>
);

export default function TimeIcon (props) {
  return (
    <Icon
      {...props}
      icon={icon}
    />
  );
}
