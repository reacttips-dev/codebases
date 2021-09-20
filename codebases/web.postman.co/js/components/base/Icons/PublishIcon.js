import React from 'react';
import Icon from './Icon';

const icon = (
  <svg width='15' height='16' viewBox='0 0 16 16'>
    <defs>
      <path id='publish' d='M5 15.991V.002h9.827c.317-.02.628.097.852.323.224.226.339.539.316.857v13.7c.03.3-.076.599-.289.812a1 1 0 0 1-.81.29H5v.007zM7.5 4v1h6V4h-6zm6 4h-6V7h6v1zM3 15.991c-.385.02-.615 0-1 0-1 0-.992-.48-.995-.951V1.123c-.03-.3.077-.598.29-.81C1.507.098 1.7-.009 2 .02h1v15.97z' />
    </defs>
    <use fill='#282828' fillRule='evenodd' xlinkHref='#publish' />
  </svg>
);

export default function PublishIcon (props) {
  return (
    <Icon
      {...props}
      icon={icon}
    />
  );
}
