import React from 'react';
import Icon from './Icon';

const icon = (
  <svg width='16' height='16' viewBox='0 0 16 16'>
    <defs>
        <path id='spanner' d='M8.9 13.304c-1.192-.385-2.018.096-3.486 1.444L4.129 16A10.665 10.665 0 0 1 0 11.956l1.468-1.444C2.844 9.356 3.12 8.779 2.844 7.238c-.367-1.733-.367-3.755 1.744-5.68l1.01-.771c3.21-1.926 6.973.289 6.973.289S9.634 3 9.267 3.29c-.458.29-1.743 1.733-.183 3.948 1.468 2.31 3.12 1.54 3.578 1.155.367-.192 3.304-2.118 3.304-2.118s.55 4.333-2.753 6.451c-1.56.963-3.212.963-4.313.578z' />
    </defs>
    <use fill='#FFF' fillRule='nonzero' xlinkHref='#spanner' />
  </svg>

);

export default function SortIcon (props) {
  return (
    <Icon
      {...props}
      icon={icon}
    />
  );
}
