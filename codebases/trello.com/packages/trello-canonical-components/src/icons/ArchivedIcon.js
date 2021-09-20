/* eslint-disable import/no-default-export */
import React from 'react';

const ArchivedIcon = (props) => (
  <svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <g fill={props.color || 'currentColor'} fillRule="evenodd">
      <path d="M3.03418 5.59623C2.98604 5.04604 3.39303 4.56101 3.94322 4.51287L19.8823 3.11838C20.4325 3.07025 20.9175 3.47724 20.9657 4.02742L21.0528 5.02362L3.12133 6.59242L3.03418 5.59623Z" />
      <path d="M9 12.9999C9 12.4477 9.44772 11.9999 10 11.9999H14C14.5523 11.9999 15 12.4477 15 12.9999C15 13.5522 14.5523 13.9999 14 13.9999H10C9.44772 13.9999 9 13.5522 9 12.9999Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 18.9999V7.99994H21V18.9999C21 20.1045 20.1046 20.9999 19 20.9999H5C3.89543 20.9999 3 20.1045 3 18.9999ZM5 9.99994H19V18.9999H5L5 9.99994Z"
      />
    </g>
  </svg>
);

export default ArchivedIcon;
