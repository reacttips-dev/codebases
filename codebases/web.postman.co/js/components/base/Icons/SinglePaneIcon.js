import React from 'react';
import Icon from './Icon';
import XPath from '../XPaths/XPath';

const icon = (
  <svg width='16' height='16' viewBox='0 0 16 16'>
    <defs>
      <path id='single-pane' d='M7.5 1H1v14h6.521a.974.974 0 0 1-.021-.205V1zm1 0v13.795c0 .072-.007.14-.021.205H15V1H8.5zM15 0a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h14zM2.25 10V6h4v4h-4zm9.5 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z' />
    </defs>
    <use fill='gray' fillRule='evenodd' transform='rotate(90 8 8)' xlinkHref='#single-pane' />
</svg>
);

export default function SinglePaneIcon (props) {
  return (
    <XPath identifier='layout'>
      <Icon
        {...props}
        icon={icon}
      />
    </XPath>
  );
}
